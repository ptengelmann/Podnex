import React from 'react';
import { Link } from 'react-router-dom'; // Keeping the important import
import styles from './PodCard.module.scss';
import { motion } from 'framer-motion';

const PodCard = ({ id, title, status, neededRoles, creatorName }) => {
  // Map status to appropriate color class
  const getStatusClass = () => {
    switch(status?.toLowerCase()) {
      case 'open':
        return styles.statusOpen;
      case 'in progress':
        return styles.statusInProgress;
      case 'live':
        return styles.statusLive;
      case 'draft':
        return styles.statusDraft;
      case 'pre-launch':
        return styles.statusPreLaunch;
      case 'archived':
        return styles.statusArchived;
      default:
        return '';
    }
  };
  
  return (
    <Link to={`/pods/${id}`} className={styles.cardLink}>
      <motion.div 
        className={styles.card}
        whileHover={{ 
          y: -5,
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)"
        }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className={styles.cardHeader}>
          <div className={`${styles.status} ${getStatusClass()}`}>
            <span className={styles.statusDot}></span>
            {status}
          </div>
          
          {/* Card Actions - could be expanded with functionality */}
          <div className={styles.cardActions}>
            <motion.button 
              className={styles.bookmarkBtn}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Bookmark pod"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 13.5L8 10.5L4 13.5V4C4 3.73478 4.10536 3.48043 4.29289 3.29289C4.48043 3.10536 4.73478 3 5 3H11C11.2652 3 11.5196 3.10536 11.7071 3.29289C11.8946 3.48043 12 3.73478 12 4V13.5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.button>
          </div>
        </div>
        
        <h3 className={styles.title}>{title}</h3>

        {creatorName && (
          <div className={styles.creatorInfo}>
            <div className={styles.creatorAvatar}>
              {/* Display creator's initial as a placeholder */}
              {creatorName.charAt(0).toUpperCase()}
            </div>
            <p className={styles.creator}>by {creatorName}</p>
          </div>
        )}
        
        {neededRoles && neededRoles.length > 0 && (
          <div className={styles.rolesSection}>
            <div className={styles.rolesSectionHeader}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 20H22V18C22 16.3431 20.6569 15 19 15C18.0444 15 17.1931 15.4468 16.6438 16.1429M17 20H7M17 20V18C17 17.3438 16.8736 16.717 16.6438 16.1429M7 20H2V18C2 16.3431 3.34315 15 5 15C5.95561 15 6.80686 15.4468 7.35625 16.1429M7 20V18C7 17.3438 7.12642 16.717 7.35625 16.1429M7.35625 16.1429C8.0935 14.301 9.89482 13 12 13C14.1052 13 15.9065 14.301 16.6438 16.1429M15 7C15 9.20914 13.2091 11 11 11C8.79086 11 7 9.20914 7 7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7ZM21 8C21 9.65685 19.6569 11 18 11C16.3431 11 15 9.65685 15 8C15 6.34315 16.3431 5 18 5C19.6569 5 21 6.34315 21 8ZM9 8C9 9.65685 7.65685 11 6 11C4.34315 11 3 9.65685 3 8C3 6.34315 4.34315 5 6 5C7.65685 5 9 6.34315 9 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Needed Roles</span>
            </div>
            <div className={styles.roles}>
              {neededRoles.map((role, index) => (
                <span key={index} className={styles.role}>
                  {role}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className={styles.cardFooter}>
          <motion.div 
            className={styles.viewPodIndicator}
            animate={{ x: [0, 5, 0] }}
            transition={{ 
              repeat: Infinity, 
              repeatType: "reverse", 
              duration: 1.5,
              ease: "easeInOut",
            }}
          >
            <span>View details</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 8H15M15 8L8 1M15 8L8 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </div>
      </motion.div>
    </Link>
  );
};

export default PodCard;