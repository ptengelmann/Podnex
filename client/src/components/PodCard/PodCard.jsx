import React, { useState, useEffect, useRef } from 'react';
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
  Code,
  Star,
  Check,
  Zap,
  Clock3,
  Shield,
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const cardRef = useRef(null);
  const progressBarRef = useRef(null);
  
  // Dynamically calculate time left for deadline
  useEffect(() => {
    if (deadline) {
      const targetDate = new Date(deadline);
      const now = new Date();
      const diffTime = targetDate - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0) {
        setTimeLeft('Expired');
      } else if (diffDays === 0) {
        setTimeLeft('Due today');
      } else if (diffDays === 1) {
        setTimeLeft('Due tomorrow');
      } else if (diffDays < 7) {
        setTimeLeft(`${diffDays} days left`);
      } else if (diffDays < 30) {
        setTimeLeft(`${Math.ceil(diffDays / 7)} weeks left`);
      } else {
        setTimeLeft(`${Math.ceil(diffDays / 30)} months left`);
      }
    } else {
      setTimeLeft('No deadline');
    }
  }, [deadline]);
  
  // Handle bookmark click with animation feedback
  const handleBookmarkClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    
    // Add visual feedback
    if (cardRef.current) {
      cardRef.current.classList.add(styles.pulse);
      setTimeout(() => {
        cardRef.current.classList.remove(styles.pulse);
      }, 600);
    }
  };
  
  // Toggle expanded state for showing more details
  const handleExpandToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };
  
  // Format deadline for display
  const formatDeadline = (date) => {
    if (!date) return 'No deadline';
    
    const deadlineDate = new Date(date);
    const options = { month: 'short', day: 'numeric' };
    const formattedDate = deadlineDate.toLocaleDateString('en-US', options);
    
    return formattedDate;
  };

  // Get icon based on category
  const getCategoryIcon = () => {
    switch (category.toLowerCase()) {
      case 'development':
        return <Code size={16} />;
      case 'design':
        return <Star size={16} />;
      case 'marketing':
        return <Zap size={16} />;
      case 'research':
        return <Clock3 size={16} />;
      case 'security':
        return <Shield size={16} />;
      default:
        return <Activity size={16} />;
    }
  };

  // Truncate text for display
  const truncateText = (text, maxLength = 120) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    
    const lastSpace = text.lastIndexOf(' ', maxLength);
    return text.substring(0, lastSpace > 0 ? lastSpace : maxLength) + '...';
  };
  
  // Get status color based on status
  const getStatusColor = () => {
    switch (status.toLowerCase()) {
      case 'completed':
        return '#4CAF50';
      case 'in progress':
        return '#2196F3';
      case 'active':
        return '#E8C547';
      default:
        return '#9E9E9E';
    }
  };
  
  // Get urgency icon based on urgency level
  const getUrgencyIcon = () => {
    switch (urgency.toLowerCase()) {
      case 'high':
        return <Zap size={14} className={styles.urgencyIconHigh} />;
      case 'medium':
        return <Clock size={14} className={styles.urgencyIconMedium} />;
      case 'low':
        return <Clock3 size={14} className={styles.urgencyIconLow} />;
      default:
        return <Clock size={14} className={styles.urgencyIconMedium} />;
    }
  };
  
  // Add highlight animation to progress bar
  useEffect(() => {
    if (progressBarRef.current && status.toLowerCase() === 'in progress') {
      const progressBar = progressBarRef.current;
      
      const addShine = () => {
        progressBar.classList.add(styles.shine);
        setTimeout(() => {
          progressBar.classList.remove(styles.shine);
        }, 1500);
      };
      
      // Add initial shine
      setTimeout(addShine, 500);
      
      // Add periodic shine
      const interval = setInterval(addShine, 5000);
      
      return () => clearInterval(interval);
    }
  }, [status]);

  return (
    <Link 
      to={`/pods/${id}`} 
      className={styles.cardLink}
      aria-label={`View details for ${title}`}
    >
      <motion.div 
        className={styles.card}
        ref={cardRef}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ 
          y: -5,
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.25), 0 0 30px rgba(232, 197, 71, 0.15)"
        }}
        transition={{ 
          type: "spring", 
          stiffness: 300,
          damping: 20
        }}
      >
        {/* Status indicator line on top */}
        <div 
          className={styles.statusIndicator}
          style={{ backgroundColor: getStatusColor() }}
        />
        
        {/* Top Header Row */}
        <div className={styles.topHeaderRow}>
          {/* Status Badge */}
          <div 
            className={styles.statusBadge}
            style={{ 
              backgroundColor: `${getStatusColor()}20`,
              color: getStatusColor()
            }}
          >
            {status === 'completed' && <Check size={12} />}
            <span>{status.toUpperCase()}</span>
          </div>
          
          {/* Category Badge */}
          <div className={styles.categoryBadge}>
            {getCategoryIcon()}
            <span>{category}</span>
          </div>
          
          {/* Bookmark button with effects */}
          <motion.button
            className={`${styles.bookmarkButton} ${isBookmarked ? styles.bookmarked : ''}`}
            onClick={handleBookmarkClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={isBookmarked ? "Remove bookmark" : "Bookmark this pod"}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <Bookmark size={16} />
            
            {/* Tooltip */}
            <AnimatePresence>
              {showTooltip && (
                <motion.div 
                  className={styles.tooltip}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                >
                  {isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Bookmark animation */}
            <AnimatePresence>
              {isBookmarked && (
                <motion.div 
                  className={styles.bookmarkRing}
                  initial={{ scale: 0, opacity: 0.8 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                />
              )}
            </AnimatePresence>
          </motion.button>
        </div>
        
        {/* Priority Badge with pulsing effect */}
        <div className={`${styles.priorityBadge} ${styles[urgency.toLowerCase()]}`}>
          <div className={styles.priorityDot} />
          {getUrgencyIcon()}
          <span>{urgency.charAt(0).toUpperCase() + urgency.slice(1)} Priority</span>
        </div>
        
        {/* Title and Description */}
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>
          {isExpanded ? description : truncateText(description)}
          {description.length > 120 && (
            <button 
              className={styles.expandButton}
              onClick={handleExpandToggle}
              aria-expanded={isExpanded}
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </p>
        
        {/* Creator info with hover effect */}
        <div className={styles.creatorSection}>
          <div className={styles.creatorAvatar}>
            {creator.avatar ? (
              <img 
                src={creator.avatar} 
                alt={creator.name || 'User'} 
                className={styles.avatarImage}
              />
            ) : (
              creator.name?.charAt(0).toUpperCase() || '?'
            )}
          </div>
          <div className={styles.creatorInfo}>
            <span className={styles.creatorName}>{creator.name || 'Anonymous'}</span>
            <span className={styles.creatorRole}>Pod Creator</span>
          </div>
        </div>
        
        {/* Details row with enhanced icons */}
        <div className={styles.detailsRow}>
          <div className={styles.detailItem}>
            <Calendar size={16} />
            <span>{timeLeft}</span>
          </div>
          
          <div className={styles.detailItem}>
            <Users size={16} />
            <span>{teamSize}/{maxMembers}</span>
          </div>
          
          <div className={styles.detailItem}>
            <Briefcase size={16} />
            <span>{commitment}</span>
          </div>
        </div>
        
        {/* Skills section with animation */}
        {skills && skills.length > 0 && (
          <div className={styles.skillsSection}>
            <h4 className={styles.skillsTitle}>Skills Required</h4>
            <div className={styles.skillsList}>
              {skills.slice(0, 4).map((skill, index) => (
                <motion.span 
                  key={index} 
                  className={styles.skillTag}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ 
                    scale: 1.05,
                    backgroundColor: 'rgba(232, 197, 71, 0.1)'
                  }}
                >
                  {skill}
                </motion.span>
              ))}
              {skills.length > 4 && (
                <motion.span 
                  className={styles.moreSkills}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  +{skills.length - 4} more
                </motion.span>
              )}
            </div>
          </div>
        )}
        
        {/* Progress section with animated progress bar */}
        {status.toLowerCase() === 'in progress' && (
          <div className={styles.progressSection}>
            <div className={styles.progressLabel}>
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className={styles.progressBar}>
              <motion.div 
                className={styles.progressFill}
                ref={progressBarRef}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>
        )}
        
        {/* Card footer with enhanced view details */}
        <div className={styles.cardFooter}>
          <div className={styles.formatBadge}>
            <Activity size={16} />
            <span>{format}</span>
          </div>
          
          <motion.div 
            className={styles.viewDetails}
            animate={isHovered ? { x: 5 } : { x: 0 }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 500 }}
          >
            <span>View Details</span>
            <ArrowRight size={16} />
          </motion.div>
        </div>
        
        {/* Enhanced hover effects */}
        <AnimatePresence>
          {isHovered && (
            <>
              <motion.div 
                className={styles.hoverGlow}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
              
              <motion.div 
                className={styles.cornerEffect}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.2 }}
              />
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </Link>
  );
};

export default PodCard;