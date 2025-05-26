const mongoose = require('mongoose');

const MilestoneSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
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
  dueDate: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  completedAt: {
    type: Date
  },
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }]
}, {
  timestamps: true
});

// Calculate progress based on associated tasks
MilestoneSchema.methods.calculateProgress = function() {
  if (!this.tasks || this.tasks.length === 0) {
    return 0;
  }
     
  // This would need to be populated with actual task data
  // For now, return the manually set progress
  return this.progress;
};

// NEW METHOD - Add this after the existing calculateProgress method
MilestoneSchema.methods.calculateProgressFromTasks = async function() {
  const Task = require('./Task');
  
  // Find all tasks associated with this milestone
  const tasks = await Task.find({ milestone: this._id });
  
  if (tasks.length === 0) {
    this.progress = 0;
    return 0;
  }
  
  const completedTasks = tasks.filter(task => task.status === 'completed');
  const progressPercentage = Math.round((completedTasks.length / tasks.length) * 100);
  
  this.progress = progressPercentage;
  return progressPercentage;
};

// Helper method to update progress
MilestoneSchema.methods.updateProgress = async function() {
  await this.calculateProgressFromTasks();
  await this.save();
};
// Update progress when milestone is saved
MilestoneSchema.pre('save', function(next) {
  // Auto-update status based on progress
  if (this.progress === 0) {
    this.status = 'not-started';
  } else if (this.progress === 100) {
    this.status = 'completed';
    if (!this.completedAt) {
      this.completedAt = new Date();
    }
  } else {
    this.status = 'in-progress';
  }
  
  next();
});

module.exports = mongoose.model('Milestone', MilestoneSchema);