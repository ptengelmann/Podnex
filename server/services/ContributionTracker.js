// services/ContributionTracker.js
const Contribution = require('../models/Contribution');
const UserProgress = require('../models/UserProgress');

class ContributionTracker {
  
  // Track task completion
  static async trackTaskCompletion(userId, taskData, podId) {
    try {
      const contribution = new Contribution({
        userId,
        podId,
        type: 'feature_implementation', // Maps to your existing types
        title: `Completed Task: ${taskData.title}`,
        description: taskData.description || 'Task completed successfully',
        difficulty: taskData.priority === 'high' ? 'hard' : 'medium',
        impact: taskData.priority === 'high' ? 'high' : 'medium',
        evidence: {
          taskId: taskData._id,
          completedAt: new Date()
        },
        status: 'approved', // Auto-approve system-generated contributions
        approvedAt: new Date()
      });

      // Calculate XP
      contribution.calculateXP();
      await contribution.save();

      // Award XP to user
      await this.awardXPToUser(userId, contribution.totalXP, contribution.type);
      
      console.log('✅ Task completion tracked as contribution:', contribution._id);
      return contribution;
      
    } catch (error) {
      console.error('❌ Failed to track task completion:', error);
    }
  }

  // Track resource upload
  static async trackResourceUpload(userId, resourceData, podId) {
    try {
      const contribution = new Contribution({
        userId,
        podId,
        type: 'design_asset', // Or 'documentation' based on file type
        title: `Uploaded Resource: ${resourceData.name}`,
        description: resourceData.description || 'Resource uploaded to pod',
        difficulty: 'easy',
        impact: 'medium',
        evidence: {
          resourceId: resourceData._id,
          fileName: resourceData.name,
          fileSize: resourceData.fileSize
        },
        status: 'approved', // Auto-approve system-generated contributions
        approvedAt: new Date()
      });

      // Calculate XP
      contribution.calculateXP();
      await contribution.save();

      // Award XP to user
      await this.awardXPToUser(userId, contribution.totalXP, contribution.type);
      
      console.log('✅ Resource upload tracked as contribution:', contribution._id);
      return contribution;
      
    } catch (error) {
      console.error('❌ Failed to track resource upload:', error);
    }
  }

  // Track milestone completion
  static async trackMilestoneCompletion(userId, milestoneData, podId) {
    try {
      const contribution = new Contribution({
        userId,
        podId,
        type: 'project_management',
        title: `Completed Milestone: ${milestoneData.title}`,
        description: milestoneData.description || 'Milestone completed successfully',
        difficulty: 'hard',
        impact: 'high',
        evidence: {
          milestoneId: milestoneData._id,
          completedAt: new Date()
        },
        status: 'approved', // Auto-approve system-generated contributions
        approvedAt: new Date()
      });

      // Calculate XP
      contribution.calculateXP();
      await contribution.save();

      // Award XP to user
      await this.awardXPToUser(userId, contribution.totalXP, contribution.type);
      
      console.log('✅ Milestone completion tracked as contribution:', contribution._id);
      return contribution;
      
    } catch (error) {
      console.error('❌ Failed to track milestone completion:', error);
    }
  }

  // Track pod creation
  static async trackPodCreation(userId, podData) {
    try {
      const contribution = new Contribution({
        userId,
        podId: podData._id,
        type: 'project_management',
        title: `Created Pod: ${podData.title}`,
        description: podData.mission || 'New pod created and launched',
        difficulty: 'hard',
        impact: 'high',
        evidence: {
          podId: podData._id,
          createdAt: new Date()
        },
        status: 'approved', // Auto-approve system-generated contributions
        approvedAt: new Date()
      });

      // Calculate XP
      contribution.calculateXP();
      await contribution.save();

      // Award XP to user
      await this.awardXPToUser(userId, contribution.totalXP, contribution.type);
      
      console.log('✅ Pod creation tracked as contribution:', contribution._id);
      return contribution;
      
    } catch (error) {
      console.error('❌ Failed to track pod creation:', error);
    }
  }

  // Helper function to award XP to user
  static async awardXPToUser(userId, xpAmount, contributionType) {
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

      // Update stats
      userProgress.stats.totalContributions = (userProgress.stats.totalContributions || 0) + 1;
      userProgress.stats.approvedContributions = (userProgress.stats.approvedContributions || 0) + 1;
      
      // Update contribution type stats
      if (userProgress.stats.contributionsByType[contributionType] !== undefined) {
        userProgress.stats.contributionsByType[contributionType] += 1;
      }

      // Update success rate
      if (userProgress.stats.totalContributions > 0) {
        userProgress.stats.contributionSuccessRate = 
          (userProgress.stats.approvedContributions / userProgress.stats.totalContributions) * 100;
      }

      userProgress.lastUpdated = new Date();
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

      return { leveledUp, tierPromoted, totalXP: userProgress.totalXP };

    } catch (error) {
      console.error('Error awarding XP:', error);
    }
  }
}

module.exports = ContributionTracker;