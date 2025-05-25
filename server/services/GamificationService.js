// server/services/GamificationService.js
const UserProgress = require('../models/UserProgress');
const Profile = require('../models/Profile');
const User = require('../models/User');
const Contribution = require('../models/Contribution');

class GamificationService {
  constructor() {
    // Sophisticated XP calculation system aligned with your contribution system
    this.XP_VALUES = {
      // Pod Lifecycle Actions
      POD_CREATED: 100,
      POD_FIRST_MEMBER_JOINED: 50,
      POD_LAUNCHED: 200,
      POD_COMPLETED: 300,
      
      // Task Actions (matches your task system)
      TASK_CREATED: 15,
      TASK_COMPLETED: 35,
      TASK_COMPLETED_EARLY: 50,
      TASK_ASSIGNED: 10,
      TASK_COMMENTED: 8,
      
      // Milestone Actions
      MILESTONE_CREATED: 40,
      MILESTONE_COMPLETED: 80,
      
      // Member & Collaboration Actions
      JOINED_POD: 25,
      INVITED_MEMBER: 20,
      MEMBER_ACCEPTED: 30,
      PEER_REVIEW_GIVEN: 15,
      
      // Resource & Content Actions
      RESOURCE_UPLOADED: 12,
      DOCUMENTATION_ADDED: 25,
      MESSAGE_SENT: 3,
      
      // Quality Multipliers (Rule-based instead of AI)
      HIGH_QUALITY_WORK: 1.8,
      INNOVATIVE_SOLUTION: 2.2,
      EXCELLENT_COLLABORATION: 1.5,
      CONSISTENT_CONTRIBUTOR: 1.3,
      
      // Streak & Consistency Bonuses
      DAILY_ACTIVITY_BONUS: 5,
      WEEKLY_STREAK_BONUS: 25,
      MONTHLY_CONSISTENCY: 75
    };

    // Advanced Badge System
    this.BADGE_CRITERIA = {
      // First Steps
      FIRST_STEPS: { totalContributions: 1 },
      GETTING_STARTED: { totalContributions: 5, podsJoined: 1 },
      
      // Contribution Levels
      CONTRIBUTOR: { totalContributions: 15 },
      ACTIVE_CONTRIBUTOR: { totalContributions: 50, successRate: 70 },
      VETERAN_CONTRIBUTOR: { totalContributions: 100, successRate: 80 },
      ELITE_CONTRIBUTOR: { totalContributions: 200, successRate: 90 },
      
      // Pod Creation & Leadership
      POD_CREATOR: { podsCreated: 1 },
      SERIAL_CREATOR: { podsCreated: 5 },
      MASTER_CREATOR: { podsCreated: 10, avgPodSuccess: 75 },
      
      // Collaboration & Social
      TEAM_PLAYER: { podsJoined: 10, avgRating: 4.5 },
      MENTOR: { usersHelped: 5, reviewsGiven: 20 },
      COMMUNITY_CHAMPION: { messagesCount: 100, helpfulReviews: 50 },
      
      // Skill & Quality (Rule-based evaluation)
      TECHNICAL_EXCELLENCE: { 
        totalContributions: 50, 
        codeCommits: 30, 
        successRate: 85,
        complexity: 'high'
      },
      DESIGN_MASTERY: { 
        designAssets: 20, 
        successRate: 80,
        highQualityWork: 15
      },
      INNOVATION_PIONEER: { 
        innovativeContributions: 10,
        uniqueSolutions: 5,
        totalXP: 2000
      },
      PROBLEM_SOLVER: { 
        tasksCompleted: 75, 
        bugFixes: 25,
        successRate: 85
      },
      
      // Special Achievements
      EARLY_ADOPTER: { joinDate: '2024-01-01', totalXP: 1000 },
      CONSISTENCY_KING: { consecutiveDays: 30, avgDailyXP: 50 },
      REVENUE_GENERATOR: { totalRevenueContributed: 5000 }
    };

    // Badge metadata for display
    this.BADGE_METADATA = {
      FIRST_STEPS: {
        name: "First Steps",
        description: "Made your first contribution",
        icon: "🌱",
        rarity: "common"
      },
      GETTING_STARTED: {
        name: "Getting Started",
        description: "Active in the community",
        icon: "🚀",
        rarity: "common"
      },
      CONTRIBUTOR: {
        name: "Contributor",
        description: "Regular contributor to projects",
        icon: "👨‍💻",
        rarity: "common"
      },
      ACTIVE_CONTRIBUTOR: {
        name: "Active Contributor",
        description: "Highly active with great success rate",
        icon: "⚡",
        rarity: "uncommon"
      },
      VETERAN_CONTRIBUTOR: {
        name: "Veteran Contributor",
        description: "Experienced contributor with proven track record",
        icon: "🏅",
        rarity: "rare"
      },
      ELITE_CONTRIBUTOR: {
        name: "Elite Contributor",
        description: "Top-tier contributor with exceptional performance",
        icon: "💎",
        rarity: "epic"
      },
      POD_CREATOR: {
        name: "Pod Creator",
        description: "Created your first pod",
        icon: "🌟",
        rarity: "uncommon"
      },
      SERIAL_CREATOR: {
        name: "Serial Creator",
        description: "Multiple successful pod launches",
        icon: "🏭",
        rarity: "rare"
      },
      MASTER_CREATOR: {
        name: "Master Creator",
        description: "Pod creation expert with high success rate",
        icon: "👑",
        rarity: "legendary"
      },
      TEAM_PLAYER: {
        name: "Team Player",
        description: "Excellent collaboration across multiple pods",
        icon: "🤝",
        rarity: "rare"
      },
      MENTOR: {
        name: "Mentor",
        description: "Helping others grow and succeed",
        icon: "🧙‍♂️",
        rarity: "epic"
      },
      COMMUNITY_CHAMPION: {
        name: "Community Champion",
        description: "Active community member and helper",
        icon: "🏆",
        rarity: "legendary"
      },
      TECHNICAL_EXCELLENCE: {
        name: "Technical Excellence",
        description: "Outstanding technical contributions",
        icon: "⚙️",
        rarity: "epic"
      },
      DESIGN_MASTERY: {
        name: "Design Mastery",
        description: "Exceptional design work and creativity",
        icon: "🎨",
        rarity: "epic"
      },
      INNOVATION_PIONEER: {
        name: "Innovation Pioneer",
        description: "Breakthrough solutions and creative thinking",
        icon: "💡",
        rarity: "legendary"
      },
      PROBLEM_SOLVER: {
        name: "Problem Solver",
        description: "Consistently solving complex challenges",
        icon: "🔧",
        rarity: "rare"
      },
      EARLY_ADOPTER: {
        name: "Early Adopter",
        description: "One of the platform's first active users",
        icon: "🌟",
        rarity: "legendary"
      },
      CONSISTENCY_KING: {
        name: "Consistency King",
        description: "Remarkably consistent daily activity",
        icon: "📈",
        rarity: "epic"
      },
      REVENUE_GENERATOR: {
        name: "Revenue Generator",
        description: "Significant contribution to project revenue",
        icon: "💰",
        rarity: "legendary"
      }
    };
  }

