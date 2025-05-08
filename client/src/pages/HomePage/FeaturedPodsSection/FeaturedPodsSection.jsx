import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  Code, 
  Paintbrush, 
  TrendingUp, 
  ChevronRight, 
  Clock, 
  Users, 
  Target,
  Sparkles,
  Star,
  ArrowRight,
  Zap,
  Calendar,
  Layers,
  Filter,
  Eye,
  Activity,
  MessageSquare,
  Briefcase
} from 'lucide-react';
import styles from './FeaturedPodsSection.module.scss';

const FeaturedPodsSection = () => {
  // State for storing fetched pods
  const [pods, setPods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visiblePod, setVisiblePod] = useState(null);
  
  // State for filters
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'Open', 'In Progress', 'Live'];
  
  // State for animation trigger
  const [isVisible, setIsVisible] = useState(false);

  // Fetch pods from the backend
  useEffect(() => {
    const fetchPods = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/api/pods');
        
        // Sort by createdAt date (newest first) and take 5 most recent
        const sortedPods = res.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
        
        // Enhance pod data with default values for missing fields
        const enhancedPods = sortedPods.map(pod => ({
          ...pod,
          id: pod._id, // Make sure we have id as a field
          status: pod.status || 'Open',
          category: pod.category || 'Development',
          urgency: pod.urgency || 'medium',
          progress: pod.progress || Math.floor(Math.random() * 70) + 20,
          memberCount: pod.members?.length || 0,
          maxMembers: pod.maxMembers || 10,
          // Extract role titles if they are objects
          roles: pod.rolesNeeded ? (
            pod.rolesNeeded.map(role => 
              typeof role === 'object' ? role.title : role
            ).filter(Boolean)
          ) : [],
          creator: pod.creator || { name: 'Unknown Creator' },
          skills: pod.skills || [],
          featured: true
        }));
        
        setPods(enhancedPods);
        
        // Set the first pod as visible if there are any pods
        if (enhancedPods.length > 0) {
          setVisiblePod(enhancedPods[0].id);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching pods:", err);
        setError("Failed to load featured pods");
        setLoading(false);
      }
    };
    
    fetchPods();
  }, []);

  // Handle filter change
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  // Format deadline
  const formatDeadline = (date) => {
    if (!date) return 'No deadline';
    
    const deadline = new Date(date);
    const now = new Date();
    const diff = deadline - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days < 0) return 'Expired';
    if (days < 1) return 'Today';
    if (days === 1) return 'Tomorrow';
    if (days < 7) return `${days} days left`;
    if (days < 30) return `${Math.floor(days / 7)} weeks left`;
    return `${Math.floor(days / 30)} months left`;
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    if (!category) return <Layers size={18} />;
    
    switch(category.toLowerCase()) {
      case 'development':
        return <Code size={18} />;
      case 'design':
        return <Paintbrush size={18} />;
      case 'marketing':
        return <TrendingUp size={18} />;
      case 'content':
        return <MessageSquare size={18} />;
      case 'product':
        return <Briefcase size={18} />;
      default:
        return <Layers size={18} />;
    }
  };

  // Get status styling
  const getStatusColor = (status) => {
    if (!status) return '#9CA3AF';
    
    switch(status.toLowerCase()) {
      case 'open':
        return '#34D399';
      case 'in progress':
        return '#FBBF24';
      case 'live':
        return '#818CF8';
      default:
        return '#9CA3AF';
    }
  };

  // Get urgency styling
  const getUrgencyColor = (urgency) => {
    if (!urgency) return '#9CA3AF';
    
    switch(urgency.toLowerCase()) {
      case 'high':
        return '#FF4D4D';
      case 'medium':
        return '#FBBF24';
      case 'low':
        return '#34D399';
      default:
        return '#9CA3AF';
    }
  };

  // Intersection Observer to trigger animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const section = document.querySelector(`.${styles.featuredSection}`);
    if (section) observer.observe(section);

    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  // Filtered pods based on selected filter
  const filteredPods = activeFilter === 'All'
    ? pods
    : pods.filter(pod => pod.status === activeFilter);

  // Get current pod
  const currentPod = pods.find(pod => pod.id === visiblePod) || (pods.length > 0 ? pods[0] : null);

  // Loading state
  if (loading) {
    return (
      <section className={styles.featuredSection}>
        <div className={styles.container}>
          <div className={styles.loadingState}>
            <motion.div 
              className={styles.loadingSpinner}
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles size={24} />
            </motion.div>
            <p>Loading featured pods...</p>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className={styles.featuredSection}>
        <div className={styles.container}>
          <div className={styles.errorState}>
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (pods.length === 0) {
    return (
      <section className={styles.featuredSection}>
        <div className={styles.container}>
          <div className={styles.emptyState}>
            <h2>No Pods Available</h2>
            <p>Be the first to create a pod!</p>
            <Link to="/create-pod" className={styles.createButton}>
              Create a Pod
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.featuredSection}>
      <motion.div 
        className={styles.gridBackground}
        animate={{ 
          scale: [1, 1.02, 1],
          rotate: [0, 0.5, 0]
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity,
          repeatType: "reverse" 
        }}
      />
      
      <motion.div
        className={`${styles.floatingShape} ${styles.shape1}`}
        animate={{
          x: [0, 20, 0],
          y: [0, -10, 0],
          rotate: [0, 5, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div
        className={`${styles.floatingShape} ${styles.shape2}`}
        animate={{
          x: [0, -15, 0],
          y: [0, 10, 0],
          rotate: [0, -5, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <div className={styles.container}>
        {/* Section Header */}
        <motion.div 
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.headerLeft}>
            <div className={styles.sectionTitleWrapper}>
              <h2 className={styles.sectionTitle}>
                <Sparkles size={20} className={styles.titleIcon} />
                Featured Pods
              </h2>
              <motion.div 
                className={styles.titleDecoration}
                initial={{ width: '0%' }}
                animate={isVisible ? { width: '60%' } : {}}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </div>
            <p className={styles.sectionDescription}>
              Join these thriving collaborations or get inspired to start your own.
            </p>
          </div>
          
          {/* Filter Tabs */}
          <motion.div 
            className={styles.filtersBar}
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {filters.map((filter, index) => (
              <motion.button
                key={index}
                className={`${styles.filterButton} ${activeFilter === filter ? styles.active : ''}`}
                onClick={() => handleFilterChange(filter)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {filter}
                {activeFilter === filter && (
                  <motion.span 
                    className={styles.activeDot}
                    layoutId="activeDot"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
        
        {/* Featured Pods - Layout */}
        <div className={styles.featuredPodsLayout}>
          {/* Pod Thumbnails */}
          <motion.div 
            className={styles.podThumbnails}
            initial={{ opacity: 0, x: -30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {filteredPods.map((pod, index) => (
              <motion.div 
                key={pod.id}
                className={`${styles.podThumbnail} ${visiblePod === pod.id ? styles.active : ''}`}
                onClick={() => setVisiblePod(pod.id)}
                whileHover={{ 
                  scale: 1.03,
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)"
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              >
                <div 
                  className={styles.thumbnailStatus}
                  style={{ backgroundColor: getStatusColor(pod.status) }}
                />
                
                <div className={styles.thumbnailContent}>
                  <h3>{pod.title}</h3>
                  <div className={styles.thumbnailDetails}>
                    <span 
                      className={styles.thumbnailCategory}
                      style={{ color: pod.status === 'Open' ? '#34D399' : 
                                    pod.status === 'In Progress' ? '#FBBF24' : '#818CF8' }}
                    >
                      {getCategoryIcon(pod.category)}
                      {pod.category}
                    </span>
                    <span className={styles.thumbnailMembers}>
                      <Users size={14} />
                      {pod.memberCount}/{pod.maxMembers}
                    </span>
                  </div>
                </div>
                
                {visiblePod === pod.id && (
                  <motion.div 
                    className={styles.activeIndicator}
                    layoutId="activeIndicator"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.div>
            ))}
          </motion.div>
          
          {/* Pod Detail */}
          <AnimatePresence mode="wait">
            {currentPod && (
              <motion.div 
                key={currentPod.id}
                className={styles.podDetail}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
              >
                <div className={styles.podHeader}>
                  <div className={styles.podHeaderTop}>
                    <div 
                      className={styles.podStatus}
                      style={{ color: getStatusColor(currentPod.status) }}
                    >
                      <motion.span 
                        className={styles.statusDot}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{ backgroundColor: getStatusColor(currentPod.status) }}
                      />
                      {currentPod.status}
                    </div>
                    
                    <div className={styles.featuredBadge}>
                      <Star size={14} color="#E8C547" />
                      <span>Featured</span>
                    </div>
                  </div>
                  
                  <h2 className={styles.podTitle}>{currentPod.title}</h2>
                  
                  <div className={styles.podCreator}>
                    <div className={styles.creatorAvatar}>
                      {currentPod.creator.avatar || (currentPod.creator.name ? currentPod.creator.name.charAt(0) : 'U')}
                    </div>
                    <span>Created by {currentPod.creator.name}</span>
                  </div>
                </div>
                
                <div className={styles.podBody}>
                  <p className={styles.podDescription}>
                    {currentPod.description || currentPod.mission || 'No description provided.'}
                  </p>
                  
                  <div className={styles.podMetrics}>
                    <div className={styles.metricItem}>
                      <Clock size={18} />
                      <div className={styles.metricContent}>
                        <span className={styles.metricValue}>{formatDeadline(currentPod.deadline)}</span>
                        <span className={styles.metricLabel}>Deadline</span>
                      </div>
                    </div>
                    
                    <div className={styles.metricItem}>
                      <Users size={18} />
                      <div className={styles.metricContent}>
                        <span className={styles.metricValue}>{currentPod.memberCount}/{currentPod.maxMembers}</span>
                        <span className={styles.metricLabel}>Team Size</span>
                      </div>
                    </div>
                    
                    <div className={styles.metricItem}>
                      <Target size={18} />
                      <div className={styles.metricContent}>
                        <span className={styles.metricValue}>
                          {currentPod.urgency.charAt(0).toUpperCase() + currentPod.urgency.slice(1)}
                        </span>
                        <span className={styles.metricLabel}>Priority</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.progressSection}>
                    <div className={styles.progressHeader}>
                      <span>Project Progress</span>
                      <span>{currentPod.progress}%</span>
                    </div>
                    <div className={styles.progressBar}>
                      <motion.div 
                        className={styles.progressFill}
                        initial={{ width: 0 }}
                        animate={{ width: `${currentPod.progress}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                      />
                    </div>
                  </div>
                  
                  {currentPod.roles && currentPod.roles.length > 0 && (
                    <div className={styles.rolesSection}>
                      <h3 className={styles.sectionLabel}>
                        <Layers size={16} />
                        <span>Roles Needed</span>
                      </h3>
                      <div className={styles.rolesList}>
                        {currentPod.roles.map((role, index) => (
                          <motion.span 
                            key={index}
                            className={styles.roleTag}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                          >
                            {role}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {currentPod.skills && currentPod.skills.length > 0 && (
                    <div className={styles.skillsSection}>
                      <h3 className={styles.sectionLabel}>
                        <Zap size={16} />
                        <span>Skills</span>
                      </h3>
                      <div className={styles.skillsList}>
                        {currentPod.skills.map((skill, index) => (
                          <motion.span 
                            key={index}
                            className={styles.skillTag}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                          >
                            {skill}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className={styles.podFooter}>
                  <Link to={`/pods/${currentPod.id}`} className={styles.viewDetailsButton}>
                    <Eye size={18} />
                    <span>View Details</span>
                  </Link>
                  
                  <Link to={`/pods/${currentPod.id}?apply=true`} className={styles.applyButton}>
                    <Zap size={18} />
                    <span>Apply Now</span>
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* View All Button */}
        <motion.div 
          className={styles.viewAllContainer}
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <Link to="/explore" className={styles.viewAllButton}>
            <span>Explore All Pods</span>
            <ChevronRight size={20} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedPodsSection;