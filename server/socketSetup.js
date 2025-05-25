// server/socketSetup.js - INTEGRATED VERSION
const socketIO = require('socket.io');
const Message = require('./models/Message');

function setupSocket(server) {
  const io = socketIO(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true
    },
    transports: ['websocket', 'polling'], // Enable fallback mechanisms
    pingTimeout: 60000, // Increase timeout for better stability
    pingInterval: 25000 // Check connection every 25 seconds
  });
  
  // Store active pod users
  const podUsers = {};
  
  // Store connected users for gamification notifications
  const connectedUsers = new Map();
  
  // Connection event
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    
    // 🎮 GAMIFICATION: User joins their notification room
    socket.on('join_user_room', (userId) => {
      socket.join(`user_${userId}`);
      connectedUsers.set(socket.id, userId);
      console.log(`👤 User ${userId} joined notification room`);
    });
    
    // Handle pod join
    socket.on('join_pod', ({ podId, userId, userName }) => {
      try {
        console.log(`User ${userName} (${userId}) joined pod: ${podId}`);
        
        // Leave any existing pods this socket might be in
        Object.keys(socket.rooms).forEach(room => {
          if (room !== socket.id && !room.startsWith('user_')) {
            socket.leave(room);
          }
        });
        
        // Join the new pod room
        socket.join(podId);
        
        // Initialize pod users array if doesn't exist
        if (!podUsers[podId]) {
          podUsers[podId] = [];
        }
        
        // Remove any existing entries for this user (if reconnecting)
        podUsers[podId] = podUsers[podId].filter(user => user.userId !== userId);
        
        // Add user to the pod
        podUsers[podId].push({ 
          userId, 
          userName, 
          socketId: socket.id,
          joinedAt: new Date().toISOString()
        });
        
        // Notify all users in the pod about the updated user list
        io.to(podId).emit('pod_users_updated', podUsers[podId]);
        
        // Send system message about user joining
        io.to(podId).emit('system_message', {
          type: 'user_joined',
          message: `${userName} has joined the pod`,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error in join_pod handler:', error);
        socket.emit('error', { message: 'Failed to join pod session' });
      }
    });
    
    // 🎮 GAMIFICATION: Handle user joining pod room for notifications
    socket.on('join_pod_room', (podId) => {
      socket.join(`pod_${podId}`);
    });
    
    // Handle messages
    socket.on('send_message', async (messageData) => {
      try {
        console.log('Message received:', messageData);
        
        // Validate required data
        if (!messageData.text || !messageData.podId || !messageData.senderId) {
          throw new Error('Missing required message data');
        }
        
        // Save message to database
        const message = new Message({
          text: messageData.text,
          pod: messageData.podId,
          sender: messageData.senderId
        });
        
        await message.save();
        
        // Fetch the populated message
        const populatedMessage = await Message.findById(message._id)
          .populate('sender', 'name profileImage');
        
        // Broadcast the message with sender details
        io.to(messageData.podId).emit('receive_message', {
          _id: populatedMessage._id,
          text: populatedMessage.text,
          sender: populatedMessage.sender,
          createdAt: populatedMessage.createdAt
        });
        
        // 🎮 GAMIFICATION: Trigger MESSAGE_SENT action
        try {
          const GamificationService = require('./services/GamificationService');
          setImmediate(async () => {
            try {
              await GamificationService.processAction('MESSAGE_SENT', messageData.senderId, {
                podId: messageData.podId,
                messageLength: messageData.text.length
              });
            } catch (gamError) {
              console.error('Gamification error for MESSAGE_SENT:', gamError);
            }
          });
        } catch (error) {
          console.error('Error loading GamificationService:', error);
        }
        
      } catch (error) {
        console.error('Error handling send_message:', error);
        
        // Notify sender about the error
        socket.emit('message_error', { 
          originalMessage: messageData,
          error: error.message 
        });
        
        // Still broadcast original message if save fails but with temporary ID
        if (messageData && messageData.podId) {
          io.to(messageData.podId).emit('receive_message', {
            ...messageData,
            _id: `temp_${Date.now()}`,
            temporary: true,
            createdAt: new Date().toISOString()
          });
        }
      }
    });
    
    // Handle user typing status
    socket.on('typing_status', ({ podId, userId, userName, isTyping }) => {
      socket.to(podId).emit('user_typing', { 
        userId, 
        userName, 
        isTyping 
      });
    });
    
    // Handle pod data updates (tasks, milestones)
    socket.on('pod_data_update', ({ podId, updateType, data }) => {
      socket.to(podId).emit('pod_data_updated', {
        updateType,
        data,
        timestamp: new Date().toISOString()
      });
    });
    
    // Handle disconnections
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      
      // 🎮 GAMIFICATION: Clean up user notification tracking
      const userId = connectedUsers.get(socket.id);
      if (userId) {
        console.log(`👤 User ${userId} disconnected from notifications`);
        connectedUsers.delete(socket.id);
      }
      
      // Find which pods this user was in
      Object.keys(podUsers).forEach(podId => {
        const userIndex = podUsers[podId].findIndex(user => user.socketId === socket.id);
        
        if (userIndex !== -1) {
          const disconnectedUser = podUsers[podId][userIndex];
          
          // Remove user from pod
          podUsers[podId].splice(userIndex, 1);
          
          // Notify remaining users
          io.to(podId).emit('pod_users_updated', podUsers[podId]);
          
          // Send system message
          io.to(podId).emit('system_message', {
            type: 'user_left',
            message: `${disconnectedUser.userName} has left the pod`,
            timestamp: new Date().toISOString()
          });
        }
        
        // Clean up empty pod arrays
        if (podUsers[podId].length === 0) {
          delete podUsers[podId];
        }
      });
    });
    
    // Handle explicit leave pod
    socket.on('leave_pod', ({ podId, userId, userName }) => {
      if (podUsers[podId]) {
        podUsers[podId] = podUsers[podId].filter(user => user.socketId !== socket.id);
        
        socket.leave(podId);
        
        // Notify remaining users
        io.to(podId).emit('pod_users_updated', podUsers[podId]);
        
        // Send system message
        io.to(podId).emit('system_message', {
          type: 'user_left',
          message: `${userName} has left the pod`,
          timestamp: new Date().toISOString()
        });
        
        // Clean up empty pod arrays
        if (podUsers[podId].length === 0) {
          delete podUsers[podId];
        }
      }
    });
    
    // Handle errors
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });
  
  // 🎮 GAMIFICATION NOTIFICATION METHODS
  // Add these methods to the io object for the NotificationService to use
  io.sendXPGained = function(userId, xpData) {
    io.to(`user_${userId}`).emit('xp_gained', {
      type: 'xp_update',
      data: {
        xpGained: xpData.xpGained,
        totalXP: xpData.totalXP,
        currentLevel: xpData.currentLevel,
        tier: xpData.tier,
        leveledUp: xpData.leveledUp,
        actionType: xpData.actionType
      },
      timestamp: new Date()
    });
    console.log(`📱 XP notification sent to user ${userId}: +${xpData.xpGained} XP`);
  };
  
  io.sendAchievementNotification = function(userId, badge) {
    io.to(`user_${userId}`).emit('achievement_unlocked', {
      type: 'badge',
      data: {
        badgeId: badge.badgeId,
        earnedAt: badge.earnedAt,
        context: badge.context,
        metadata: badge.metadata
      },
      timestamp: new Date()
    });
    console.log(`🏆 Badge notification sent to user ${userId}: ${badge.badgeId}`);
  };
  
  io.sendLevelUp = function(userId, levelData) {
    io.to(`user_${userId}`).emit('level_up', {
      type: 'level_up',
      data: {
        newLevel: levelData.newLevel,
        totalXP: levelData.totalXP,
        celebration: true
      },
      timestamp: new Date()
    });
    console.log(`🎉 Level up notification sent to user ${userId}: Level ${levelData.newLevel}`);
  };
  
  io.sendTierPromotion = function(userId, tierData) {
    io.to(`user_${userId}`).emit('tier_promotion', {
      type: 'tier_promotion',
      data: {
        newTier: tierData.newTier,
        oldTier: tierData.oldTier,
        celebration: true
      },
      timestamp: new Date()
    });
    console.log(`⭐ Tier promotion notification sent to user ${userId}: ${tierData.newTier}`);
  };
  
  io.sendNotification = function(userId, notification) {
    io.to(`user_${userId}`).emit('notification', {
      type: 'general',
      data: notification,
      timestamp: new Date()
    });
  };
  
  io.broadcastToPod = function(podId, event, data) {
    io.to(`pod_${podId}`).emit(event, {
      data,
      timestamp: new Date()
    });
  };
  
  // Log socket server start
  console.log('Socket.IO server initialized with Gamification support');
  
  return io;
}

module.exports = setupSocket;