  // Main processing function - called automatically by middleware
  async processAction(actionType, userId, actionData = {}) {
    try {
      console.log(`🎮 [GAMIFICATION] Processing: ${actionType} for user ${userId}`);
      
      // Get or create user progress
      let userProgress = await this.getUserProgress(userId);
      const oldLevel = userProgress.currentLevel;
      const oldTier = userProgress.tier;
      
      // Calculate XP with context and rule-based enhancement
      let xpGained = await this.calculateContextualXP(actionType, actionData, userProgress);
      
      // Apply quality multiplier for significant actions (rule-based)
      if (this.shouldUseQualityBonus(actionType)) {
        const qualityMultiplier = this.getQualityMultiplier(actionType, actionData, userProgress);
        xpGained = Math.round(xpGained * qualityMultiplier);
      }
      
      // Apply streak bonuses
      const streakBonus = await this.calculateStreakBonus(userId);
      xpGained += streakBonus;
      
      // Update user progress
      userProgress.totalXP += xpGained;
      userProgress.calculateLevel();
      userProgress.calculateTier();
      userProgress.updateReputation();
      
      // Update action-specific stats
      await this.updateActionStats(userProgress, actionType, actionData);
      
      // Check for newly earned badges
      const newBadges = await this.checkForNewBadges(userId, userProgress, actionType);
      
      // Save all changes
      await userProgress.save();
      
      // Update main user reputation
      await this.updateUserReputation(userId, xpGained);
      
      // Update profile stats
      await this.updateProfileStats(userId, actionType, actionData);
      
      // Create contribution record if applicable
      if (this.shouldCreateContribution(actionType)) {
        await this.createContributionRecord(userId, actionType, actionData, xpGained);
      }
      
      // Handle level up events
      const leveledUp = userProgress.currentLevel > oldLevel;
      if (leveledUp) {
        await this.handleLevelUp(userId, userProgress.currentLevel, oldLevel);
      }
      
      // Handle tier promotion
      const tierPromoted = userProgress.tier !== oldTier;
      if (tierPromoted) {
        await this.handleTierPromotion(userId, userProgress.tier, oldTier);
      }
      
      // Send real-time notifications
      await this.sendNotifications(userId, {
        xpGained,
        totalXP: userProgress.totalXP,
        newLevel: leveledUp ? userProgress.currentLevel : null,
        newTier: tierPromoted ? userProgress.tier : null,
        newBadges,
        actionType
      });
      
      console.log(`✅ [GAMIFICATION] Success: +${xpGained} XP | Level ${userProgress.currentLevel} | ${userProgress.tier} Tier`);
      
      return {
        success: true,
        xpGained,
        totalXP: userProgress.totalXP,
        currentLevel: userProgress.currentLevel,
        tier: userProgress.tier,
        newBadges,
        leveledUp,
        tierPromoted
      };
      
    } catch (error) {
      console.error('❌ [GAMIFICATION] Error:', error);
      return { success: false, error: error.message };
    }
  }

