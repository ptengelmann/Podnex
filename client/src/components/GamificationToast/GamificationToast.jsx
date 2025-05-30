// client/src/components/GamificationToast/GamificationToast.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Award, TrendingUp, Zap, Crown, Shield } from 'lucide-react';
import io from 'socket.io-client';
import styles from './GamificationToast.module.scss';

const GamificationToast = () => {
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);

useEffect(() => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) return;

  // Connect to socket with better error handling
  const newSocket = io('http://localhost:5000', {
    transports: ['websocket', 'polling'],
    timeout: 5000,
    reconnection: false, // Disable auto-reconnection for now
    forceNew: true
  });

  // Handle connection success
  newSocket.on('connect', () => {
    console.log('🎉 Gamification WebSocket connected');
    // Join user's notification room only after successful connection
    newSocket.emit('join_user_room', user._id);
  });

  // Handle connection errors silently
  newSocket.on('connect_error', (error) => {
    console.log('Gamification socket connection failed - server may be offline:', error.message);
    // Don't crash the app, just log it
  });

  // Handle disconnection
  newSocket.on('disconnect', (reason) => {
    console.log('Gamification socket disconnected:', reason);
  });

  setSocket(newSocket);

  // Listen for XP updates (only if connected)
  newSocket.on('xp_gained', (payload) => {
    showNotification({
      type: 'xp',
      data: payload.data,
      duration: 4000
    });
  });

  // Listen for achievements
  newSocket.on('achievement_unlocked', (payload) => {
    showNotification({
      type: 'badge',
      data: payload.data,
      duration: 6000
    });
  });

  // Listen for level ups
  newSocket.on('level_up', (payload) => {
    showNotification({
      type: 'level_up',
      data: payload.data,
      duration: 8000
    });
  });

  // Listen for tier promotions
  newSocket.on('tier_promotion', (payload) => {
    showNotification({
      type: 'tier_promotion',
      data: payload.data,
      duration: 10000
    });
  });

  return () => {
    if (newSocket) {
      newSocket.removeAllListeners();
      newSocket.close();
    }
  };
}, []);

  const showNotification = (notification) => {
    const id = Date.now() + Math.random();
    const notificationWithId = { ...notification, id };
    
    setNotifications(prev => [...prev, notificationWithId]);
    
    // Auto-remove after duration
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, notification.duration);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className={styles.toastContainer}>
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            className={`${styles.toast} ${styles[notification.type]}`}
            initial={{ opacity: 0, x: 400, scale: 0.3 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 400, scale: 0.5 }}
            transition={{ 
              type: "spring", 
              stiffness: 500, 
              damping: 30 
            }}
            onClick={() => removeNotification(notification.id)}
          >
            {notification.type === 'xp' && (
              <XPToast data={notification.data} />
            )}
            
            {notification.type === 'badge' && (
              <BadgeToast data={notification.data} />
            )}
            
            {notification.type === 'level_up' && (
              <LevelUpToast data={notification.data} />
            )}
            
            {notification.type === 'tier_promotion' && (
              <TierPromotionToast data={notification.data} />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// Individual toast components
const XPToast = ({ data }) => (
  <div className={styles.xpToast}>
    <motion.div 
      className={styles.toastIcon}
      animate={{ rotate: [0, 15, -15, 0] }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <Star size={24} />
    </motion.div>
    <div className={styles.toastContent}>
      <h4>+{data.xpGained} XP Earned!</h4>
      <p>Total: {data.totalXP.toLocaleString()} XP</p>
      {data.leveledUp && (
        <div className={styles.levelUpBadge}>
          🎉 Level {data.currentLevel}!
        </div>
      )}
    </div>
    <div className={styles.toastProgress}>
      <motion.div 
        className={styles.progressBar}
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 4 }}
      />
    </div>
  </div>
);

const BadgeToast = ({ data }) => (
  <div className={styles.badgeToast}>
    <motion.div 
      className={styles.toastIcon}
      animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <Award size={24} />
    </motion.div>
    <div className={styles.toastContent}>
      <h4>🏆 Achievement Unlocked!</h4>
      <p>{data.badgeId.replace(/_/g, ' ')}</p>
    </div>
  </div>
);

const LevelUpToast = ({ data }) => (
  <div className={styles.levelUpToast}>
    <motion.div 
      className={styles.toastIcon}
      animate={{ 
        scale: [1, 1.5, 1],
        rotate: [0, 360],
        boxShadow: ['0 0 0 rgba(232, 197, 71, 0)', '0 0 30px rgba(232, 197, 71, 0.8)', '0 0 0 rgba(232, 197, 71, 0)']
      }}
      transition={{ duration: 1.5 }}
    >
      <TrendingUp size={24} />
    </motion.div>
    <div className={styles.toastContent}>
      <h4>🎉 LEVEL UP!</h4>
      <p>You reached Level {data.newLevel}!</p>
      <small>{data.totalXP.toLocaleString()} total XP</small>
    </div>
  </div>
);

const TierPromotionToast = ({ data }) => (
  <div className={styles.tierPromotionToast}>
    <motion.div 
      className={styles.toastIcon}
      animate={{ 
        scale: [1, 1.3, 1],
        rotate: [0, -10, 10, 0]
      }}
      transition={{ duration: 2, repeat: 2 }}
    >
      <Crown size={24} />
    </motion.div>
    <div className={styles.toastContent}>
      <h4>⭐ TIER PROMOTION!</h4>
      <p>Welcome to {data.newTier.toUpperCase()} Tier!</p>
      <small>Upgraded from {data.oldTier}</small>
    </div>
  </div>
);

export default GamificationToast;