// routes/milestoneRoutes.js
const express = require('express');
const router = express.Router();
const Milestone = require('../models/Milestone');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/pods/:podId/milestones
// @desc    Get all milestones for a pod
// @access  Private
router.get('/:podId/milestones', protect, async (req, res) => {
  try {
    const { podId } = req.params;
    
    const milestones = await Milestone.find({ pod: podId })
      .sort({ dueDate: 1 });
    
    res.json(milestones);
  } catch (error) {
    console.error('Error fetching milestones:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/pods/:podId/milestones
// @desc    Create a new milestone for a pod
// @access  Private
router.post('/:podId/milestones', protect, async (req, res) => {
  try {
    const { podId } = req.params;
    const { title, description, dueDate } = req.body;
    
    const milestone = new Milestone({
      title,
      description,
      pod: podId,
      dueDate
    });
    
    await milestone.save();
    
    res.status(201).json(milestone);
  } catch (error) {
    console.error('Error creating milestone:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add other milestone routes (update, delete, etc.)

module.exports = router;