import React from 'react';
import styles from './StatsSection.module.scss';
import { motion } from 'framer-motion';


const statsData = [
  { label: "Pods You're In", value: 5 },
  { label: "Pods You're Leading", value: 2 },
  { label: "Pending Applications", value: 4 },
  { label: "Reputation Score", value: 78 },
  { label: "Pods Successfully Launched", value: 3 },
  { label: "Collaborators Connected", value: 18 }
];


const StatsSection = () => {
  return (
    <section className={styles.statsSection}>
      <motion.div
        className={styles.statsGrid}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {statsData.map((stat, index) => (
          <motion.div
            key={index}
            className={styles.statCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className={styles.statValue}>
              {stat.label === "Reputation Score" ? (
                <>
                  <span>{stat.value}</span>
                  <div className={styles.progressBarWrapper}>
                    <div
                      className={styles.progressBar}
                      style={{ width: `${stat.value}%` }}
                    />
                  </div>
                </>
              ) : (
                <span>{stat.value}</span>
              )}
            </div>
            <div className={styles.statLabel}>{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};


export default StatsSection;
