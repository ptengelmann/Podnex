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
    
    console.log('Fetching milestones for pod:', podId);
    
    const milestones = await Milestone.find({ pod: podId })
      .sort({ dueDate: 1, createdAt: -1 });
    
    console.log('Found milestones:', milestones.length);
    
    res.json(milestones);
  } catch (error) {
    console.error('Error fetching milestones:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/pods/:podId/milestones
// @desc    Create a new milestone for a pod
// @access  Private
router.post('/:podId/milestones', protect, async (req, res) => {
  try {
    const { podId } = req.params;
    const { title, description, dueDate, status, progress } = req.body;
    
    console.log('Creating milestone for pod:', podId);
    console.log('Milestone data:', { title, description, dueDate, status, progress });
    
    const milestone = new Milestone({
      title,
      description,
      pod: podId,
      dueDate: dueDate || undefined,
      status: status || 'not-started',
      progress: progress || 0
    });
    
    await milestone.save();
    
    console.log('Created milestone:', milestone);
    
    res.status(201).json(milestone);
  } catch (error) {
    console.error('Error creating milestone:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/pods/:podId/milestones/:milestoneId
// @desc    Get single milestone
// @access  Private
router.get('/:podId/milestones/:milestoneId', protect, async (req, res) => {
  try {
    const { milestoneId } = req.params;
    
    const milestone = await Milestone.findById(milestoneId);
    
    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found' });
    }
    
    res.json(milestone);
  } catch (error) {
    console.error('Error fetching milestone:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/pods/:podId/milestones/:milestoneId
// @desc    Update milestone
// @access  Private
router.put('/:podId/milestones/:milestoneId', protect, async (req, res) => {
  try {
    const { milestoneId } = req.params;
    const { title, description, dueDate, status, progress } = req.body;
    
    const milestone = await Milestone.findByIdAndUpdate(
      milestoneId,
      {
        title,
        description,
        dueDate,
        status,
        progress,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found' });
    }
    
    res.json(milestone);
  } catch (error) {
    console.error('Error updating milestone:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/pods/:podId/milestones/:milestoneId
// @desc    Delete milestone
// @access  Private
router.delete('/:podId/milestones/:milestoneId', protect, async (req, res) => {
  try {
    const { milestoneId } = req.params;
    
    const milestone = await Milestone.findByIdAndDelete(milestoneId);
    
    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found' });
    }
    
    res.json({ message: 'Milestone deleted successfully' });
  } catch (error) {
    console.error('Error deleting milestone:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;