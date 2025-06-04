// routes/gamificationRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const UserProgress = require('../models/UserProgress');
const Contribution = require('../models/Contribution');

// @route   GET /api/gamification/activities
// @desc    Get activities for the activity feed (Pod Environment contributions tab)
// @access  Private
router.get('/activities', protect, async (req, res) => {
  try {
    const { podId, type, limit = 20 } = req.query;
    
    // Build query for contributions (your existing model)
    const query = {};
    if (podId) query.podId = podId;
    if (type && type !== 'all') query.type = type;
    
    // Only show approved contributions for the activity feed
    query.status = 'approved';
    
    const contributions = await Contribution.find(query)
      .populate('userId', 'name profileImage')
      .populate('podId', 'title')
      .sort({ approvedAt: -1, createdAt: -1 })
      .limit(parseInt(limit));
    
    // Format for the frontend (match the expected structure)
    const activities = contributions.map(contrib => ({
      _id: contrib._id,
      type: contrib.type,
      title: contrib.title,
      description: contrib.description,
      user: contrib.userId,
      podId: contrib.podId?._id,
      podTitle: contrib.podId?.title,
      xpGained: contrib.totalXP,
      createdAt: contrib.approvedAt || contrib.createdAt,
      object: {
        _id: contrib._id,
        title: contrib.title,
        description: contrib.description
      }
    }));
    
    res.json(activities);
    
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/gamification/contributions
// @desc    Get contributions for a user (Profile page contributions tab)
// @access  Private  
router.get('/contributions', protect, async (req, res) => {
  try {
    const { userId, type, limit = 20, page = 1 } = req.query;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    // Build query
    const query = { userId };
    if (type && type !== 'all') query.type = type;
    
    // Only show approved contributions
    query.status = 'approved';
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const contributions = await Contribution.find(query)
      .populate('podId', 'title')
      .sort({ approvedAt: -1, createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);
    
    const total = await Contribution.countDocuments(query);
    
    // Format for frontend
    const formattedContributions = contributions.map(contrib => ({
      _id: contrib._id,
      type: contrib.type,
      title: contrib.title,
      description: contrib.description,
      xpGained: contrib.totalXP,
      podId: contrib.podId?._id,
      podTitle: contrib.podId?.title,
      createdAt: contrib.approvedAt || contrib.createdAt,
      object: {
        _id: contrib._id,
        title: contrib.title,
        description: contrib.description
      }
    }));
    
    res.json(formattedContributions);
    
  } catch (error) {
    console.error('Error fetching contributions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/gamification/me
// @desc    Get current user's gamification data
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    let userProgress = await UserProgress.findOne({ userId: req.user._id });
    
    if (!userProgress) {
      userProgress = new UserProgress({ userId: req.user._id });
      await userProgress.save();
    }
    
    res.json({
      success: true,
      data: {
        totalXP: userProgress.totalXP,
        currentLevel: userProgress.currentLevel,
        tier: userProgress.tier,
        badges: userProgress.badges,
        stats: userProgress.stats
      }
    });
    
  } catch (error) {
    console.error('Error fetching gamification data:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch gamification data' 
    });
  }
});

// @route   GET /api/gamification/user/:userId/progress
// @desc    Get user progress by ID
// @access  Private
router.get('/user/:userId/progress', protect, async (req, res) => {
  try {
    let userProgress = await UserProgress.findOne({ userId: req.params.userId });
    
    if (!userProgress) {
      userProgress = new UserProgress({ userId: req.params.userId });
      await userProgress.save();
    }
    
    res.json({
      success: true,
      data: userProgress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @route   GET /api/gamification/user/:userId/badges
// @desc    Get user badges with metadata
// @access  Private
router.get('/user/:userId/badges', protect, async (req, res) => {
  try {
    const GamificationService = require('../services/GamificationService');
    const userProgress = await GamificationService.getUserProgress(req.params.userId);
    
    // Add metadata to badges
    const badgesWithMetadata = userProgress.badges.map(badge => ({
      ...badge.toObject(),
      metadata: GamificationService.BADGE_METADATA[badge.badgeId] || {}
    }));
    
    res.json({
      success: true,
      data: badgesWithMetadata
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @route   POST /api/gamification/trigger
// @desc    Manual gamification trigger (for testing)
// @access  Private
router.post('/trigger', protect, async (req, res) => {
  try {
    const { actionType, userId, actionData } = req.body;
    const GamificationService = require('../services/GamificationService');
    
    const result = await GamificationService.processAction(actionType, userId, actionData);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;