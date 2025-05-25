const mongoose = require('mongoose');

const ContributionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  podId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Pod', 
    required: true 
  },
  
  type: {
    type: String,
    enum: [
      'code_commit', 'design_asset', 'documentation', 'bug_fix', 
      'feature_implementation', 'code_review', 'testing', 'marketing_content',
      'user_research', 'project_management', 'mentoring', 'community_building'
    ],
    required: true
  },
  
  title: { type: String, required: true },
  description: { type: String, required: true },
  
  evidence: {
    githubCommit: String,
    pullRequestUrl: String,
    designFiles: [String],
    screenshots: [String],
    liveDemo: String
  },
  
  status: {
    type: String,
    enum: ['pending', 'under_review', 'approved', 'rejected'],
    default: 'pending'
  },
  
  reviews: [{
    reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['approved', 'rejected', 'needs_revision'] },
    feedback: String,
    timestamp: { type: Date, default: Date.now }
  }],
  
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'expert'],
    required: true
  },
  
  impact: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: true
  },
  
  baseXP: { type: Number, default: 0 },
  totalXP: { type: Number, default: 0 },
  
  createdAt: { type: Date, default: Date.now },
  approvedAt: Date
});

// Calculate XP based on contribution
ContributionSchema.methods.calculateXP = function() {
  const typeBaseXP = {
    code_commit: 10,
    design_asset: 15,
    documentation: 8,
    bug_fix: 12,
    feature_implementation: 25,
    code_review: 5,
    testing: 8,
    marketing_content: 12,
    user_research: 20,
    project_management: 18,
    mentoring: 15,
    community_building: 10
  };
  
  const difficultyMultipliers = {
    easy: 1,
    medium: 2,
    hard: 4,
    expert: 8
  };
  
  const impactMultipliers = {
    low: 1,
    medium: 1.5,
    high: 2.5,
    critical: 4
  };
  
  this.baseXP = typeBaseXP[this.type] * 
                difficultyMultipliers[this.difficulty] * 
                impactMultipliers[this.impact];
  
  this.totalXP = this.baseXP;
  return this.totalXP;
};

module.exports = mongoose.model('Contribution', ContributionSchema);