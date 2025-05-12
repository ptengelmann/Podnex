const mongoose = require('mongoose');

const PodMemberSchema = new mongoose.Schema({
  pod: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pod',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'removed'],
    default: 'active'
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  // Track contributions
  contributions: [{
    type: {
      type: String,
      enum: ['comment', 'task', 'resource', 'milestone'],
      required: true
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Allow pod-specific permissions
  permissions: {
    canEditTasks: {
      type: Boolean,
      default: false
    },
    canCreateMilestones: {
      type: Boolean,
      default: false
    },
    canInviteMembers: {
      type: Boolean,
      default: false
    }
  }
}, { timestamps: true });

// Compound index to ensure a user can only have one membership per pod
PodMemberSchema.index({ pod: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('PodMember', PodMemberSchema);