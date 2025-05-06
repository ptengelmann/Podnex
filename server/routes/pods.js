const express = require('express');
const router = express.Router();
const Pod = require('../models/Pod');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/pods
// @desc    Create a new Pod
// @access  Private (requires login)
router.post('/', protect, async (req, res) => {
  try {
    // Destructure all the fields from your form
    const {
      title,
      description,
      mission,
      category,
      format,
      status,
      urgency,
      budget,
      commitment,
      duration,
      deadline,
      rolesNeeded,
      skills,
      milestones,
      requirements,
      tags,
      visibility,
      timezone,
      communication,
      tools,
      maxMembers,
      applicationQuestions
    } = req.body;

    // Basic validation
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    // Create pod with all the data from the form
    const newPod = new Pod({
      title,
      description,
      mission: mission || "No mission provided", // Provide default for required field
      category,
      format,
      status: status || 'draft',
      rolesNeeded: Array.isArray(rolesNeeded) ? rolesNeeded : [], // Handle array of objects
      skills: Array.isArray(skills) ? skills : [],
      milestones: Array.isArray(milestones) ? milestones : [],
      requirements: Array.isArray(requirements) ? requirements : [],
      tags: Array.isArray(tags) ? tags : [],
      visibility,
      timezone,
      communication: Array.isArray(communication) ? communication : [],
      tools: Array.isArray(tools) ? tools : [],
      maxMembers,
      deadline,
      budget,
      commitment,
      duration,
      creator: req.user._id,
    });

    await newPod.save();
    res.status(201).json(newPod);
  } catch (error) {
    console.error('Pod creation error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
});

  // @route   GET /api/pods
  // @desc    Get all Pods (optionally filter by creator)
  // @access  Public
  router.get('/', async (req, res) => {
    try {
      const { creator } = req.query;
      let query = {};
      if (creator) {
        query.creator = creator;
      }

      const pods = await Pod.find(query)
        .populate('creator', 'name') // <-- Add this
        .sort({ createdAt: -1 });

      res.json(pods);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
  });

  // @route   GET /api/pods/:id
  // @desc    Get single Pod by ID
  // @access  Public
  router.get('/:id', async (req, res) => {
    try {
      const pod = await Pod.findById(req.params.id)
        .populate('creator', 'name'); // Add this line to populate creator info
      
      if (!pod) {
        return res.status(404).json({ message: 'Pod not found' });
      }
      
      res.json(pod);
    } catch (error) {
      console.error(error.message);
      if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Pod not found' });
      }
      res.status(500).send('Server error');
    }
  });

  module.exports = router;
