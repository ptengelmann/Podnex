// server/routes/pods.js - COMPLETE IMPLEMENTATION WITH GAMIFICATION
const express = require('express');
const router = express.Router();
const Pod = require('../models/Pod');
const PodMember = require('../models/PodMember');
const Task = require('../models/Task'); // Assuming you have a Task model
const { protect } = require('../middleware/authMiddleware');

// Import gamification middleware
const { autoGamify, extractors } = require('../middleware/gamificationMiddleware');

// CREATE POD - With POD_CREATED gamification
router.post('/', 
  protect, 
  autoGamify('POD_CREATED', extractors.podCreated),
  async (req, res) => {
    try {
      const {
        title, description, mission, category, format, status, urgency, budget,
        commitment, duration, deadline, rolesNeeded, skills, milestones,
        requirements, tags, visibility, timezone, communication, tools,
        maxMembers, applicationQuestions
      } = req.body;
      
      if (!title) {
        return res.status(400).json({ message: 'Title is required' });
      }
      
      const newPod = new Pod({
        title, 
        description, 
        mission: mission || "No mission provided",
        category, 
        format, 
        status: status || 'draft',
        urgency,
        budget,
        commitment,
        duration,
        deadline,
        rolesNeeded: Array.isArray(rolesNeeded) ? rolesNeeded : [],
        skills: Array.isArray(skills) ? skills : [],
        milestones: Array.isArray(milestones) ? milestones : [],
        requirements: Array.isArray(requirements) ? requirements : [],
        tags: Array.isArray(tags) ? tags : [],
        visibility, 
        timezone,
        communication: Array.isArray(communication) ? communication : [],
        tools: Array.isArray(tools) ? tools : [],
        maxMembers, 
        applicationQuestions,
        creator: req.user._id,
        createdAt: new Date()
      });
      
      await newPod.save();
      
      // Populate creator info for response
      const populatedPod = await Pod.findById(newPod._id).populate('creator', 'name email');
      
      res.status(201).json(populatedPod); // 🎮 Triggers POD_CREATED gamification
    } catch (error) {
      console.error('Pod creation error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// JOIN POD - With JOINED_POD gamification
router.post('/:podId/join', 
  protect, 
  autoGamify('JOINED_POD', extractors.joinedPod), 
  async (req, res) => {
    try {
      const { podId } = req.params;
      const { role, application, motivation } = req.body;
      
      // Check if pod exists
      const pod = await Pod.findById(podId);
      if (!pod) {
        return res.status(404).json({ message: 'Pod not found' });
      }
      
      // Check if user is already a member
      const existingMember = await PodMember.findOne({
        pod: podId,
        user: req.user._id,
        status: { $in: ['active', 'pending'] }
      });
      
      if (existingMember) {
        return res.status(400).json({ message: 'Already a member or pending approval for this pod' });
      }
      
      // Check if pod is at capacity
      const currentMemberCount = await PodMember.countDocuments({
        pod: podId,
        status: 'active'
      });
      
      if (pod.maxMembers && currentMemberCount >= pod.maxMembers) {
        return res.status(400).json({ message: 'Pod is at maximum capacity' });
      }
      
      // Create new membership
      const podMember = new PodMember({
        pod: podId,
        user: req.user._id,
        role: role || 'contributor',
        joinedAt: new Date(),
        status: pod.requiresApproval ? 'pending' : 'active',
        application,
        motivation
      });
      
      await podMember.save();
      
      // Populate the response with additional data for gamification
      const populatedMember = await PodMember.findById(podMember._id)
        .populate('user', 'name profileImage')
        .populate('pod', 'title creator category');
      
      // Add member count for gamification calculation
      const memberCount = await PodMember.countDocuments({
        pod: podId,
        status: 'active'
      });
      
      const responseData = {
        ...populatedMember.toObject(),
        memberCount,
        podCreatorTier: 'silver' // You can fetch this from UserProgress if needed
      };
      
      res.status(201).json(responseData); // 🎮 Triggers JOINED_POD gamification
    } catch (error) {
      console.error('Error joining pod:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// LAUNCH POD - With POD_LAUNCHED gamification
router.put('/:podId/launch', 
  protect, 
  autoGamify('POD_LAUNCHED', (req, res, data) => ({
    podId: req.params.podId,
    launchedAt: new Date(),
    memberCount: data.memberCount || 0
  })), 
  async (req, res) => {
    try {
      const { podId } = req.params;
      
      const pod = await Pod.findById(podId);
      if (!pod) {
        return res.status(404).json({ message: 'Pod not found' });
      }
      
      // Check if user is the creator
      if (pod.creator.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Only pod creator can launch this pod' });
      }
      
      if (pod.status === 'active') {
        return res.status(400).json({ message: 'Pod is already launched' });
      }
      
      // Update pod status to launched
      pod.status = 'active';
      pod.launchedAt = new Date();
      await pod.save();
      
      // Get member count for response
      const memberCount = await PodMember.countDocuments({
        pod: podId,
        status: 'active'
      });
      
      const responseData = {
        ...pod.toObject(),
        memberCount
      };
      
      res.json(responseData); // 🎮 Triggers POD_LAUNCHED gamification
    } catch (error) {
      console.error('Error launching pod:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// COMPLETE POD - With POD_COMPLETED gamification
router.put('/:podId/complete', 
  protect, 
  autoGamify('POD_COMPLETED', (req, res, data) => ({
    podId: req.params.podId,
    completedAt: new Date(),
    duration: data.duration || 0,
    memberCount: data.memberCount || 0,
    tasksCompleted: data.tasksCompleted || 0
  })), 
  async (req, res) => {
    try {
      const { podId } = req.params;
      const { completionNotes, outcomes } = req.body;
      
      const pod = await Pod.findById(podId);
      if (!pod) {
        return res.status(404).json({ message: 'Pod not found' });
      }
      
      // Check if user is the creator
      if (pod.creator.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Only pod creator can mark this pod as complete' });
      }
      
      if (pod.status === 'completed') {
        return res.status(400).json({ message: 'Pod is already completed' });
      }
      
      // Calculate duration
      const duration = pod.launchedAt ? 
        Math.ceil((new Date() - pod.launchedAt) / (1000 * 60 * 60 * 24)) : 0;
      
      // Update pod status
      pod.status = 'completed';
      pod.completedAt = new Date();
      pod.completionNotes = completionNotes;
      pod.outcomes = outcomes;
      await pod.save();
      
      // Get additional data for gamification
      const memberCount = await PodMember.countDocuments({
        pod: podId,
        status: 'active'
      });
      
      const tasksCompleted = await Task.countDocuments({
        pod: podId,
        status: 'completed'
      });
      
      const responseData = {
        ...pod.toObject(),
        memberCount,
        tasksCompleted,
        duration
      };
      
      res.json(responseData); // 🎮 Triggers POD_COMPLETED gamification
    } catch (error) {
      console.error('Error completing pod:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// INVITE MEMBER - With INVITED_MEMBER gamification
router.post('/:podId/invite', 
  protect, 
  autoGamify('INVITED_MEMBER', (req, res, data) => ({
    podId: req.params.podId,
    invitedUserId: req.body.userId,
    role: req.body.role
  })), 
  async (req, res) => {
    try {
      const { podId } = req.params;
      const { userId, role, message } = req.body;
      
      const pod = await Pod.findById(podId);
      if (!pod) {
        return res.status(404).json({ message: 'Pod not found' });
      }
      
      // Check if user has permission to invite (creator or admin)
      const memberPermission = await PodMember.findOne({
        pod: podId,
        user: req.user._id,
        status: 'active',
        role: { $in: ['creator', 'admin'] }
      });
      
      if (!memberPermission && pod.creator.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'No permission to invite members' });
      }
      
      // Create invitation (you might have an Invitation model)
      const invitation = {
        pod: podId,
        invitedBy: req.user._id,
        invitedUser: userId,
        role: role || 'contributor',
        message,
        status: 'pending',
        createdAt: new Date()
      };
      
      // For now, we'll return the invitation data
      // In a real app, you'd save this to an Invitation model and send notification
      
      res.status(201).json(invitation); // 🎮 Triggers INVITED_MEMBER gamification
    } catch (error) {
      console.error('Error inviting member:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// ACCEPT MEMBER - With MEMBER_ACCEPTED gamification (for pod creator)
router.put('/:podId/members/:memberId/accept', 
  protect, 
  autoGamify('MEMBER_ACCEPTED', (req, res, data) => ({
    podId: req.params.podId,
    memberId: req.params.memberId,
    acceptedAt: new Date()
  })), 
  async (req, res) => {
    try {
      const { podId, memberId } = req.params;
      
      const pod = await Pod.findById(podId);
      if (!pod) {
        return res.status(404).json({ message: 'Pod not found' });
      }
      
      // Check if user is the creator or has admin rights
      if (pod.creator.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Only pod creator can accept members' });
      }
      
      // Find and update the member
      const podMember = await PodMember.findOne({
        _id: memberId,
        pod: podId,
        status: 'pending'
      });
      
      if (!podMember) {
        return res.status(404).json({ message: 'Pending member not found' });
      }
      
      podMember.status = 'active';
      podMember.acceptedAt = new Date();
      await podMember.save();
      
      const populatedMember = await PodMember.findById(podMember._id)
        .populate('user', 'name email profileImage');
      
      res.json(populatedMember); // 🎮 Triggers MEMBER_ACCEPTED gamification
    } catch (error) {
      console.error('Error accepting member:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// GET ALL PODS
router.get('/', async (req, res) => {
  try {
    const { creator, category, status, search } = req.query;
    let query = {};
    
    if (creator) query.creator = creator;
    if (category) query.category = category;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
     
    const pods = await Pod.find(query)
      .populate('creator', 'name profileImage')
      .sort({ createdAt: -1 });
     
    res.json(pods);
  } catch (error) {
    console.error('Error fetching pods:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET SINGLE POD
router.get('/:id', async (req, res) => {
  try {
    const pod = await Pod.findById(req.params.id)
      .populate('creator', 'name profileImage');
           
    if (!pod) {
      return res.status(404).json({ message: 'Pod not found' });
    }
    
    // Get member count
    const memberCount = await PodMember.countDocuments({
      pod: req.params.id,
      status: 'active'
    });
    
    const responseData = {
      ...pod.toObject(),
      memberCount
    };
           
    res.json(responseData);
  } catch (error) {
    console.error('Error fetching pod:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Pod not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// GET CREATOR'S PODS
router.get('/creator/my-pods', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    
    console.log('Looking for pods with creator ID:', userId);

    const pods = await Pod.find({ creator: userId })
      .populate('creator', 'name profileImage')
      .sort({ createdAt: -1 });
    
    console.log(`Found ${pods.length} pods for creator ${userId}`);
    
    // For each pod, get additional statistics
    const podsWithStats = await Promise.all(pods.map(async (pod) => {
      const memberCount = await PodMember.countDocuments({ 
        pod: pod._id, 
        status: 'active' 
      });
      
      const pendingApplications = await PodMember.countDocuments({
        pod: pod._id,
        status: 'pending'
      });
      
      // Create a formatted pod object with all data
      const podData = {
        ...pod._doc,
        memberCount,
        pendingApplications
      };
      
      return podData;
    }));
    
    console.log(`Returning ${podsWithStats.length} pods with statistics`);
    res.json(podsWithStats);
  } catch (error) {
    console.error('Error in creator pods endpoint:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET POD MEMBERS
router.get('/:podId/members', async (req, res) => {
  try {
    const { podId } = req.params;
    const { status } = req.query;
    
    let query = { pod: podId };
    if (status) query.status = status;
    
    const members = await PodMember.find(query)
      .populate('user', 'name email profileImage')
      .sort({ joinedAt: -1 });
    
    res.json(members);
  } catch (error) {
    console.error('Error fetching pod members:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE POD
router.put('/:id', protect, async (req, res) => {
  try {
    const pod = await Pod.findById(req.params.id);
    
    if (!pod) {
      return res.status(404).json({ message: 'Pod not found' });
    }
    
    // Check if user is the creator
    if (pod.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only pod creator can update this pod' });
    }
    
    const updatedPod = await Pod.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('creator', 'name profileImage');
    
    res.json(updatedPod);
  } catch (error) {
    console.error('Error updating pod:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE POD
router.delete('/:id', protect, async (req, res) => {
  try {
    const pod = await Pod.findById(req.params.id);
    
    if (!pod) {
      return res.status(404).json({ message: 'Pod not found' });
    }
    
    // Check if user is the creator
    if (pod.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only pod creator can delete this pod' });
    }
    
    // Delete associated pod members
    await PodMember.deleteMany({ pod: req.params.id });
    
    // Delete the pod
    await Pod.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Pod deleted successfully' });
  } catch (error) {
    console.error('Error deleting pod:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;