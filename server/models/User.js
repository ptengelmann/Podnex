const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Please add a password']
  },
  role: {
    type: String,
    enum: ['creator', 'contributor', 'booster'],
    default: 'contributor'
  },
  reputation: {
    type: Number,
    default: 0
  },
  
  // 🎮 GAMIFICATION FIELDS
  totalXP: { 
    type: Number, 
    default: 0 
  },
  currentLevel: { 
    type: Number, 
    default: 1 
  },
  tier: { 
    type: String, 
    enum: ['bronze', 'silver', 'gold', 'platinum'], 
    default: 'bronze' 
  },
  
  // Additional gamification stats for quick access
  badgeCount: {
    type: Number,
    default: 0
  },
  
  // Track when user was last active for gamification
  lastActiveAt: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true 
});

// Add an index for gamification queries
userSchema.index({ totalXP: -1 });
userSchema.index({ tier: 1 });
userSchema.index({ currentLevel: -1 });

// Method to update gamification data from UserProgress
userSchema.methods.syncGamificationData = function(userProgress) {
  this.totalXP = userProgress.totalXP || 0;
  this.currentLevel = userProgress.currentLevel || 1;
  this.tier = userProgress.tier || 'bronze';
  this.badgeCount = userProgress.badges?.length || 0;
  this.reputation = userProgress.reputation?.score || 0;
  this.lastActiveAt = new Date();
  return this.save();
};

// Virtual for getting tier display info
userSchema.virtual('tierInfo').get(function() {
  const tierData = {
    bronze: { color: '#CD7F32', icon: '🥉', name: 'Bronze' },
    silver: { color: '#C0C0C0', icon: '🥈', name: 'Silver' },
    gold: { color: '#FFD700', icon: '🥇', name: 'Gold' },
    platinum: { color: '#E5E4E2', icon: '💎', name: 'Platinum' }
  };
  return tierData[this.tier] || tierData.bronze;
});

// Virtual for getting trust level
userSchema.virtual('trustLevel').get(function() {
  if (this.tier === 'platinum') return 'Platinum';
  if (this.tier === 'gold') return 'Gold';
  if (this.tier === 'silver') return 'Silver';
  if (this.totalXP >= 500) return 'Gold';
  if (this.totalXP >= 200) return 'Silver';
  return 'Bronze';
});

module.exports = mongoose.model('User', userSchema);