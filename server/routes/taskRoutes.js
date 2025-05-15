// routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/pods/:podId/tasks
// @desc    Get all tasks for a pod
// @access  Private
router.get('/:podId/tasks', protect, async (req, res) => {
  try {
    const { podId } = req.params;
    
    const tasks = await Task.find({ pod: podId })
      .populate('assignedTo', 'name profileImage')
      .populate('createdBy', 'name')
      .populate('milestone', 'title')
      .sort({ createdAt: -1 });
    
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/pods/:podId/tasks
// @desc    Create a new task for a pod
// @access  Private
router.post('/:podId/tasks', protect, async (req, res) => {
  try {
    const { podId } = req.params;
    const { title, description, assignedTo, milestone, priority, dueDate } = req.body;
    
    const task = new Task({
      title,
      description,
      pod: podId,
      assignedTo,
      createdBy: req.user._id,
      milestone,
      priority,
      dueDate,
      status: 'to-do'
    });
    
    await task.save();
    
    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name profileImage')
      .populate('createdBy', 'name')
      .populate('milestone', 'title');
    
    res.status(201).json(populatedTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add other task routes (update, delete, add comment, etc.)

module.exports = router;