// routes/resourceRoutes.js
const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');
const Pod = require('../models/Pod');
const PodMember = require('../models/PodMember');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = 'uploads/resources';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    // Use timestamp + original name to avoid collisions
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-'));
  }
});

// Set up multer middleware
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// @route   GET /api/pods/:podId/resources
// @desc    Get all resources for a pod
// @access  Private
router.get('/:podId/resources', protect, async (req, res) => {
  try {
    const { podId } = req.params;
    
    // Check if pod exists
    const pod = await Pod.findById(podId);
    if (!pod) {
      return res.status(404).json({ message: 'Pod not found' });
    }
    
    // Check if user is a member or creator of the pod
    const isMember = await PodMember.findOne({ 
      pod: podId, 
      user: req.user._id,
      status: 'active'
    });
    
    const isCreator = pod.creator.toString() === req.user._id.toString();
    
    if (!isMember && !isCreator) {
      return res.status(403).json({ 
        message: 'You must be a member of this pod to view its resources' 
      });
    }
    
    // Get resources
    const resources = await Resource.find({ pod: podId })
      .populate('uploadedBy', 'name email profileImage')
      .sort({ createdAt: -1 });
      
    res.json(resources);
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/pods/:podId/resources
// @desc    Upload a new resource to a pod
// @access  Private
router.post('/:podId/resources', protect, upload.single('file'), async (req, res) => {
  try {
    const { podId } = req.params;
    const { name, description, tags } = req.body;
    
    // Check if there's a file
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }
    
    // Check if pod exists
    const pod = await Pod.findById(podId);
    if (!pod) {
      return res.status(404).json({ message: 'Pod not found' });
    }
    
    // Check if user is a member or creator of the pod
    const isMember = await PodMember.findOne({ 
      pod: podId, 
      user: req.user._id,
      status: 'active'
    });
    
    const isCreator = pod.creator.toString() === req.user._id.toString();
    
    if (!isMember && !isCreator) {
      return res.status(403).json({ 
        message: 'You must be a member of this pod to upload resources' 
      });
    }
    
    // Process tags (if any)
    let parsedTags = [];
    if (tags) {
      try {
        parsedTags = JSON.parse(tags);
      } catch (err) {
        // If tags is a string, split by comma
        parsedTags = tags.split(',').map(tag => tag.trim());
      }
    }
    
    // Create resource
    const resource = new Resource({
      name: name || req.file.originalname,
      description,
      fileUrl: `/uploads/resources/${req.file.filename}`,
      fileType: path.extname(req.file.originalname).substring(1),
      fileSize: req.file.size,
      pod: podId,
      uploadedBy: req.user._id,
      tags: parsedTags
    });
    
    await resource.save();
    
    // Populate the uploaded by field
    const populatedResource = await Resource.findById(resource._id)
      .populate('uploadedBy', 'name email profileImage');
    
    res.status(201).json(populatedResource);
  } catch (error) {
    console.error('Error uploading resource:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/pods/:podId/resources/:resourceId
// @desc    Download a resource
// @access  Private
router.get('/:podId/resources/:resourceId', protect, async (req, res) => {
  try {
    const { podId, resourceId } = req.params;
    
    // Find the resource
    const resource = await Resource.findOne({ _id: resourceId, pod: podId });
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    // Remove the leading slash to get the file path
    const filePath = resource.fileUrl.substring(1);
    
    // Send the file
    res.download(filePath, resource.name);
  } catch (error) {
    console.error('Error downloading resource:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/pods/:podId/resources/:resourceId
// @desc    Delete a resource
// @access  Private
router.delete('/:podId/resources/:resourceId', protect, async (req, res) => {
  try {
    const { podId, resourceId } = req.params;
    
    // Find the resource
    const resource = await Resource.findOne({ _id: resourceId, pod: podId });
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    // Check if user is authorized to delete (only creator of pod or resource uploader)
    const pod = await Pod.findById(podId);
    if (!pod) {
      return res.status(404).json({ message: 'Pod not found' });
    }
    
    const isCreator = pod.creator.toString() === req.user._id.toString();
    const isUploader = resource.uploadedBy.toString() === req.user._id.toString();
    
    if (!isCreator && !isUploader) {
      return res.status(403).json({ 
        message: 'Only the pod creator or resource uploader can delete resources' 
      });
    }
    
    // Delete the file from filesystem
    const filePath = path.join(process.cwd(), resource.fileUrl.substring(1));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    // Delete the resource document
    await Resource.findByIdAndDelete(resourceId);
    
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Error deleting resource:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;