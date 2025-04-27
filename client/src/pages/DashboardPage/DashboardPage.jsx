
import React from 'react';
import styles from './DashboardPage.module.scss';
import WelcomeSection from './components/WelcomeSection/WelcomeSection';
import StatsSection from './components/StatsSection/StatsSection';
import PodsSection from './components/PodsSection/PodsSection';
import ActivitySection from './components/ActivitySection/ActivitySection';
import NotificationsPanel from './components/NotificationsPanel/NotificationsPanel';
import QuickActionsPanel from './components/QuickActionsPanel/QuickActionsPanel';
import { motion } from 'framer-motion';

const DashboardPage = () => {
  return (
    <motion.div 
      className={styles.dashboardContainer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className={styles.gridLayout}>

        <motion.div
          className={styles.welcome}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <WelcomeSection />
        </motion.div>

        <motion.div
          className={styles.stats}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatsSection />
        </motion.div>

        <motion.div
          className={styles.pods}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <PodsSection />
        </motion.div>

        <motion.div
          className={styles.activity}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <ActivitySection />
        </motion.div>

        <motion.div
          className={styles.notifications}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <NotificationsPanel />
        </motion.div>

        <motion.div
          className={styles.quickActions}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <QuickActionsPanel />
        </motion.div>

      </div>
    </motion.div>
  );
};

export default DashboardPage;
