// server/services/NotificationService.js - ENHANCED VERSION
class NotificationService {
  constructor() {
    this.io = null;
  }

  // Initialize with existing Socket.IO instance
  initialize(socketIOInstance) {
    this.io = socketIOInstance;
    console.log('🔌 NotificationService initialized with existing Socket.IO instance');
  }

  // Send XP gained notification with better error handling
  async sendXPGained(userId, xpData) {
    try {
      if (this.io && this.io.sendXPGained) {
        console.log(`📱 Sending XP notification to user ${userId}:`, xpData);
        this.io.sendXPGained(userId, xpData);
      } else {
        console.warn('⚠️ Socket.IO not initialized for XP notification');
      }
    } catch (error) {
      console.error('❌ Failed to send XP notification:', error);
    }
  }

  // Send achievement/badge notification
  async sendAchievementNotification(userId, badge) {
    try {
      if (this.io && this.io.sendAchievementNotification) {
        console.log(`🏆 Sending badge notification to user ${userId}:`, badge);
        this.io.sendAchievementNotification(userId, badge);
      } else {
        console.warn('⚠️ Socket.IO not initialized for badge notification');
      }
    } catch (error) {
      console.error('❌ Failed to send badge notification:', error);
    }
  }

  // Send level up notification
  async sendLevelUp(userId, levelData) {
    try {
      if (this.io && this.io.sendLevelUp) {
        console.log(`🎉 Sending level up notification to user ${userId}:`, levelData);
        this.io.sendLevelUp(userId, levelData);
      } else {
        console.warn('⚠️ Socket.IO not initialized for level up notification');
      }
    } catch (error) {
      console.error('❌ Failed to send level up notification:', error);
    }
  }

  // Send tier promotion notification
  async sendTierPromotion(userId, tierData) {
    try {
      if (this.io && this.io.sendTierPromotion) {
        console.log(`⭐ Sending tier promotion notification to user ${userId}:`, tierData);
        this.io.sendTierPromotion(userId, tierData);
      } else {
        console.warn('⚠️ Socket.IO not initialized for tier promotion notification');
      }
    } catch (error) {
      console.error('❌ Failed to send tier promotion notification:', error);
    }
  }

  // Send general notification
  async sendNotification(userId, notification) {
    try {
      if (this.io && this.io.sendNotification) {
        console.log(`📢 Sending general notification to user ${userId}:`, notification);
        this.io.sendNotification(userId, notification);
      } else {
        console.warn('⚠️ Socket.IO not initialized for general notification');
      }
    } catch (error) {
      console.error('❌ Failed to send general notification:', error);
    }
  }

  // Broadcast to all users in a pod
  async broadcastToPod(podId, event, data) {
    try {
      if (this.io && this.io.broadcastToPod) {
        console.log(`📡 Broadcasting to pod ${podId}:`, { event, data });
        this.io.broadcastToPod(podId, event, data);
      } else {
        console.warn('⚠️ Socket.IO not initialized for pod broadcast');
      }
    } catch (error) {
      console.error('❌ Failed to broadcast to pod:', error);
    }
  }

  // New: Send pod-specific notifications (for creators about their pods)
  async sendPodNotification(userId, podData) {
    try {
      if (this.io && this.io.sendNotification) {
        const notification = {
          type: 'pod_update',
          title: 'Pod Update',
          message: `Your pod "${podData.title}" has been updated`,
          data: podData,
          timestamp: new Date()
        };
        
        console.log(`🏗️ Sending pod notification to user ${userId}:`, notification);
        this.io.sendNotification(userId, notification);
      }
    } catch (error) {
      console.error('❌ Failed to send pod notification:', error);
    }
  }

  // New: Send member-related notifications
  async sendMemberNotification(userId, memberData) {
    try {
      if (this.io && this.io.sendNotification) {
        const notification = {
          type: 'member_update',
          title: 'Member Update',
          message: memberData.message || 'A member update occurred',
          data: memberData,
          timestamp: new Date()
        };
        
        console.log(`👥 Sending member notification to user ${userId}:`, notification);
        this.io.sendNotification(userId, notification);
      }
    } catch (error) {
      console.error('❌ Failed to send member notification:', error);
    }
  }

  // Health check method
  isInitialized() {
    return !!this.io;
  }

  // Get connection status
  getStatus() {
    return {
      initialized: this.isInitialized(),
      socketMethods: this.io ? Object.keys(this.io).filter(key => typeof this.io[key] === 'function') : []
    };
  }
}

module.exports = new NotificationService();