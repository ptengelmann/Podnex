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
    const { type, status, page = 1, limit = 20 } = req.query;
    
    console.log('Fetching contributions for user:', userId);
    
    // Validate userId
    if (!userId || userId === 'undefined' || userId === 'null') {
      console.log('Invalid userId received:', userId);
      return res.status(400).json({ 
        message: 'Invalid user ID provided',
        error: 'userId is required and must be valid'
      });
    }
    
    // Check if userId is a valid ObjectId format
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      console.log('Invalid ObjectId format:', userId);
      return res.status(400).json({ 
        message: 'Invalid user ID format',
        error: 'userId must be a valid ObjectId'
      });
    }

    // Build query
    const query = { userId };
    if (type && type !== 'all') query.type = type;
    if (status && status !== 'all') query.status = status;
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const contributions = await Contribution.find(query)
      .populate('podId', 'title')
      .populate('reviews.reviewerId', 'name profileImage')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);
    
    const total = await Contribution.countDocuments(query);
    
    console.log(`Found ${contributions.length} contributions for user ${userId}`);
    
    res.json({
      contributions,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
    
  } catch (error) {
    console.error('Error fetching user contributions:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

// GET /api/contributions/pod/:podId - Get contributions for a specific pod
router.get('/pod/:podId', async (req, res) => {
  try {
    const { podId } = req.params;
    const { type, status, page = 1, limit = 20 } = req.query;
    
    console.log('Fetching contributions for pod:', podId);
    
    // Build query
    const query = { podId };
    if (type && type !== 'all') query.type = type;
    if (status && status !== 'all') query.status = status;
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const contributions = await Contribution.find(query)
      .populate('userId', 'name profileImage')
      .populate('reviews.reviewerId', 'name profileImage')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);
    
    const total = await Contribution.countDocuments(query);
    
    console.log(`Found ${contributions.length} contributions for pod ${podId}`);
    
    res.json({
      contributions,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
    
  } catch (error) {
    console.error('Error fetching pod contributions:', error);
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
    
    let userProgress = await UserProgress.findOne({ userId });
    
    if (!userProgress) {
      // Create new progress record if none exists
      console.log('Creating new progress record for user:', userId);
      userProgress = new UserProgress({ 
        userId,
        totalXP: 0,
        currentLevel: 1,
        tier: 'bronze',
        badges: [],
        stats: {
          totalContributions: 0,
          approvedContributions: 0,
          contributionSuccessRate: 0,
          podsCreated: 0,
          podsJoined: 0,
          reviewsGiven: 0,
          contributionsByType: {
            code_commit: 0,
            design_asset: 0,
            documentation: 0,
            bug_fix: 0,
            feature_implementation: 0,
            code_review: 0,
            testing: 0,
            marketing_content: 0,
            user_research: 0,
            project_management: 0,
            mentoring: 0,
            community_building: 0
          }
        }
      });
      await userProgress.save();
    }
    
    // Safely ensure calculations are up to date
    try {
      if (userProgress.calculateLevel) userProgress.calculateLevel();
      if (userProgress.calculateTier) userProgress.calculateTier();
      if (userProgress.updateReputation) userProgress.updateReputation();
    } catch (calcError) {
      console.warn('Error in calculations:', calcError);
    }
    
    console.log('Returning progress:', {
      userId,
      totalXP: userProgress.totalXP,
      level: userProgress.currentLevel,
      tier: userProgress.tier
    });
    
    // Return clean data structure
    res.json({
      totalXP: userProgress.totalXP || 0,
      currentLevel: userProgress.currentLevel || 1,
      tier: userProgress.tier || 'bronze',
      badges: userProgress.badges || [],
      stats: userProgress.stats || {},
      reputation: userProgress.reputation || { score: 0 },
      createdAt: userProgress.createdAt,
      lastUpdated: userProgress.lastUpdated
    });
    
  } catch (error) {
    console.error('Error fetching user progress:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

// POST /api/contributions - Submit a new contribution (MANUAL)
router.post('/', async (req, res) => {
  try {
    const userId = req.user._id;
    const contributionData = req.body;
    
    console.log('Manual contribution submission:', { userId, contributionData });
    
    // Basic validation
    if (!contributionData.podId || !contributionData.type || !contributionData.title) {
      return res.status(400).json({ 
        message: 'Pod ID, type, and title are required' 
      });
    }
    
    // Validate pod exists and user is a member
    const pod = await Pod.findById(contributionData.podId);
    if (!pod) {
      return res.status(404).json({ message: 'Pod not found' });
    }
    
    // Check if user is a member or creator
    const isMember = await PodMember.findOne({ 
      pod: contributionData.podId, 
      user: userId, 
      status: 'active' 
    });
    
    const isCreator = pod.creator.toString() === userId.toString();
    
    if (!isMember && !isCreator) {
      return res.status(403).json({ 
        message: 'You must be a member of this pod to submit contributions' 
      });
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
      status: 'pending' // Manual contributions need review
    });
    
    // Calculate XP
    contribution.calculateXP();
    await contribution.save();
    
    console.log('Manual contribution created:', contribution._id);
    
    // Update user stats
    await updateUserContributionStats(userId, 'submitted');
    
    // Populate for response
    await contribution.populate('userId', 'name profileImage');
    await contribution.populate('podId', 'title');
    
    res.status(201).json({ 
      success: true, 
      contribution,
      message: 'Contribution submitted for review' 
    });
    
  } catch (error) {
    console.error('Error submitting contribution:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Add this helper function before the routes
async function updateProfileStats(userId) {
  try {
    const Profile = require('../models/Profile');
    
    // Get all contributions for this user
    const contributions = await Contribution.find({ userId, status: 'approved' });
    
    // Calculate stats
    const stats = {
      tasksCompleted: contributions.filter(c => 
        c.type === 'task_completed' || c.type === 'feature_implementation'
      ).length,
      contributionCount: contributions.length,
      successRate: contributions.length > 0 ? 100 : 0,
    };
    
    // Update the profile
    await Profile.findOneAndUpdate(
      { user: userId },
      { 
        $set: { 
          'stats.tasksCompleted': stats.tasksCompleted,
          'stats.contributionCount': stats.contributionCount,
          'stats.successRate': stats.successRate
        }
      }
    );
    
    console.log('Updated profile stats for user:', userId, stats);
  } catch (error) {
    console.error('Error updating profile stats:', error);
  }
}

// POST /api/contributions/auto - Create automatic contribution (called by system)
router.post('/auto', async (req, res) => {
  try {
    const { userId, podId, type, title, description, difficulty, impact, evidence } = req.body;
    
    console.log('Automatic contribution creation:', { userId, podId, type, title });
    
    // Create contribution with auto-approval for system actions
    const contribution = new Contribution({
      userId,
      podId,
      type,
      title,
      description: description || `Automatically tracked: ${title}`,
      difficulty: difficulty || 'medium',
      impact: impact || 'medium',
      evidence: evidence || {},
      status: 'approved' // Auto-approve system-generated contributions
    });
    
    // Calculate XP
    contribution.calculateXP();
    contribution.approvedAt = new Date();
    await contribution.save();
    
    console.log('Automatic contribution created:', contribution._id);
    
    // Update user stats
    await updateUserContributionStats(userId, 'approved', type);
    
    // Award XP to user
    await awardXPToUser(userId, contribution.totalXP, type);
    
    // UPDATE PROFILE STATS - NEW LINE ADDED
    await updateProfileStats(userId);
    
    res.status(201).json({ 
      success: true, 
      contribution,
      xpAwarded: contribution.totalXP 
    });
    
  } catch (error) {
    console.error('Error creating automatic contribution:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

// PUT /api/contributions/:id/review - Review a contribution (approve/reject)
router.put('/:id/review', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, feedback } = req.body;
    const reviewerId = req.user._id;
    
    if (!['approved', 'rejected', 'needs_revision'].includes(status)) {
      return res.status(400).json({ message: 'Invalid review status' });
    }
    
    const contribution = await Contribution.findById(id)
      .populate('podId')
      .populate('userId');
    
    if (!contribution) {
      return res.status(404).json({ message: 'Contribution not found' });
    }
    
    // Check if reviewer has permission (pod creator or admin)
    const pod = contribution.podId;
    const isCreator = pod.creator.toString() === reviewerId.toString();
    // Add admin check if you have admin roles
    
    if (!isCreator) {
      return res.status(403).json({ 
        message: 'Only pod creators can review contributions' 
      });
    }
    
    // Update contribution status
    contribution.status = status;
    
    // Add review
    contribution.reviews.push({
      reviewerId,
      status,
      feedback,
      timestamp: new Date()
    });
    
    if (status === 'approved') {
      contribution.approvedAt = new Date();
      
      // Award XP to user
      await awardXPToUser(contribution.userId._id, contribution.totalXP, contribution.type);
      
      // Update user stats
      await updateUserContributionStats(contribution.userId._id, 'approved', contribution.type);
    }
    
    await contribution.save();
    
    res.json({ 
      success: true, 
      contribution,
      message: `Contribution ${status}` 
    });
    
  } catch (error) {
    console.error('Error reviewing contribution:', error);
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
        if (contributionType && userProgress.stats.contributionsByType[contributionType] !== undefined) {
          userProgress.stats.contributionsByType[contributionType] += 1;
        }
        
        // Update success rate
        if (userProgress.stats.totalContributions > 0) {
          userProgress.stats.contributionSuccessRate = 
            (userProgress.stats.approvedContributions / userProgress.stats.totalContributions) * 100;
        }
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

// Helper function to award XP to user
async function awardXPToUser(userId, xpAmount, contributionType) {
  try {
    let userProgress = await UserProgress.findOne({ userId });
    if (!userProgress) {
      userProgress = new UserProgress({ userId });
    }
    
    const oldLevel = userProgress.currentLevel;
    const oldTier = userProgress.tier;
    
    // Add XP
    userProgress.totalXP += xpAmount;
    
    // Recalculate level and tier
    userProgress.calculateLevel();
    userProgress.calculateTier();
    userProgress.updateReputation();
    
    await userProgress.save();
    
    // Check for level up
    const leveledUp = userProgress.currentLevel > oldLevel;
    const tierPromoted = userProgress.tier !== oldTier;
    
    console.log(`Awarded ${xpAmount} XP to user ${userId}`, {
      totalXP: userProgress.totalXP,
      level: userProgress.currentLevel,
      tier: userProgress.tier,
      leveledUp,
      tierPromoted
    });
    
    // Send notifications if you have a notification system
    // NotificationService.sendXPGained(userId, { xpAmount, totalXP: userProgress.totalXP });
    
    return { leveledUp, tierPromoted, totalXP: userProgress.totalXP };
    
  } catch (error) {
    console.error('Error awarding XP:', error);
  }
}

module.exports = router;