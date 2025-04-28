const express = require('express');
const router = express.Router();
const Pod = require('../models/Pod');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/pods
// @desc    Create a new Pod
// @access  Private (requires login)
router.post('/', protect, async (req, res) => {
  try {
    const { title, mission, rolesNeeded } = req.body;

    if (!title || !mission) {
      return res.status(400).json({ message: 'Title and mission are required' });
    }

    const newPod = new Pod({
      title,
      mission,
      rolesNeeded: rolesNeeded.split(',').map(role => role.trim()),
      creator: req.user._id, // 🔥 Attach logged-in user
    });

    await newPod.save();
    res.status(201).json(newPod);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
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
