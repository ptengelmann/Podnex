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
  
  // Connection event
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    
    // Handle pod join
    socket.on('join_pod', ({ podId, userId, userName }) => {
      try {
        console.log(`User ${userName} (${userId}) joined pod: ${podId}`);
        
        // Leave any existing pods this socket might be in
        Object.keys(socket.rooms).forEach(room => {
          if (room !== socket.id) {
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
      } catch (error) {
        console.error('Error handling send_message:', error);
        
        // Notify sender about the error
        socket.emit('message_error', { 
          originalMessage: messageData,
          error: error.message 
        });
        
        // Still broadcast original message if save fails but with temporary ID
        // This allows for optimistic UI updates even with DB failures
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
  
  // Log socket server start
  console.log('Socket.IO server initialized');
  
  return io;
}

module.exports = setupSocket;