  // Context-aware XP calculation
  async calculateContextualXP(actionType, actionData, userProgress) {
    let baseXP = this.XP_VALUES[actionType] || 10;
    
    // Enhanced context-based calculations
    switch (actionType) {
      case 'TASK_COMPLETED':
        // Difficulty-based multiplier
        const difficultyMultiplier = {
          easy: 0.8, medium: 1.0, hard: 1.5, expert: 2.0
        };
        baseXP *= difficultyMultiplier[actionData.difficulty] || 1.0;
        
        // Early completion bonus
        if (actionData.completedEarly) {
          baseXP *= 1.4;
        }
        
        // High-priority task bonus
        if (actionData.priority === 'high') {
          baseXP *= 1.2;
        }
        break;
        
      case 'POD_CREATED':
        // Quality indicators bonus
        if (actionData.hasDetailedDescription) baseXP *= 1.2;
        if (actionData.rolesCount > 3) baseXP *= 1.1;
        if (actionData.hasMilestones) baseXP *= 1.15;
        if (actionData.category === 'innovation') baseXP *= 1.3;
        break;
        
      case 'JOINED_POD':
        // Popular pod bonus
        if (actionData.podMemberCount > 5) baseXP *= 1.1;
        // High-tier pod bonus
        if (actionData.podCreatorTier === 'gold' || actionData.podCreatorTier === 'platinum') {
          baseXP *= 1.2;
        }
        break;
        
      case 'PEER_REVIEW_GIVEN':
        // Review quality bonus
        const reviewLength = actionData.reviewText?.length || 0;
        if (reviewLength > 200) baseXP *= 1.3;
        if (actionData.includesCodeSuggestions) baseXP *= 1.4;
        if (actionData.hasConstructiveFeedback) baseXP *= 1.2;
        break;
    }
    
    // User tier efficiency multiplier
    const tierMultipliers = { 
      bronze: 1.0, silver: 1.1, gold: 1.25, platinum: 1.4 
    };
    baseXP *= tierMultipliers[userProgress.tier] || 1.0;
    
    // Consistency bonus (active users get slight bonus)
    const daysSinceJoined = Math.floor((Date.now() - userProgress.createdAt) / (1000 * 60 * 60 * 24));
    if (daysSinceJoined > 30 && userProgress.stats.contributionSuccessRate > 80) {
      baseXP *= 1.1;
    }
    
    return Math.round(baseXP);
  }

