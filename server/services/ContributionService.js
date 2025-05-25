// server/services/ContributionService.js
const Contribution = require('../models/Contribution');
const UserProgress = require('../models/UserProgress');
const { analyzeContributionWithAI } = require('./AIService');

class ContributionService {
  static async submitContribution(userId, contributionData) {
    try {
      const contribution = new Contribution({
        userId,
        ...contributionData
      });
      
      // AI-enhanced XP calculation
      await contribution.calculateXPWithAI();
      await contribution.save();
      
      // Update user stats
      await this.updateUserStats(userId);
      
      return contribution;
    } catch (error) {
      throw new Error(`Failed to submit contribution: ${error.message}`);
    }
  }
  
  static async approveContribution(contributionId, reviewerId) {
    try {
      const contribution = await Contribution.findById(contributionId);
      contribution.status = 'approved';
      
      // Award XP
      await this.awardXP(contribution.userId, contribution.totalXP);
      
      // AI-powered badge checking
      await this.checkAIBadges(contribution.userId);
      
      await contribution.save();
      return contribution;
    } catch (error) {
      throw error;
    }
  }
  
  static async awardXP(userId, xpAmount) {
    try {
      let progress = await UserProgress.findOne({ userId });
      if (!progress) {
        progress = new UserProgress({ userId });
      }
      
      const oldLevel = progress.currentLevel;
      progress.totalXP += xpAmount;
      
      // AI-enhanced level calculation
      await progress.calculateLevelWithAI();
      
      if (progress.currentLevel > oldLevel) {
        // Level up notification
        await this.handleLevelUp(userId, progress.currentLevel);
      }
      
      await progress.save();
      return progress;
    } catch (error) {
      throw error;
    }
  }
  
  static async updateUserStats(userId) {
    // Update contribution counts, success rates, etc.
    // This feeds into AI analysis
  }
  
  static async checkAIBadges(userId) {
    // Use AI to determine if user deserves badges based on:
    // - Contribution patterns
    // - Quality metrics
    // - Collaboration behavior
    // - Innovation indicators
  }
}

module.exports = ContributionService;