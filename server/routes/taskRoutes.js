// routes/taskRoutes.js - COMPLETE UPDATED FILE
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect } = require('../middleware/authMiddleware');
const ContributionTracker = require('../services/ContributionTracker');

// Import gamification middleware
const { autoGamify, extractors } = require('../middleware/gamificationMiddleware');

// Helper function to update milestone progress
const updateMilestoneProgress = async (milestoneId) => {
  if (!milestoneId) return;
  
  const Milestone = require('../models/Milestone');
  const milestone = await Milestone.findById(milestoneId);
  
  if (milestone) {
    await milestone.calculateProgressFromTasks();
    await milestone.save();
  }
};

// Get all tasks for a pod
router.get('/:podId/tasks', protect, async (req, res) => {
  try {
    const { podId } = req.params;
    
    const tasks = await Task.find({ pod: podId })
      .populate('assignedTo', 'name profileImage')
      .populate('createdBy', 'name')
      .populate('milestone', 'title')
      .populate('comments.userId', 'name profileImage')
      .populate('completedBy', 'name')
      .populate('reviews.reviewerId', 'name profileImage')
      .sort({ createdAt: -1 });
    
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new task with gamification
router.post('/:podId/tasks', 
  protect, 
  autoGamify('TASK_CREATED', extractors.taskCreated),
  async (req, res) => {
    try {
      const { podId } = req.params;
      const { title, description, assignedTo, milestoneId, priority, dueDate } = req.body;
      
      const task = new Task({
        title, 
        description, 
        pod: podId, 
        assignedTo, 
        createdBy: req.user._id, 
        milestone: milestoneId, 
        priority, 
        dueDate,
        status: 'to-do'
      });
      
      await task.save();
      
      // Update milestone progress if task is assigned to a milestone
      if (milestoneId) {
        await updateMilestoneProgress(milestoneId);
      }
      
      // Auto-track task completion as contribution
await ContributionTracker.trackTaskCompletion(
  req.user._id, 
  task, 
  req.params.podId
);

const populatedTask = await Task.findById(task._id)
        .populate('assignedTo', 'name profileImage')
        .populate('createdBy', 'name')
        .populate('milestone', 'title')
        .populate('comments.userId', 'name profileImage');
      
      res.status(201).json(populatedTask);
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Complete task with gamification
router.put('/:podId/tasks/:taskId/complete', 
  protect, 
  autoGamify('TASK_COMPLETED', extractors.taskCompleted), 
  async (req, res) => {
    try {
      const { taskId } = req.params;
      
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      
      // Check if user is assigned to task or is creator
      const isAssigned = task.assignedTo.some(userId => userId.toString() === req.user._id.toString());
      const isCreator = task.createdBy.toString() === req.user._id.toString();
      
      if (!isAssigned && !isCreator) {
        return res.status(403).json({ message: 'Not authorized to complete this task' });
      }
      
      // Store milestone ID before updating task
      const milestoneId = task.milestone;
      
      // Update task
      task.status = 'completed';
      task.completedAt = new Date();
      task.completedBy = req.user._id;
      
      // Check if completed early
      const completedEarly = task.dueDate && new Date() < new Date(task.dueDate);
      task.completedEarly = completedEarly;
      
      await task.save();
      
      // Update milestone progress after task completion
      if (milestoneId) {
        await updateMilestoneProgress(milestoneId);
      }
      
      const populatedTask = await Task.findById(task._id)
        .populate('assignedTo', 'name profileImage')
        .populate('createdBy', 'name')
        .populate('completedBy', 'name')
        .populate('milestone', 'title')
        .populate('comments.userId', 'name profileImage');
      
      res.json(populatedTask);
    } catch (error) {
      console.error('Error completing task:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Add task review with gamification
router.post('/:podId/tasks/:taskId/review', 
  protect, 
  autoGamify('PEER_REVIEW_GIVEN', extractors.peerReviewGiven), 
  async (req, res) => {
    try {
      const { taskId } = req.params;
      const { feedback, rating, constructive, codeSuggestions } = req.body;
      
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      
      // Add review to task
      if (!task.reviews) task.reviews = [];
      
      const review = {
        reviewerId: req.user._id,
        feedback,
        rating,
        constructive,
        codeSuggestions,
        createdAt: new Date()
      };
      
      task.reviews.push(review);
      await task.save();
      
      const populatedTask = await Task.findById(task._id)
        .populate('assignedTo', 'name profileImage')
        .populate('createdBy', 'name')
        .populate('reviews.reviewerId', 'name profileImage')
        .populate('comments.userId', 'name profileImage')
        .populate('milestone', 'title');
      
      res.json(populatedTask);
    } catch (error) {
      console.error('Error adding review:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Update task status (general update route)
router.patch('/:podId/tasks/:taskId', protect, async (req, res) => {
  try {
    const { taskId } = req.params;
    const updates = req.body;
    
    // Get the old task to check if milestone changed
    const oldTask = await Task.findById(taskId);
    const oldMilestoneId = oldTask ? oldTask.milestone : null;
    
    const task = await Task.findByIdAndUpdate(
      taskId,
      { ...updates, updatedAt: new Date() },
      { new: true }
    )
    .populate('assignedTo', 'name profileImage')
    .populate('createdBy', 'name')
    .populate('milestone', 'title')
    .populate('comments.userId', 'name profileImage')
    .populate('completedBy', 'name')
    .populate('reviews.reviewerId', 'name profileImage');
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Update milestone progress if milestone changed or status changed
    if (updates.status || updates.milestone) {
      // Update old milestone if it changed
      if (oldMilestoneId && oldMilestoneId.toString() !== task.milestone?.toString()) {
        await updateMilestoneProgress(oldMilestoneId);
      }
      
      // Update new milestone
      if (task.milestone) {
        await updateMilestoneProgress(task.milestone);
      }
    }
    
    res.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add task comment
router.post('/:podId/tasks/:taskId/comments', protect, async (req, res) => {
  try {
    const { taskId } = req.params;
    const { text } = req.body;
    
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Add comment
    task.comments.push({
      userId: req.user._id,
      text,
      createdAt: new Date()
    });
    
    await task.save();
    
    // Return populated task
    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name profileImage')
      .populate('createdBy', 'name')
      .populate('milestone', 'title')
      .populate('comments.userId', 'name profileImage')
      .populate('completedBy', 'name')
      .populate('reviews.reviewerId', 'name profileImage');
    
    res.json(populatedTask);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update task status (general update route)
router.patch('/:podId/tasks/:taskId', protect, async (req, res) => {
  try {
    const { taskId } = req.params;
    const updates = req.body;
    
    const task = await Task.findByIdAndUpdate(
      taskId,
      { ...updates, updatedAt: new Date() },
      { new: true }
    )
    .populate('assignedTo', 'name profileImage')
    .populate('createdBy', 'name')
    .populate('milestone', 'title')
    .populate('comments.userId', 'name profileImage')
    .populate('completedBy', 'name')
    .populate('reviews.reviewerId', 'name profileImage');
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single task by ID
router.get('/:podId/tasks/:taskId', protect, async (req, res) => {
  try {
    const { taskId } = req.params;
    
    const task = await Task.findById(taskId)
      .populate('assignedTo', 'name profileImage')
      .populate('createdBy', 'name')
      .populate('milestone', 'title')
      .populate('comments.userId', 'name profileImage')
      .populate('completedBy', 'name')
      .populate('reviews.reviewerId', 'name profileImage');
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete task (creator only)
router.delete('/:podId/tasks/:taskId', protect, async (req, res) => {
  try {
    const { taskId } = req.params;
    
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Check if user is creator
    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }
    
    await Task.findByIdAndDelete(taskId);
    
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;