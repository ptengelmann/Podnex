// routes/taskRoutes.js - MODIFY YOUR EXISTING FILE
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect } = require('../middleware/authMiddleware');

// ADD THIS LINE - Import gamification middleware
const { autoGamify, extractors } = require('../middleware/gamificationMiddleware');

// Your existing routes - JUST ADD MIDDLEWARE
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

// Task creation - ADD GAMIFICATION MIDDLEWARE
router.post('/:podId/tasks', 
  protect, 
  autoGamify('TASK_CREATED', extractors.taskCreated), // ADD THIS LINE
  async (req, res) => {
    try {
      // ALL YOUR EXISTING CODE STAYS THE SAME
      const { podId } = req.params;
      const { title, description, assignedTo, milestone, priority, dueDate, type, difficulty } = req.body;
      
      const task = new Task({
        title, description, pod: podId, assignedTo, 
        createdBy: req.user._id, milestone, priority, dueDate,
        type, difficulty, status: 'to-do'
      });
      
      await task.save();
      
      const populatedTask = await Task.findById(task._id)
        .populate('assignedTo', 'name profileImage')
        .populate('createdBy', 'name')
        .populate('milestone', 'title');
      
      res.status(201).json(populatedTask); // Triggers TASK_CREATED gamification
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// ADD NEW ROUTES WITH GAMIFICATION

// Task completion route - NEW
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
      
      // Update task
      task.status = 'completed';
      task.completedAt = new Date();
      task.completedBy = req.user._id;
      
      // Check if completed early
      const completedEarly = task.dueDate && new Date() < new Date(task.dueDate);
      task.completedEarly = completedEarly;
      
      await task.save();
      
      const populatedTask = await Task.findById(task._id)
        .populate('assignedTo', 'name profileImage')
        .populate('createdBy', 'name')
        .populate('completedBy', 'name')
        .populate('milestone', 'title');
      
      res.json(populatedTask); // Triggers TASK_COMPLETED gamification
    } catch (error) {
      console.error('Error completing task:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Task comment/review route - NEW
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
        .populate('reviews.reviewerId', 'name profileImage');
      
      res.json(populatedTask); // Triggers PEER_REVIEW_GIVEN gamification
    } catch (error) {
      console.error('Error adding review:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Update task assignment - NEW
router.put('/:podId/tasks/:taskId/assign', 
  protect, 
  autoGamify('TASK_ASSIGNED'), 
  async (req, res) => {
    try {
      const { taskId } = req.params;
      const { assignedTo } = req.body;
      
      const task = await Task.findByIdAndUpdate(
        taskId,
        { assignedTo, updatedAt: new Date() },
        { new: true }
      ).populate('assignedTo', 'name profileImage')
       .populate('createdBy', 'name');
      
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      
      res.json(task); // Triggers TASK_ASSIGNED gamification
    } catch (error) {
      console.error('Error assigning task:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;