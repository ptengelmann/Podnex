const express = require('express');
const router = express.Router();
const Pod = require('../models/Pod');
const PodMember = require('../models/PodMember');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/creator/pods
// @desc    Get all pods created by the current user
// @access  Private
router.get('/pods', protect, async (req, res) => {
  try {
    console.log('CREATOR PODS ENDPOINT HIT');
    const userId = req.user._id;
    
    console.log('Looking for pods with creator ID:', userId);
    console.log('User from request:', req.user);
    
    const pods = await Pod.find({ creator: userId })
      .sort({ createdAt: -1 });
    
    console.log(`Found ${pods.length} pods for creator ${userId}`);
    
    // For each pod, get the number of members
    const podsWithMemberCount = await Promise.all(pods.map(async (pod) => {
      const memberCount = await PodMember.countDocuments({ 
        pod: pod._id, 
        status: 'active' 
      });
      
      // Create a complete pod object with all data
      return {
        ...pod._doc,
        memberCount
      };
    }));
    
    console.log(`Returning ${podsWithMemberCount.length} pods with member counts`);
    res.json(podsWithMemberCount);
  } catch (error) {
    console.error('Error in creator-pods endpoint:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
});

module.exports = router;