import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Clock, 
  Calendar,
  Bookmark,
  Activity,
  ArrowRight,
  Briefcase,
  Code
} from 'lucide-react';
import styles from './PodCard.module.scss';

const PodCard = ({ 
  id, 
  title, 
  description = 'No description provided.', 
  status = 'draft', 
  urgency = 'medium',
  category = 'development',
  format = 'project',
  progress = 0,
  deadline,
  budget,
  creator = {},
  rolesNeeded = [],
  skills = [],
  teamSize = 0,
  maxMembers = 8,
  commitment = 'part-time'
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Handle bookmark click
  const handleBookmarkClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };
  
  // Format deadline text
  const formatDeadline = (date) => {
    if (!date) return 'No deadline';
    return 'No deadline'; // Simplified to match screenshots
  };

  // Get category icon
  const getCategoryIcon = () => {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 18L22 12L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 6L2 12L8 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  };

  // Truncate text
  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength 
      ? text.substring(0, maxLength) + '...' 
      : text;
  };

  return (
    <Link 
      to={`/pods/${id}`} 
      className={styles.cardLink}
    >
      <motion.div 
        className={styles.card}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        initial={{ y: 0 }}
        whileHover={{ 
          y: -5,
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2), 0 0 30px rgba(232, 197, 71, 0.1)",
          borderColor: "rgba(232, 197, 71, 0.3)"
        }}
        transition={{ 
          type: "spring", 
          stiffness: 300
        }}
      >
        {/* Top Header Row */}
        <div className={styles.topHeaderRow}>
          {/* Status Badge */}
          <div className={styles.statusBadge}>
            {status.toUpperCase()}
          </div>
          
          {/* Category Badge */}
          <div className={styles.categoryBadge}>
            {getCategoryIcon()}
            <span>{category}</span>
          </div>
          
          {/* Bookmark button */}
          <motion.button
            className={`${styles.bookmarkButton} ${isBookmarked ? styles.bookmarked : ''}`}
            onClick={handleBookmarkClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={isBookmarked ? "Remove bookmark" : "Bookmark this pod"}
          >
            <Bookmark size={16} />
          </motion.button>
        </div>
        
        {/* Priority Badge - Now positioned below top row */}
        <div className={styles.priorityBadge}>
          <div className={styles.priorityDot} />
          <span>{urgency.charAt(0).toUpperCase() + urgency.slice(1)} Priority</span>
        </div>
        
        {/* Title and Description */}
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
        
        {/* Creator info */}
        <div className={styles.creatorSection}>
          <div className={styles.creatorAvatar}>
            {creator.name?.charAt(0).toUpperCase() || '?'}
          </div>
          <div className={styles.creatorInfo}>
            <span className={styles.creatorName}>{creator.name || 'Anonymous'}</span>
            <span className={styles.creatorRole}>Pod Creator</span>
          </div>
        </div>
        
        {/* Details row */}
        <div className={styles.detailsRow}>
          <div className={styles.detailItem}>
            <Calendar size={16} />
            <span>{formatDeadline(deadline)}</span>
          </div>
          
          <div className={styles.detailItem}>
            <Users size={16} />
            <span>{teamSize}/{maxMembers} members</span>
          </div>
          
          <div className={styles.detailItem}>
            <Briefcase size={16} />
            <span>{commitment}</span>
          </div>
        </div>
        
        {/* Progress section - only for in progress pods */}
        {status.toLowerCase() === 'in progress' && (
          <div className={styles.progressSection}>
            <div className={styles.progressLabel}>
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className={styles.progressBar}>
              <motion.div 
                className={styles.progressFill}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>
        )}
        
        {/* Card footer */}
        <div className={styles.cardFooter}>
          <div className={styles.formatBadge}>
            <Activity size={16} />
            <span>{format}</span>
          </div>
          
          <motion.div 
            className={styles.viewDetails}
            animate={isHovered ? { x: 5 } : { x: 0 }}
            transition={{ type: "spring", stiffness: 500 }}
          >
            <span>View Details</span>
            <ArrowRight size={16} />
          </motion.div>
        </div>
        
        {/* Hover glow effect */}
        <AnimatePresence>
          {isHovered && (
            <motion.div 
              className={styles.hoverGlow}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </Link>
  );
};

export default PodCard;