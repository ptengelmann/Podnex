const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Pod = require('../models/Pod');
const { protect } = require('../middleware/authMiddleware');
const PodMember = require('../models/PodMember');


// @route   POST /api/applications
// @desc    Submit application for a Pod Role
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { podId, roleApplied, experience, motivation, portfolioLink } = req.body;
    
    if (!podId || !roleApplied || !experience || !motivation) {
      return res.status(400).json({ message: 'All fields except portfolio are required.' });
    }
    
    const pod = await Pod.findById(podId);
    if (!pod) {
      return res.status(404).json({ message: 'Pod not found.' });
    }
    
    // Prevent creators from applying to their own pods
    if (pod.creator.toString() === req.user._id.toString()) {
      return res.status(403).json({ message: 'You cannot apply to your own pod.' });
    }
    
    const application = new Application({
      pod: podId,
      roleApplied,
      experience,
      motivation,
      portfolioLink,
      applicant: req.user._id,
      status: 'Pending',
      createdAt: new Date()
    });
    
    await application.save();
    res.status(201).json(application);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/applications
// @desc    Get applications depending on role
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;
    
    let applications;
    
    if (userRole === 'creator') {
      const userPods = await Pod.find({ creator: userId });
      const podIds = userPods.map(p => p._id);
      
      applications = await Application.find({ pod: { $in: podIds } })
        .populate('applicant', 'name email profileImage')
        .populate({
          path: 'pod',
          populate: { path: 'creator', select: 'name _id' }
        })
        .sort({ createdAt: -1 });
    } else {
      applications = await Application.find({ applicant: userId })
        .populate('applicant', 'name email profileImage')
        .populate({
          path: 'pod',
          populate: { path: 'creator', select: 'name _id' }
        })
        .sort({ createdAt: -1 });
    }
    
    const formatted = applications.map(app => ({
      _id: app._id,
      roleApplied: app.roleApplied,
      experience: app.experience,
      motivation: app.motivation,
      portfolioLink: app.portfolioLink,
      status: app.status,
      createdAt: app.createdAt,
      updatedAt: app.updatedAt,
      podTitle: app.pod?.title || 'Untitled Pod',
      applicantName: app.applicant?.name || 'Anonymous',
      applicant: app.applicant,
      pod: app.pod
    }));
    
    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch applications.' });
  }
});

// @route   PATCH /api/applications/:id/status
// @desc    Update application status
// @access  Private (Creators only)
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const userId = req.user._id;
    
    // Validate status
    if (!['Pending', 'Accepted', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    // Inside your PATCH '/:id/status' route when status is set to 'Accepted'
if (status === 'Accepted') {
  // Check if membership already exists to avoid duplicates
  const existingMembership = await PodMember.findOne({
    pod: application.pod._id,
    user: application.applicant
  });
  
  if (!existingMembership) {
    // Create new pod membership
    const newMember = new PodMember({
      pod: application.pod._id,
      user: application.applicant,
      role: application.roleApplied,
      // Set permissions based on role if needed
      permissions: {
        canEditTasks: true,
        canCreateMilestones: false,
        canInviteMembers: false
      }
    });
    
    await newMember.save();
    console.log(`New member added to pod: ${application.pod.title}`);
  }
}
    
    // Find the application
    const application = await Application.findById(req.params.id)
      .populate({
        path: 'pod',
        select: 'creator title'
      });
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    // Check if the user is the creator of the pod
    if (application.pod.creator.toString() !== userId.toString()) {
      return res.status(403).json({ 
        message: 'Only the pod creator can update application status' 
      });
    }
    
    // Update the status
    application.status = status;
    application.updatedAt = new Date();
    await application.save();
    
    res.json({ 
      message: 'Application status updated', 
      application: {
        _id: application._id,
        status: application.status,
        updatedAt: application.updatedAt
      } 
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/applications/:id
// @desc    Withdraw application (delete or mark as withdrawn)
// @access  Private (Only the applicant)
router.delete('/:id', protect, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    // Check if the user is the applicant
    if (application.applicant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'Only the applicant can withdraw their application' 
      });
    }
    
    // Option 1: Delete the application
    await Application.findByIdAndDelete(req.params.id);
    
    // Option 2: Mark as withdrawn
    // application.status = 'Withdrawn';
    // application.updatedAt = new Date();
    // await application.save();
    
    res.json({ message: 'Application withdrawn successfully' });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;