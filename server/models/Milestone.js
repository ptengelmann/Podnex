// models/Milestone.js
const mongoose = require('mongoose');

const MilestoneSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  pod: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pod',
    required: true
  },
  status: {
    type: String,
    enum: ['not-started', 'in-progress', 'completed'],
    default: 'not-started'
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  dueDate: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('Milestone', MilestoneSchema);