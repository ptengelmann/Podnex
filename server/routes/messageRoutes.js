// routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/messages/:podId
// @desc    Get all messages for a pod
// @access  Private
router.get('/:podId', protect, async (req, res) => {
  try {
    const { podId } = req.params;
    
    const messages = await Message.find({ pod: podId })
      .populate('sender', 'name profileImage')
      .sort({ createdAt: 1 });
    
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/messages
// @desc    Create a new message
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { podId, text } = req.body;
    
    const message = new Message({
      text,
      pod: podId,
      sender: req.user._id
    });
    
    await message.save();
    
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name profileImage');
    
    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;