  // Rule-based Quality Assessment (replaces AI)
  getQualityMultiplier(actionType, actionData, userProgress) {
    let multiplier = 1.0;
    
    switch (actionType) {
      case 'TASK_COMPLETED':
        // Check for quality indicators
        if (actionData.difficulty === 'expert') multiplier += 0.5;
        if (actionData.completedEarly) multiplier += 0.3;
        if (actionData.assignedMembersCount > 1) multiplier += 0.2; // Team effort
        if (userProgress.stats.contributionSuccessRate > 90) multiplier += 0.2;
        break;
        
      case 'POD_CREATED':
        // Comprehensive pod setup indicators
        if (actionData.hasDetailedDescription) multiplier += 0.2;
        if (actionData.rolesCount > 5) multiplier += 0.3;
        if (actionData.hasMilestones) multiplier += 0.2;
        if (actionData.complexity === 'high') multiplier += 0.4;
        break;
        
      case 'PEER_REVIEW_GIVEN':
        // Review depth and helpfulness
        const reviewLength = actionData.reviewText?.length || 0;
        if (reviewLength > 500) multiplier += 0.4;
        if (actionData.includesCodeSuggestions) multiplier += 0.3;
        if (actionData.hasConstructiveFeedback) multiplier += 0.2;
        if (actionData.rating >= 4) multiplier += 0.2;
        break;
        
      case 'RESOURCE_UPLOADED':
      case 'DOCUMENTATION_ADDED':
        // Content quality indicators
        if (actionData.title && actionData.title.length > 20) multiplier += 0.2;
        if (actionData.description && actionData.description.length > 100) multiplier += 0.3;
        if (actionData.fileSize && actionData.fileSize > 1000000) multiplier += 0.2; // Large files
        break;
    }
    
    // Cap multiplier at reasonable bounds
    return Math.min(Math.max(multiplier, 0.5), 2.5);
  }

  // Determine if quality bonus should be applied
  shouldUseQualityBonus(actionType) {
    const qualityActions = [
      'TASK_COMPLETED', 'POD_CREATED', 'MILESTONE_COMPLETED',
      'PEER_REVIEW_GIVEN', 'RESOURCE_UPLOADED', 'DOCUMENTATION_ADDED'
    ];
    return qualityActions.includes(actionType);
  }

  // Update specific stats based on action
  async updateActionStats(userProgress, actionType, actionData) {
    switch (actionType) {
      case 'POD_CREATED':
        userProgress.stats.podsCreated += 1;
        break;
      case 'JOINED_POD':
        userProgress.stats.podsJoined += 1;
        break;
      case 'TASK_COMPLETED':
        // Map to contribution type and increment
        const contribType = this.mapTaskToContributionType(actionData.type || 'general');
        if (userProgress.stats.contributionsByType[contribType] !== undefined) {
          userProgress.stats.contributionsByType[contribType] += 1;
        }
        userProgress.stats.tasksCompleted = (userProgress.stats.tasksCompleted || 0) + 1;
        break;
      case 'PEER_REVIEW_GIVEN':
        userProgress.stats.reviewsGiven += 1;
        break;
      case 'MEMBER_ACCEPTED':
        // When someone joins their pod
        userProgress.stats.totalContributions += 1; // Leadership contribution
        break;
      case 'RESOURCE_UPLOADED':
        userProgress.stats.resourcesShared = (userProgress.stats.resourcesShared || 0) + 1;
        break;
      case 'DOCUMENTATION_ADDED':
        userProgress.stats.documentationContributions = (userProgress.stats.documentationContributions || 0) + 1;
        break;
    }
    
    // Recalculate success rate
    if (userProgress.stats.totalContributions > 0) {
      userProgress.stats.contributionSuccessRate = 
        (userProgress.stats.approvedContributions / userProgress.stats.totalContributions) * 100;
    }
    
    userProgress.lastUpdated = new Date();
  }

  // Map task types to contribution categories
  mapTaskToContributionType(taskType) {
    const mapping = {
      'development': 'code_commit',
      'frontend': 'code_commit', 
      'backend': 'code_commit',
      'design': 'design_asset',
      'ui': 'design_asset',
      'ux': 'design_asset',
      'documentation': 'documentation',
      'testing': 'testing',
      'qa': 'testing',
      'marketing': 'marketing_content',
      'content': 'marketing_content',
      'research': 'user_research',
      'management': 'project_management'
    };
    return mapping[taskType?.toLowerCase()] || 'feature_implementation';
  }

