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
              console.log(`🎮 [MIDDLEWARE] Triggering ${actionType} for user ${req.user._id}`);
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
            console.log(`🎮 [MIDDLEWARE] Triggering ${actionType} for user ${req.user._id}`);
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
    complexity: data.rolesNeeded && data.rolesNeeded.length > 5 ? 'high' : 'medium',
    hasSkills: data.skills && data.skills.length > 0,
    hasRequirements: data.requirements && data.requirements.length > 0,
    isUrgent: data.urgency === 'high',
    hasDeadline: !!data.deadline,
    visibility: data.visibility || 'public'
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
    podCreatorTier: data.podCreatorTier || 'bronze',
    podTitle: data.pod?.title || 'Unknown Pod',
    podCategory: data.pod?.category || 'general',
    hasApplication: !!(req.body.application || req.body.motivation),
    applicationLength: (req.body.application || '').length
  }),
  
  // NEW: Pod launched extractor
  podLaunched: (req, res, data) => ({
    podId: req.params.podId || data._id,
    title: data.title,
    memberCount: data.memberCount || 0,
    rolesCount: (data.rolesNeeded || []).length,
    category: data.category || 'general',
    launchedAt: data.launchedAt || new Date(),
    timeTakenToLaunch: data.createdAt ? 
      Math.ceil((new Date() - new Date(data.createdAt)) / (1000 * 60 * 60 * 24)) : 0
  }),

  // NEW: Pod completed extractor
  podCompleted: (req, res, data) => ({
    podId: req.params.podId || data._id,
    title: data.title,
    memberCount: data.memberCount || 0,
    tasksCompleted: data.tasksCompleted || 0,
    duration: data.duration || 0,
    completedAt: data.completedAt || new Date(),
    hasOutcomes: !!(data.outcomes || req.body.outcomes),
    hasNotes: !!(data.completionNotes || req.body.completionNotes),
    category: data.category || 'general'
  }),

  // NEW: Member invited extractor
  invitedMember: (req, res, data) => ({
    podId: req.params.podId,
    invitedUserId: req.body.userId || data.invitedUser,
    role: req.body.role || data.role || 'contributor',
    hasPersonalMessage: !!(req.body.message || data.message),
    messageLength: (req.body.message || '').length
  }),

  // NEW: Member accepted extractor (for pod creator)
  memberAccepted: (req, res, data) => ({
    podId: req.params.podId,
    memberId: req.params.memberId || data._id,
    memberRole: data.role || 'contributor',
    memberName: data.user?.name || 'Unknown',
    acceptedAt: data.acceptedAt || new Date(),
    joinRequestDate: data.createdAt,
    responseTime: data.createdAt ? 
      Math.ceil((new Date() - new Date(data.createdAt)) / (1000 * 60 * 60)) : 0 // hours
  }),

  // NEW: Milestone created extractor
  milestoneCreated: (req, res, data) => ({
    podId: req.params.podId || data.pod,
    milestoneId: data._id,
    title: data.title || req.body.title,
    hasDescription: !!(data.description || req.body.description),
    hasDeadline: !!(data.deadline || req.body.deadline),
    priority: data.priority || req.body.priority || 'medium',
    tasksCount: (data.tasks || []).length
  }),

  // NEW: Milestone completed extractor
  milestoneCompleted: (req, res, data) => ({
    podId: req.params.podId || data.pod,
    milestoneId: data._id || req.params.milestoneId,
    title: data.title,
    tasksCompleted: data.tasksCompleted || 0,
    completedEarly: data.deadline ? new Date() < new Date(data.deadline) : false,
    duration: data.createdAt ? 
      Math.ceil((new Date() - new Date(data.createdAt)) / (1000 * 60 * 60 * 24)) : 0
  }),
  
  peerReviewGiven: (req, res, data) => ({
    podId: req.params.podId,
    taskId: req.params.taskId,
    reviewText: req.body.feedback || req.body.review,
    includesCodeSuggestions: req.body.codeSuggestions || false,
    hasConstructiveFeedback: req.body.constructive || false,
    rating: req.body.rating
  }),

  // NEW: Resource uploaded extractor
  resourceUploaded: (req, res, data) => ({
    podId: req.params.podId || data.pod,
    resourceId: data._id,
    title: data.title || req.body.title,
    description: data.description || req.body.description,
    fileSize: data.fileSize || req.body.fileSize,
    fileType: data.fileType || req.body.fileType,
    category: data.category || req.body.category
  }),

  // NEW: Documentation added extractor
  documentationAdded: (req, res, data) => ({
    podId: req.params.podId || data.pod,
    docId: data._id,
    title: data.title || req.body.title,
    description: data.description || req.body.description,
    contentLength: (data.content || req.body.content || '').length,
    category: data.category || req.body.category || 'general'
  })
};

module.exports = { autoGamify, extractors };