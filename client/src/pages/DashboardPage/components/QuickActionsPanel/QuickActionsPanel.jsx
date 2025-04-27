import React from 'react';
import { Plus, Users, Settings } from 'lucide-react';
import styles from './QuickActionsPanel.module.scss';
import { motion } from 'framer-motion';

const QuickActionsPanel = () => {
  return (
    <motion.section 
      className={styles.quickActionsPanel}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <h2>Quick Actions</h2>
      <div className={styles.actionsGrid}>
        <div className={styles.action}>
          <Plus size={24} />
          <span>Create Pod</span>
        </div>
        <div className={styles.action}>
          <Users size={24} />
          <span>Invite Members</span>
        </div>
        <div className={styles.action}>
          <Settings size={24} />
          <span>Settings</span>
        </div>
      </div>
    </motion.section>
  );
};

export default QuickActionsPanel;