  // Advanced badge checking with rule-based evaluation
  async checkForNewBadges(userId, userProgress, actionType) {
    const newBadges = [];
    
    for (const [badgeId, criteria] of Object.entries(this.BADGE_CRITERIA)) {
      // Skip if already earned - fix the toString error
      const alreadyEarned = userProgress.badges.some(b => {
        if (!b || !b.badgeId) return false;
        return b.badgeId === badgeId || 
               (b.badgeId.toString && b.badgeId.toString() === badgeId) ||
               b.badgeId.valueOf() === badgeId;
      });
      
      if (alreadyEarned) continue;
      
      const earned = this.evaluateTraditionalBadge(criteria, userProgress);
      
      if (earned) {
        const badge = {
          badgeId: badgeId, // Store as string instead of ObjectId for now
          earnedAt: new Date(),
          context: { actionType, level: userProgress.currentLevel },
          metadata: this.BADGE_METADATA[badgeId] || {}
        };
        
        newBadges.push(badge);
        userProgress.badges.push({
          badgeId: badgeId,
          earnedAt: new Date()
        });
        
        console.log(`🏆 Badge earned: ${badgeId} by user ${userId}`);
      }
    }
    
    return newBadges;
  }

  // Traditional criteria evaluation
  evaluateTraditionalBadge(criteria, userProgress) {
    for (const [key, value] of Object.entries(criteria)) {
      let userValue = this.getUserValue(userProgress, key);
      
      // Special handling for different criteria types
      if (key === 'joinDate') {
        const joinDate = new Date(userProgress.createdAt);
        const criteriaDate = new Date(value);
        if (joinDate > criteriaDate) return false;
        continue;
      }
      
      if (key === 'consecutiveDays') {
        // This would need implementation in your activity tracking
        continue; 
      }
      
      if (key === 'successRate') {
        // Use contributionSuccessRate from stats
        userValue = userProgress.stats.contributionSuccessRate || 0;
      }
      
      if (userValue < value) {
        return false;
      }
    }
    return true;
  }

  // Get nested user values for criteria checking
  getUserValue(userProgress, key) {
    const mapping = {
      'totalContributions': userProgress.stats?.totalContributions || 0,
      'podsJoined': userProgress.stats?.podsJoined || 0,
      'podsCreated': userProgress.stats?.podsCreated || 0,
      'reviewsGiven': userProgress.stats?.reviewsGiven || 0,
      'tasksCompleted': userProgress.stats?.tasksCompleted || 0,
      'codeCommits': userProgress.stats?.contributionsByType?.code_commit || 0,
      'designAssets': userProgress.stats?.contributionsByType?.design_asset || 0,
      'totalXP': userProgress.totalXP || 0,
      'avgRating': userProgress.stats?.averageRating || 0,
      'usersHelped': userProgress.stats?.usersHelped || 0,
      'messagesCount': userProgress.stats?.messagesCount || 0,
      'helpfulReviews': userProgress.stats?.helpfulReviews || 0
    };
    
    return mapping[key] || 0;
  }

  // Get or create user progress
  async getUserProgress(userId) {
    let userProgress = await UserProgress.findOne({ userId });
    
    if (!userProgress) {
      userProgress = new UserProgress({ userId });
      await userProgress.save();
    }
    
    return userProgress;
  }

  // Update main user reputation - adjust for your reputation structure
  async updateUserReputation(userId, xpGained) {
    const reputationGain = Math.round(xpGained * 0.3); // Reputation grows slower
    
    // Update the UserProgress reputation structure you have
    const userProgress = await UserProgress.findOne({ userId });
    if (userProgress) {
      userProgress.reputation.breakdown.contributions += reputationGain;
      userProgress.updateReputation(); // Use your existing method
      await userProgress.save();
    }
  }

  // Update profile statistics
  async updateProfileStats(userId, actionType, actionData) {
    try {
      const profile = await Profile.findOne({ user: userId });
      if (!profile) return;
      
      // Update relevant stats
      switch (actionType) {
        case 'POD_CREATED':
          profile.stats.podsCreated = (profile.stats.podsCreated || 0) + 1;
          break;
        case 'JOINED_POD':
          profile.stats.podsJoined = (profile.stats.podsJoined || 0) + 1;
          break;
        case 'TASK_COMPLETED':
          profile.stats.tasksCompleted = (profile.stats.tasksCompleted || 0) + 1;
          break;
        case 'PEER_REVIEW_GIVEN':
          profile.stats.reviewsGiven = (profile.stats.reviewsGiven || 0) + 1;
          break;
      }
      
      profile.stats.lastActive = new Date();
      await profile.save();
      
    } catch (error) {
      console.error('Profile stats update failed:', error);
    }
  }

