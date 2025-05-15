// models/Task.js
const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  status: {
    type: String,
    enum: ['to-do', 'in-progress', 'completed'],
    default: 'to-do'
  },
  pod: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pod',
    required: true
  },
  assignedTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  milestone: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Milestone'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  comments: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    text: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  dueDate: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('Task', TaskSchema);