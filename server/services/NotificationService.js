// server/services/NotificationService.js - UPDATED VERSION
class NotificationService {
  constructor() {
    this.io = null;
  }

  // Initialize with existing Socket.IO instance
  initialize(socketIOInstance) {
    this.io = socketIOInstance;
    console.log('🔌 NotificationService initialized with existing Socket.IO instance');
  }

  // Send XP gained notification
  async sendXPGained(userId, xpData) {
    if (this.io && this.io.sendXPGained) {
      this.io.sendXPGained(userId, xpData);
    }
  }

  // Send achievement/badge notification
  async sendAchievementNotification(userId, badge) {
    if (this.io && this.io.sendAchievementNotification) {
      this.io.sendAchievementNotification(userId, badge);
    }
  }

  // Send level up notification
  async sendLevelUp(userId, levelData) {
    if (this.io && this.io.sendLevelUp) {
      this.io.sendLevelUp(userId, levelData);
    }
  }

  // Send tier promotion notification
  async sendTierPromotion(userId, tierData) {
    if (this.io && this.io.sendTierPromotion) {
      this.io.sendTierPromotion(userId, tierData);
    }
  }

  // Send general notification
  async sendNotification(userId, notification) {
    if (this.io && this.io.sendNotification) {
      this.io.sendNotification(userId, notification);
    }
  }

  // Broadcast to all users in a pod
  async broadcastToPod(podId, event, data) {
    if (this.io && this.io.broadcastToPod) {
      this.io.broadcastToPod(podId, event, data);
    }
  }
}

module.exports = new NotificationService();