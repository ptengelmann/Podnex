const socketIO = require('socket.io');
const Message = require('./models/Message');

function setupSocket(server) {
  const io = socketIO(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  const podUsers = {};

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    
    socket.on('join_pod', ({ podId, userId, userName }) => {
      console.log(`User ${userName} joined pod: ${podId}`);
      socket.join(podId);
      
      if (!podUsers[podId]) {
        podUsers[podId] = [];
      }
      podUsers[podId].push({ userId, userName, socketId: socket.id });
      
      io.to(podId).emit('pod_users_updated', podUsers[podId]);
    });
    
    socket.on('send_message', async (messageData) => {
      console.log('Message received:', messageData);
      
      try {
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
        console.error('Error saving message:', error);
        // Still broadcast original message if save fails
        io.to(messageData.podId).emit('receive_message', messageData);
      }
    });
    
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      
      Object.keys(podUsers).forEach(podId => {
        podUsers[podId] = podUsers[podId].filter(user => user.socketId !== socket.id);
        io.to(podId).emit('pod_users_updated', podUsers[podId]);
      });
    });
  });

  return io;
}

module.exports = setupSocket;