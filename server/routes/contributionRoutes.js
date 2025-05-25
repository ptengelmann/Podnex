const express = require('express');
const router = express.Router();
const Contribution = require('../models/Contribution');
const UserProgress = require('../models/UserProgress');
const Pod = require('../models/Pod');
const PodMember = require('../models/PodMember');
const { protect } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

// Test route (keep this)
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Contribution routes are working!',
    timestamp: new Date().toISOString()
  });
});

// GET /api/contributions/user/:userId - Get contributions for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    console.log('Fetching contributions for user:', userId);
    
    const contributions = await Contribution.find({ userId })
      .populate('podId', 'title')
      .populate('reviews.reviewerId', 'name')
      .sort({ createdAt: -1 })
      .limit(50);
    
    console.log(`Found ${contributions.length} contributions for user ${userId}`);
    
    res.json(contributions);
    
  } catch (error) {
    console.error('Error fetching user contributions:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

// GET /api/contributions/progress/:userId - Get user progress and XP data
router.get('/progress/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    console.log('Fetching progress for user:', userId);
    
    let userProgress = await UserProgress.findOne({ userId })
      .populate('badges.badgeId');
    
    if (!userProgress) {
      // Create new progress record if none exists
      console.log('Creating new progress record for user:', userId);
      userProgress = new UserProgress({ userId });
      await userProgress.save();
    }
    
    // Ensure calculations are up to date
    userProgress.calculateLevel();
    userProgress.calculateTier();
    userProgress.updateReputation();
    
    console.log('Returning progress:', {
      userId,
      totalXP: userProgress.totalXP,
      level: userProgress.currentLevel,
      tier: userProgress.tier
    });
    
    res.json(userProgress);
    
  } catch (error) {
    console.error('Error fetching user progress:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

// POST /api/contributions - Submit a new contribution
router.post('/', async (req, res) => {
  try {
    const userId = req.user._id;
    const contributionData = req.body;
    
    console.log('Contribution submission:', { userId, contributionData });
    
    // Basic validation
    if (!contributionData.podId || !contributionData.type || !contributionData.title) {
      return res.status(400).json({ 
        message: 'Pod ID, type, and title are required' 
      });
    }
    
    // Validate pod exists (optional - you can skip this if pods aren't required)
    if (contributionData.podId) {
      const pod = await Pod.findById(contributionData.podId);
      if (!pod) {
        return res.status(404).json({ message: 'Pod not found' });
      }
    }
    
    // Create contribution
    const contribution = new Contribution({
      userId,
      podId: contributionData.podId,
      type: contributionData.type,
      title: contributionData.title,
      description: contributionData.description,
      difficulty: contributionData.difficulty || 'medium',
      impact: contributionData.impact || 'medium',
      evidence: contributionData.evidence || {},
      status: 'pending'
    });
    
    // Calculate XP
    contribution.calculateXP();
    await contribution.save();
    
    console.log('Contribution created:', contribution._id);
    
    // Update user stats
    await updateUserContributionStats(userId, 'submitted');
    
    res.status(201).json({ 
      success: true, 
      contribution,
      message: 'Contribution submitted successfully' 
    });
    
  } catch (error) {
    console.error('Error submitting contribution:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Helper function to update user contribution stats
async function updateUserContributionStats(userId, action, contributionType = null) {
  try {
    let userProgress = await UserProgress.findOne({ userId });
    if (!userProgress) {
      userProgress = new UserProgress({ userId });
    }
    
    switch (action) {
      case 'submitted':
        userProgress.stats.totalContributions += 1;
        break;
        
      case 'approved':
        userProgress.stats.approvedContributions += 1;
        if (contributionType) {
          userProgress.stats.contributionsByType[contributionType] += 1;
        }
        
        // Update success rate
        userProgress.stats.contributionSuccessRate = 
          (userProgress.stats.approvedContributions / userProgress.stats.totalContributions) * 100;
        break;
    }
    
    userProgress.lastUpdated = new Date();
    await userProgress.save();
    
    console.log('Updated user stats:', {
      userId,
      totalContributions: userProgress.stats.totalContributions,
      approvedContributions: userProgress.stats.approvedContributions
    });
    
  } catch (error) {
    console.error('Error updating user stats:', error);
  }
}

module.exports = router;