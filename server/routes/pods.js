const express = require('express');
const router = express.Router();
const Pod = require('../models/Pod');

// @route   POST /api/pods
// @desc    Create a new Pod
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { title, mission, rolesNeeded } = req.body;

    if (!title || !mission) {
      return res.status(400).json({ message: 'Title and mission are required' });
    }

    const newPod = new Pod({
      title,
      mission,
      rolesNeeded: rolesNeeded.split(',').map(role => role.trim()),
    });

    await newPod.save();
    res.status(201).json(newPod);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/pods
// @desc    Get all Pods
// @access  Public
router.get('/', async (req, res) => {
  try {
    const pods = await Pod.find().sort({ createdAt: -1 }); // Newest first
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
    const pod = await Pod.findById(req.params.id);

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
