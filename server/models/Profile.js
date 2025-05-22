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
      // Will be populated when profile is created
      return '';
    }
  },
  headline: {
    type: String,
    maxlength: 100
  },
  bio: {
    type: String,
    maxlength: 500
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
      default: 0
    }
  }],
  socialLinks: {
    website: String,
    github: String,
    linkedin: String,
    twitter: String,
    dribbble: String,
    behance: String
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
    description: String,
    icon: String,
    awardedOn: {
      type: Date,
      default: Date.now
    }
  }],
  stats: {
    podsCreated: {
      type: Number,
      default: 0
    },
    podsJoined: {
      type: Number,
      default: 0
    },
    tasksCompleted: {
      type: Number,
      default: 0
    },
    contributionCount: {
      type: Number,
      default: 0
    },
    successRate: {
      type: Number,
      default: 0 // Percentage
    }
  },
  visibility: {
    skills: {
      type: Boolean,
      default: true
    },
    badges: {
      type: Boolean,
      default: true
    },
    stats: {
      type: Boolean,
      default: true
    },
    podsHistory: {
      type: Boolean,
      default: true
    }
  },
  experience: {
    currentXP: {
      type: Number,
      default: 0
    },
    level: {
      type: Number,
      default: 1
    },
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
    description: String,
    podId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pod'
    },
    images: [String],
    link: String,
    featured: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Profile', ProfileSchema);