  // Create contribution record for significant actions
  async createContributionRecord(userId, actionType, actionData, xpGained) {
    try {
      const contributionTypeMap = {
        'TASK_COMPLETED': 'feature_implementation',
        'DOCUMENTATION_ADDED': 'documentation', 
        'PEER_REVIEW_GIVEN': 'code_review',
        'RESOURCE_UPLOADED': 'design_asset'
      };
      
      const contributionType = contributionTypeMap[actionType];
      if (!contributionType) return;
      
      const contribution = new Contribution({
        userId,
        podId: actionData.podId,
        type: contributionType,
        title: actionData.title || `${actionType} - Auto Generated`,
        description: actionData.description || `Automatically tracked from ${actionType}`,
        difficulty: actionData.difficulty || 'medium',
        impact: actionData.impact || 'medium',
        status: 'approved', // Auto-approve gamification contributions
        totalXP: xpGained,
        baseXP: Math.round(xpGained * 0.8),
        approvedAt: new Date()
      });
      
      await contribution.save();
      
    } catch (error) {
      console.error('Contribution record creation failed:', error);
    }
  }

  // Determine if action should create contribution record
  shouldCreateContribution(actionType) {
    const contributionActions = [
      'TASK_COMPLETED', 'DOCUMENTATION_ADDED', 
      'PEER_REVIEW_GIVEN', 'RESOURCE_UPLOADED'
    ];
    return contributionActions.includes(actionType);
  }

  // Handle level up events
  async handleLevelUp(userId, newLevel, oldLevel) {
    console.log(`🎉 Level Up! User ${userId}: ${oldLevel} → ${newLevel}`);
    
    // Award level up bonus
    const bonusXP = newLevel * 15;
    await UserProgress.findOneAndUpdate(
      { userId },
      { $inc: { totalXP: bonusXP } }
    );
    
    // Unlock features based on level milestones
    const levelRewards = {
      5: { feature: 'advanced_search', bonus: 50 },
      10: { feature: 'priority_support', bonus: 100 },
      15: { feature: 'beta_access', bonus: 150 },
      20: { feature: 'mentorship_program', bonus: 200 },
      25: { feature: 'governance_voting', bonus: 300 }
    };
    
    if (levelRewards[newLevel]) {
      console.log(`🔓 Unlocking: ${levelRewards[newLevel].feature} for user ${userId}`);
    }
  }

  // Handle tier promotions
  async handleTierPromotion(userId, newTier, oldTier) {
    console.log(`⭐ Tier Promotion! User ${userId}: ${oldTier} → ${newTier}`);
    
    // Award tier promotion bonus
    const tierBonuses = { silver: 200, gold: 500, platinum: 1000 };
    const bonus = tierBonuses[newTier] || 0;
    
    if (bonus > 0) {
      await UserProgress.findOneAndUpdate(
        { userId },
        { $inc: { totalXP: bonus } }
      );
    }
  }

  // Calculate streak bonuses
  async calculateStreakBonus(userId) {
    // This would implement daily activity streak tracking
    // For now, return 0 but the structure is ready
    return 0;
  }

  // Send real-time notifications
  async sendNotifications(userId, data) {
    try {
      // Integration with your notification system
      const NotificationService = require('./NotificationService');
      
      if (data.xpGained > 0) {
        await NotificationService.sendXPGained(userId, data);
      }
      
      if (data.newBadges && data.newBadges.length > 0) {
        for (const badge of data.newBadges) {
          await NotificationService.sendAchievementNotification(userId, badge);
        }
      }
      
      if (data.newLevel) {
        await NotificationService.sendLevelUp(userId, {
          newLevel: data.newLevel,
          totalXP: data.totalXP
        });
      }
    } catch (error) {
      console.error('Notification sending failed:', error);
    }
  }
}

module.exports = new GamificationService();