// server/middleware/gamificationMiddleware.js
const GamificationService = require('../services/GamificationService');

// Auto-gamification middleware factory
const autoGamify = (actionType, dataExtractor = null) => {
  return async (req, res, next) => {
    // Store original response methods
    const originalJson = res.json;
    const originalSend = res.send;
    
    // Override res.json to intercept successful responses
    res.json = function(data) {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        // Extract gamification data
        const actionData = dataExtractor ? 
          dataExtractor(req, res, data) : 
          { ...req.body, ...req.params, responseData: data };
        
        // Trigger gamification asynchronously (non-blocking)
        setImmediate(async () => {
          try {
            if (req.user && req.user._id) {
              await GamificationService.processAction(actionType, req.user._id, actionData);
            }
          } catch (error) {
            console.error(`[GAMIFICATION] Failed for ${actionType}:`, error);
          }
        });
      }
      
      return originalJson.call(this, data);
    };
    
    // Also override res.send for routes that use send instead of json
    res.send = function(data) {
      if (res.statusCode >= 200 && res.statusCode < 300 && req.user && req.user._id) {
        const actionData = dataExtractor ? 
          dataExtractor(req, res, data) : 
          { ...req.body, ...req.params };
        
        setImmediate(async () => {
          try {
            await GamificationService.processAction(actionType, req.user._id, actionData);
          } catch (error) {
            console.error(`[GAMIFICATION] Failed for ${actionType}:`, error);
          }
        });
      }
      
      return originalSend.call(this, data);
    };
    
    next();
  };
};

// Data extractors for different actions
const extractors = {
  podCreated: (req, res, data) => ({
    podId: data._id,
    title: data.title,
    description: data.description,
    hasDetailedDescription: data.description && data.description.length > 100,
    rolesCount: data.rolesNeeded ? data.rolesNeeded.length : 0,
    hasMilestones: data.milestones && data.milestones.length > 0,
    category: data.category,
    complexity: data.rolesNeeded && data.rolesNeeded.length > 5 ? 'high' : 'medium'
  }),
  
  taskCreated: (req, res, data) => ({
    podId: req.params.podId,
    taskId: data._id,
    title: data.title,
    description: data.description,
    difficulty: data.difficulty || req.body.difficulty,
    priority: data.priority || req.body.priority,
    type: data.type || req.body.type
  }),
  
  taskCompleted: (req, res, data) => ({
    podId: req.params.podId,
    taskId: data._id || req.params.taskId,
    title: data.title,
    difficulty: data.difficulty,
    priority: data.priority,
    type: data.type,
    completedEarly: data.dueDate ? new Date() < new Date(data.dueDate) : false,
    assignedMembersCount: data.assignedTo ? data.assignedTo.length : 0
  }),
  
  joinedPod: (req, res, data) => ({
    podId: req.params.podId || data.pod?._id,
    role: data.role,
    membershipId: data._id,
    podMemberCount: data.memberCount || 0,
    podCreatorTier: data.creatorTier
  }),
  
  peerReviewGiven: (req, res, data) => ({
    podId: req.params.podId,
    taskId: req.params.taskId,
    reviewText: req.body.feedback || req.body.review,
    includesCodeSuggestions: req.body.codeSuggestions || false,
    hasConstructiveFeedback: req.body.constructive || false,
    rating: req.body.rating
  })
};

module.exports = { autoGamify, extractors };