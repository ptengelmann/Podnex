import React, { useState, useEffect } from 'react';
import styles from './NotificationsPanel.module.scss';
import { motion } from 'framer-motion';

const NotificationsPanel = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const sample = [
      { id: 1, text: 'Maria joined your "AI Launch" pod', time: '2h ago', read: false },
      { id: 2, text: 'New contribution to "Sustainable Project"', time: '5h ago', read: false },
      { id: 3, text: 'Your pod "Crypto Dev" reached 50 members', time: '1d ago', read: true },
    ];
    setNotifications(sample);
  }, []);

  return (
    <motion.section
      className={styles.notificationsPanel}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      <h2>Notifications</h2>
      <div className={styles.notificationsList}>
        {notifications.length > 0 ? (
          notifications.map((note) => (
            <div key={note.id} className={`${styles.notification} ${note.read ? styles.read : ''}`}>
              <div className={styles.content}>
                <p>{note.text}</p>
                <span className={styles.time}>{note.time}</span>
              </div>
              {!note.read && <div className={styles.dot} />}
            </div>
          ))
        ) : (
          <p className={styles.noNotifications}>No notifications yet.</p>
        )}
      </div>
    </motion.section>
  );
};

export default NotificationsPanel;
