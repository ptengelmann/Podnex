const mongoose = require('mongoose');

const UserProgressSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true 
  },
  
  totalXP: { type: Number, default: 0 },
  currentLevel: { type: Number, default: 1 },
  
  tier: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum'],
    default: 'bronze'
  },
  
  stats: {
    totalContributions: { type: Number, default: 0 },
    approvedContributions: { type: Number, default: 0 },
    contributionsByType: {
      code_commit: { type: Number, default: 0 },
      design_asset: { type: Number, default: 0 },
      documentation: { type: Number, default: 0 },
      bug_fix: { type: Number, default: 0 },
      feature_implementation: { type: Number, default: 0 },
      code_review: { type: Number, default: 0 },
      testing: { type: Number, default: 0 },
      marketing_content: { type: Number, default: 0 },
      user_research: { type: Number, default: 0 },
      project_management: { type: Number, default: 0 },
      mentoring: { type: Number, default: 0 },
      community_building: { type: Number, default: 0 }
    },
    
    podsJoined: { type: Number, default: 0 },
    podsCreated: { type: Number, default: 0 },
    reviewsGiven: { type: Number, default: 0 },
    contributionSuccessRate: { type: Number, default: 0 }
  },
  
  badges: [{
    badgeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Badge' },
    earnedAt: { type: Date, default: Date.now }
  }],
  
  reputation: {
    score: { type: Number, default: 0 },
    breakdown: {
      contributions: { type: Number, default: 0 },
      reviews: { type: Number, default: 0 },
      collaboration: { type: Number, default: 0 }
    }
  },
  
  lastUpdated: { type: Date, default: Date.now }
});

// Calculate level from XP
UserProgressSchema.methods.calculateLevel = function() {
  // Simple level calculation: level = sqrt(XP/100) + 1
  this.currentLevel = Math.floor(Math.sqrt(this.totalXP / 100)) + 1;
  return this.currentLevel;
};

// Calculate tier
UserProgressSchema.methods.calculateTier = function() {
  const level = this.currentLevel;
  const successRate = this.stats.contributionSuccessRate;
  
  if (level >= 25 && successRate >= 90) {
    this.tier = 'platinum';
  } else if (level >= 15 && successRate >= 80) {
    this.tier = 'gold';
  } else if (level >= 8 && successRate >= 70) {
    this.tier = 'silver';
  } else {
    this.tier = 'bronze';
  }
  
  return this.tier;
};

// Update reputation
UserProgressSchema.methods.updateReputation = function() {
  this.reputation.breakdown.contributions = this.stats.approvedContributions * 10;
  this.reputation.breakdown.reviews = this.stats.reviewsGiven * 5;
  this.reputation.breakdown.collaboration = this.stats.podsJoined * 15;
  
  this.reputation.score = 
    this.reputation.breakdown.contributions +
    this.reputation.breakdown.reviews +
    this.reputation.breakdown.collaboration;
  
  return this.reputation.score;
};

module.exports = mongoose.model('UserProgress', UserProgressSchema);