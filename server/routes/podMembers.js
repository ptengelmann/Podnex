const express = require('express');
const router = express.Router();
const PodMember = require('../models/PodMember');
const Pod = require('../models/Pod');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/pods/:podId/members
// @desc    Get all members of a pod
// @access  Private
router.get('/:podId/members', protect, async (req, res) => {
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
        message: 'You must be a member of this pod to view its members' 
      });
    }
    
    // Get members
    const members = await PodMember.find({ pod: podId, status: 'active' })
      .populate('user', 'name email profileImage')
      .sort({ joinedAt: -1 });
      
    res.json(members);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/pods/user-memberships
// @desc    Get all pods a user is a member of
// @access  Private
router.get('/user-memberships', protect, async (req, res) => {
  try {
    console.log('USER MEMBERSHIPS ENDPOINT HIT');
    const userId = req.user._id;
    console.log('Looking for memberships for user ID:', userId);
    
    const memberships = await PodMember.find({ 
      user: userId,
      status: 'active'
    })
    .populate({
      path: 'pod',
      select: 'title description status category creator createdAt updatedAt',
      populate: { path: 'creator', select: 'name _id' }
    })
    .sort({ joinedAt: -1 });
    
    console.log(`Found ${memberships.length} active memberships for user ${userId}`);
    
    if (memberships.length > 0) {
      console.log('Sample membership:', {
        id: memberships[0]._id,
        podTitle: memberships[0].pod?.title,
        role: memberships[0].role
      });
    }
    
    res.json(memberships);
  } catch (error) {
    console.error('Error in user-memberships endpoint:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/pods/creator-pods
// @desc    Get all pods created by the user
// @access  Private
router.get('/creator-pods', protect, async (req, res) => {
  try {
    console.log('CREATOR PODS ENDPOINT HIT');
    const userId = req.user._id;
    
    console.log('Looking for pods with creator ID:', userId);
    console.log('User from request:', req.user);
    
    const pods = await Pod.find({ creator: userId })
      .sort({ createdAt: -1 });
    
    console.log(`Found ${pods.length} pods for creator ${userId}`);
    
    // For each pod, get the number of members
    const podsWithMemberCount = await Promise.all(pods.map(async (pod) => {
      const memberCount = await PodMember.countDocuments({ 
        pod: pod._id, 
        status: 'active' 
      });
      
      return {
        ...pod._doc,
        memberCount
      };
    }));
    
    console.log(`Returning ${podsWithMemberCount.length} pods with member counts`);
    res.json(podsWithMemberCount);
  } catch (error) {
    console.error('Error in creator-pods endpoint:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/pods/:podId/members
// @desc    Directly add a member to a pod (for creator use)
// @access  Private (only pod creator)
router.post('/:podId/members', protect, async (req, res) => {
  try {
    const { podId } = req.params;
    const { userId, role, permissions } = req.body;
    
    // Validate required fields
    if (!userId || !role) {
      return res.status(400).json({ message: 'User ID and role are required' });
    }
    
    // Check if pod exists and user is creator
    const pod = await Pod.findById(podId);
    if (!pod) {
      return res.status(404).json({ message: 'Pod not found' });
    }
    
    // Only pod creator can add members directly
    if (pod.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'Only the pod creator can add members directly' 
      });
    }
    
    // Check if membership already exists
    const existingMembership = await PodMember.findOne({
      pod: podId,
      user: userId
    });
    
    if (existingMembership) {
      return res.status(400).json({ 
        message: 'User is already a member of this pod' 
      });
    }
    
    // Create new membership
    const newMember = new PodMember({
      pod: podId,
      user: userId,
      role,
      permissions: permissions || {
        canEditTasks: true,
        canCreateMilestones: false,
        canInviteMembers: false
      }
    });
    
    await newMember.save();
    
    const populatedMember = await PodMember.findById(newMember._id)
      .populate('user', 'name email profileImage');
    
    res.status(201).json(populatedMember);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/pods/:podId/members/:userId
// @desc    Remove a member from a pod
// @access  Private (only pod creator or the member themselves)
router.delete('/:podId/members/:userId', protect, async (req, res) => {
  try {
    const { podId, userId } = req.params;
    
    // Check if pod exists
    const pod = await Pod.findById(podId);
    if (!pod) {
      return res.status(404).json({ message: 'Pod not found' });
    }
    
    // Check if the requester is the pod creator or the member themselves
    const isCreator = pod.creator.toString() === req.user._id.toString();
    const isSelf = userId === req.user._id.toString();
    
    if (!isCreator && !isSelf) {
      return res.status(403).json({ 
        message: 'Only the pod creator or the member themselves can remove a member' 
      });
    }
    
    // Find and update membership status
    const membership = await PodMember.findOne({
      pod: podId,
      user: userId
    });
    
    if (!membership) {
      return res.status(404).json({ message: 'Membership not found' });
    }
    
    // Option 1: Delete the membership
    // await PodMember.findByIdAndDelete(membership._id);
    
    // Option 2: Mark as removed (better for record keeping)
    membership.status = 'removed';
    await membership.save();
    
    res.json({ message: 'Member removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;