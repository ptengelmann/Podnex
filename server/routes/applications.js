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

// Later we can add GET /api/applications if you want droppers to see who applied!

module.exports = router;
