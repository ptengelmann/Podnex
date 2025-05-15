const express = require('express');
const router = express.Router();
const Pod = require('../models/Pod');
const PodMember = require('../models/PodMember');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/contributor/memberships
// @desc    Get all pods where the current user is a member
// @access  Private
router.get('/memberships', protect, async (req, res) => {
  try {
    console.log('CONTRIBUTOR MEMBERSHIPS ENDPOINT HIT');
    const userId = req.user._id;
    
    console.log('Looking for memberships for user ID:', userId);
    console.log('User from request:', req.user);
    
    // Find all active memberships for this user
    const memberships = await PodMember.find({ 
      user: userId,
      status: 'active'
    })
    .populate({
      path: 'pod',
      select: 'title description status category creator createdAt updatedAt',
      populate: { path: 'creator', select: 'name _id' }
    })
    .sort({ joinedAt: -1 });
    
    console.log(`Found ${memberships.length} active memberships for user ${userId}`);
    
    if (memberships.length > 0) {
      console.log('Sample membership:', {
        id: memberships[0]._id,
        podTitle: memberships[0].pod?.title,
        role: memberships[0].role
      });
    }
    
    res.json(memberships);
  } catch (error) {
    console.error('Error in contributor-memberships endpoint:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// @route   GET /api/contributor/applications
// @desc    Get all applications submitted by the current user
// @access  Private
router.get('/applications', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Find all applications where this user is the applicant
    const applications = await Application.find({ 
      applicantId: userId 
    })
    .sort({ createdAt: -1 });
    
    res.json(applications);
  } catch (error) {
    console.error('Error in contributor-applications endpoint:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;