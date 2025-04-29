const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Pod = require('../models/Pod');
const { protect } = require('../middleware/authMiddleware');


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
        .populate('applicant', 'name')
        .populate({
          path: 'pod',
          populate: { path: 'creator', select: 'name _id' }
        });
    } else {
      applications = await Application.find({ applicant: userId })
        .populate('applicant', 'name')
        .populate({
          path: 'pod',
          populate: { path: 'creator', select: 'name _id' }
        });
    }


    const formatted = applications.map(app => ({
      _id: app._id,
      roleApplied: app.roleApplied,
      experience: app.experience,
      motivation: app.motivation,
      portfolioLink: app.portfolioLink,
      status: app.status,
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



module.exports = router;
