const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Pod = require('../models/Pod');
const { protect } = require('../middleware/authMiddleware');
const PodMember = require('../models/PodMember');
const mongoose = require('mongoose');

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
    console.error('Error creating application:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
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
      pod: app.pod,
      podId: app.pod?._id
    }));
    
    res.json(formatted);
  } catch (err) {
    console.error('Error fetching applications:', err);
    res.status(500).json({ message: 'Failed to fetch applications.' });
  }
});

// @route   PATCH /api/applications/:id/status
// @desc    Update application status
// @access  Private (Creators only)
router.patch('/:id/status', protect, async (req, res) => {
  try {
    console.log('======= STATUS UPDATE REQUEST =======');
    console.log('Request body:', req.body);
    console.log('Request params:', req.params);
    
    const { status } = req.body;
    const userId = req.user._id;
    
    console.log('Status from request:', status);
    
    // Basic request validation
    if (!req.params.id) {
      console.log('Missing application ID');
      return res.status(400).json({ message: 'Application ID is required' });
    }
    
    if (!status) {
      console.log('Missing status in request body');
      return res.status(400).json({ message: 'Status is required in request body' });
    }
    
    // Normalize status for case-insensitive comparison
    const normalizedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    console.log('Normalized status:', normalizedStatus);
    
    // Validate status
    if (!['Pending', 'Accepted', 'Rejected'].includes(normalizedStatus)) {
      console.log('Invalid status:', normalizedStatus);
      return res.status(400).json({ message: 'Invalid status. Must be Pending, Accepted, or Rejected' });
    }
    
    // Find application
    console.log('Finding application with ID:', req.params.id);
    const application = await Application.findById(req.params.id);
    
    if (!application) {
      console.log('Application not found');
      return res.status(404).json({ message: 'Application not found' });
    }
    
    console.log('Found application:', {
      id: application._id,
      podId: application.pod,
      applicantId: application.applicant,
      currentStatus: application.status
    });
    
    // Find pod to check creator
    console.log('Finding pod with ID:', application.pod);
    const pod = await Pod.findById(application.pod);
    
    if (!pod) {
      console.log('Pod not found');
      return res.status(404).json({ message: 'Pod not found' });
    }
    
    console.log('Found pod:', {
      id: pod._id,
      title: pod.title,
      creatorId: pod.creator
    });
    
    // Check if user is pod creator
    if (pod.creator.toString() !== userId.toString()) {
      console.log('User is not pod creator. User:', userId, 'Creator:', pod.creator);
      return res.status(403).json({ message: 'Only the pod creator can update application status' });
    }
    
    console.log('User is authorized to update application status');
    
    // If accepted, create pod membership (if doesn't exist)
    if (normalizedStatus === 'Accepted') {
      console.log('Status is Accepted, handling pod membership');
      
      try {
        // First check if a membership already exists
        const existingMembership = await PodMember.findOne({
          pod: application.pod,
          user: application.applicant
        });
        
        if (existingMembership) {
          console.log('Membership already exists:', existingMembership._id);
          
          // If the membership exists but is inactive or removed, reactivate it
          if (existingMembership.status !== 'active') {
            console.log('Reactivating existing membership');
            existingMembership.status = 'active';
            existingMembership.role = application.roleApplied; // Update role to match application
            await existingMembership.save();
          }
        } else {
          console.log('Creating new pod membership');
          
          // Create new PodMember with required fields
          const newMember = new PodMember({
            pod: application.pod,
            user: application.applicant,
            role: application.roleApplied,
            status: 'active',
            permissions: {
              canEditTasks: true,
              canCreateMilestones: false,
              canInviteMembers: false
            }
          });
          
          console.log('About to save new member');
          
          try {
            const savedMember = await newMember.save();
            console.log('New member saved successfully:', savedMember._id);
          } catch (saveError) {
            // Handle unique index violation
            if (saveError.code === 11000 && saveError.keyPattern && saveError.keyPattern.pod && saveError.keyPattern.user) {
              console.log('Duplicate key error - user already a member of this pod');
              
              // Try to update instead of create
              const updatedMember = await PodMember.findOneAndUpdate(
                { pod: application.pod, user: application.applicant },
                { 
                  role: application.roleApplied,
                  status: 'active',
                  permissions: {
                    canEditTasks: true,
                    canCreateMilestones: false,
                    canInviteMembers: false
                  }
                },
                { new: true }
              );
              
              console.log('Updated existing membership:', updatedMember ? updatedMember._id : 'not found');
            } else {
              // Some other error occurred
              throw saveError;
            }
          }
        }
      } catch (memberError) {
        console.error('Error handling pod membership:', memberError);
        // Log error but don't fail the operation
        // We still want to update the application status
      }
    }
    
    // Update application status
    console.log('Updating application status to:', normalizedStatus);
    application.status = normalizedStatus;
    application.updatedAt = new Date();
    
    const updatedApplication = await application.save();
    console.log('Application status updated successfully');
    
    res.json({
      message: 'Application status updated successfully',
      application: {
        _id: updatedApplication._id,
        status: updatedApplication.status,
        updatedAt: updatedApplication.updatedAt
      }
    });
    
  } catch (err) {
    console.error('Error updating application status:', err);
    res.status(500).json({ 
      message: 'Server error updating application status', 
      error: err.message
    });
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
    
    // Delete the application
    await Application.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Application withdrawn successfully' });
    
  } catch (err) {
    console.error('Error withdrawing application:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;