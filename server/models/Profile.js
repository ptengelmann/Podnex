const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  displayName: {
    type: String,
    default: function() {
      return this.user?.name || '';
    }
  },
  headline: {
    type: String,
    maxlength: 100,
    default: ''
  },
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  skills: [{
    name: {
      type: String,
      required: true
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: 'intermediate'
    },
    yearsExperience: {
      type: Number,
      default: 0,
      min: 0
    }
  }],
  socialLinks: {
    website: { type: String, default: '' },
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    dribbble: { type: String, default: '' },
    behance: { type: String, default: '' }
  },
  profileImage: {
    type: String,
    default: null
  },
  coverImage: {
    type: String,
    default: null
  },
  badges: [{
    name: {
      type: String,
      required: true
    },
    description: { type: String, default: '' },
    icon: { type: String, default: '' },
    awardedOn: {
      type: Date,
      default: Date.now
    }
  }],
  stats: {
    podsCreated: { type: Number, default: 0, min: 0 },
    podsJoined: { type: Number, default: 0, min: 0 },
    tasksCompleted: { type: Number, default: 0, min: 0 },
    contributionCount: { type: Number, default: 0, min: 0 },
    successRate: { type: Number, default: 0, min: 0, max: 100 }
  },
  visibility: {
    skills: { type: Boolean, default: true },
    badges: { type: Boolean, default: true },
    stats: { type: Boolean, default: true },
    podsHistory: { type: Boolean, default: true }
  },
  experience: {
    currentXP: { type: Number, default: 0, min: 0 },
    level: { type: Number, default: 1, min: 1 },
    tier: {
      type: String,
      enum: ['bronze', 'silver', 'gold', 'platinum'],
      default: 'bronze'
    }
  },
  portfolio: [{
    title: {
      type: String,
      required: true
    },
    description: { type: String, default: '' },
    podId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pod'
    },
    images: [{ type: String }],
    link: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }]
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance
ProfileSchema.index({ 'user': 1 });
ProfileSchema.index({ 'skills.name': 1 });
ProfileSchema.index({ 'experience.tier': 1 });
ProfileSchema.index({ 'experience.currentXP': -1 });

// Virtual for computed fields
ProfileSchema.virtual('totalBadges').get(function() {
  return this.badges ? this.badges.length : 0;
});

module.exports = mongoose.model('Profile', ProfileSchema);