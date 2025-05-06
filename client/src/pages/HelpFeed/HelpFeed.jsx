import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, AnimatePresence, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Users, 
  Star, 
  Target, 
  Zap, 
  Clock, 
  ArrowRight, 
  Layers, 
  SlidersHorizontal,
  UserPlus,
  Award,
  Briefcase,
  Code,
  Paintbrush,
  PenTool,
  AlertCircle,
  RefreshCw,
  Filter,
  Sparkles,
  BarChart3,
  CheckCircle,
  Heart,
  MessageSquare,
  TrendingUp,
  Activity,
  User,
  Search,
  Bell,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Eye,
  DollarSign,
  Video,
  Plus,
  X
} from 'lucide-react';
import styles from './HelpFeed.module.scss';

const HelpFeed = () => {
  const [pods, setPods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userSkills, setUserSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [searchQuery, setSearchQuery] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const [hoverPod, setHoverPod] = useState(null);
  const [showSkillsModal, setShowSkillsModal] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  
  const sectionRef = useRef(null);
  const filterRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, threshold: 0.2 });
  const controls = useAnimation();

  // Enhanced animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.175, 0.885, 0.32, 1.075]
      }
    }
  };

  // Enhanced card variants with hover effects
  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 30,
      scale: 0.95
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.175, 0.885, 0.32, 1.075]
      }
    },
    hover: {
      y: -10,
      scale: 1.03,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  // Enhanced mock skills with icons
  const skillsData = [
    { name: 'React', icon: <Code size={16} />, category: 'development' },
    { name: 'UI Design', icon: <Paintbrush size={16} />, category: 'design' },
    { name: 'Marketing', icon: <TrendingUp size={16} />, category: 'marketing' },
    { name: 'Backend Development', icon: <Code size={16} />, category: 'development' },
    { name: 'UX Research', icon: <Users size={16} />, category: 'design' },
    { name: 'Content Writing', icon: <PenTool size={16} />, category: 'content' },
    { name: 'Data Analysis', icon: <BarChart3 size={16} />, category: 'analysis' },
    { name: 'Product Management', icon: <Target size={16} />, category: 'management' },
    { name: 'Branding', icon: <Star size={16} />, category: 'design' },
    { name: 'Video Production', icon: <Video size={16} />, category: 'content' }
  ];

  // Enhanced filter options
  const filterOptions = {
    timeframe: ['Today', 'This Week', 'This Month'],
    status: ['Open', 'In Progress', 'Pre-Launch'],
    size: ['Small (1-3)', 'Medium (4-7)', 'Large (8+)'],
    commitment: ['Full-time', 'Part-time', 'Flexible']
  };

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const isLoggedIn = localStorage.getItem('token') !== null;

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) - 0.5,
        y: (e.clientY / window.innerHeight) - 0.5
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Animation control
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  // Fetch pods with enhanced mock data
  useEffect(() => {
    setUserSkills(skillsData);
    
    const fetchPods = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get('http://localhost:5000/api/pods');
        
        // Enhanced pod data with more realistic properties
        const enhancedPods = res.data.map(pod => {
          const urgencyLevels = ['high', 'medium', 'low'];
          const statusOptions = ['Open', 'In Progress', 'Pre-Launch'];
          const sizeOptions = { small: '1-3', medium: '4-7', large: '8+' };
          
          const roles = [
            'UI Designer', 'React Developer', 'Content Writer', 
            'Marketing Specialist', 'Backend Developer', 'UX Researcher',
            'Product Manager', 'Data Analyst', 'Brand Strategist'
          ];
          
          const selectedRoles = roles
            .sort(() => 0.5 - Math.random())
            .slice(0, 2 + Math.floor(Math.random() * 3));
          
          return {
            ...pod,
            urgency: urgencyLevels[Math.floor(Math.random() * urgencyLevels.length)],
            rolesNeeded: selectedRoles,
            matchScore: Math.floor(Math.random() * 30) + 70,
            status: statusOptions[Math.floor(Math.random() * statusOptions.length)],
            members: Math.floor(Math.random() * 8) + 1,
            deadline: generateRandomDeadline(),
            recentActivity: generateRecentActivity(),
            skills: generateSkillTags(),
            commitment: filterOptions.commitment[Math.floor(Math.random() * filterOptions.commitment.length)],
            budget: Math.floor(Math.random() * 100) * 1000,
            featured: Math.random() > 0.8,
            progress: Math.floor(Math.random() * 70) + 10
          };
        });
        
        setPods(enhancedPods);
        setError(null);
        setAnimationComplete(true);
      } catch (err) {
        console.error(err.response?.data?.message || err.message);
        setError('Failed to load help feed. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPods();
  }, []);

  // Helper functions for mock data
  const generateRandomDeadline = () => {
    const days = Math.floor(Math.random() * 30) + 1;
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString();
  };

  const generateRecentActivity = () => {
    const activities = [
      'New member joined',
      'Task completed',
      'Design uploaded',
      'Meeting scheduled',
      'Code pushed to repo',
      'Requirements updated'
    ];
    return activities[Math.floor(Math.random() * activities.length)];
  };

  const generateSkillTags = () => {
    const tags = ['React', 'Node.js', 'UI/UX', 'Marketing', 'Content', 'Data Analysis'];
    return tags.sort(() => 0.5 - Math.random()).slice(0, 3);
  };

  // Enhanced filtering with search and advanced filters
  const filteredPods = pods.filter(pod => {
    const matchesSkill = selectedSkill === 'all' || 
      (pod.rolesNeeded && pod.rolesNeeded.some(role => 
        role.toLowerCase().includes(selectedSkill.toLowerCase())
      ));
    
    const matchesUrgency = urgencyFilter === 'all' || pod.urgency === urgencyFilter;
    
    const matchesSearch = searchQuery === '' || 
      pod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pod.rolesNeeded.some(role => role.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesAdvancedFilters = activeFilters.every(filter => {
      if (filter.type === 'status') return pod.status === filter.value;
      if (filter.type === 'commitment') return pod.commitment === filter.value;
      return true;
    });
    
    return matchesSkill && matchesUrgency && matchesSearch && matchesAdvancedFilters;
  });

  // Enhanced sorting with multiple criteria
  const sortedPods = [...filteredPods].sort((a, b) => {
    const urgencyOrder = { high: 3, medium: 2, low: 1 };
    
    // Featured pods first
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    
    // Then by urgency
    if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
      return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
    }
    
    // Then by match score
    return b.matchScore - a.matchScore;
  });

  // Toggle advanced filter
  const handleFilterToggle = (type, value) => {
    setActiveFilters(prev => {
      const exists = prev.find(f => f.type === type && f.value === value);
      if (exists) {
        return prev.filter(f => !(f.type === type && f.value === value));
      }
      return [...prev, { type, value }];
    });
  };

// Replace the existing stats section with this markup
const StatsSection = () => {
  const statsData = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      ),
      value: "17",
      label: "Active Opportunities"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
      value: "2,500+",
      label: "Community Members"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
          <polyline points="17 6 23 6 23 12"></polyline>
        </svg>
      ),
      value: "89%",
      label: "Success Rate"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="7"></circle>
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
        </svg>
      ),
      value: "$10k+",
      label: "Avg. Project Value"
    }
  ];

  return (
    <motion.div 
      className={styles.quickStats}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
    >
      {statsData.map((stat, index) => (
        <motion.div 
          key={index}
          className={styles.statItem}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 + (index * 0.1) }}
          whileHover={{ y: -5 }}
        >
          <div className={styles.statIcon}>
            {stat.icon}
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{stat.value}</span>
            <span className={styles.statLabel}>{stat.label}</span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

  // Format deadline for display
  const formatDeadline = (date) => {
    const deadline = new Date(date);
    const now = new Date();
    const diff = deadline - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days < 1) return 'Today';
    if (days === 1) return '1 day left';
    if (days < 7) return `${days} days left`;
    if (days < 30) return `${Math.floor(days / 7)} weeks left`;
    return `${Math.floor(days / 30)} months left`;
  };

  // Render skill match indicator
  const renderSkillMatch = (pod) => {
    const matchingSkills = pod.skills.filter(skill => 
      userSkills.some(userSkill => userSkill.name.toLowerCase() === skill.toLowerCase())
    );
    
    if (matchingSkills.length === 0) return null;
    
    return (
      <div className={styles.skillMatchIndicator}>
        <CheckCircle size={14} />
        <span>{matchingSkills.length} skill match{matchingSkills.length > 1 ? 'es' : ''}</span>
      </div>
    );
  };

  return (
    <div className={styles.helpFeedPage} ref={sectionRef}>
      {/* Enhanced animated background */}
      <motion.div 
        className={styles.gridBackground}
        style={{
          transform: `translate(${mousePosition.x * 15}px, ${mousePosition.y * 15}px)`,
        }}
      />
      
      {/* Floating elements */}
      <motion.div
        className={`${styles.floatingShape} ${styles.shape1}`}
        animate={{
          x: [0, 20, 0],
          y: [0, -20, 0],
          rotate: [0, 8, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className={`${styles.floatingShape} ${styles.shape2}`}
        animate={{
          x: [0, -15, 0],
          y: [0, 15, 0],
          rotate: [0, -8, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Hero Section */}
      <motion.div 
        className={styles.heroSection}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className={styles.container}>
          <motion.div 
            className={styles.heroContent}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className={styles.badgeWrapper}>
              <span className={styles.badge}>
                <Sparkles size={14} />
                Help Feed
              </span>
            </div>
            
            <h1 className={styles.mainTitle}>
              Find Your Perfect <span className={styles.highlight}>Pod Match</span>
            </h1>
            
            <p className={styles.subtitle}>
              Discover pods that need your expertise. Join urgent projects, contribute your skills, and earn reputation in our collaborative ecosystem.
            </p>
            
            {!isLoggedIn && (
              <motion.div 
                className={styles.loginPrompt}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className={styles.promptIcon}>
                  <UserPlus size={24} />
                </div>
                <div className={styles.promptContent}>
                  <h3>Unlock Personalized Matches</h3>
                  <p>Sign in to see pods tailored to your skills and interests</p>
                </div>
                <Link to="/login" className={styles.loginButton}>
                  Sign In
                  <ArrowRight size={16} />
                </Link>
              </motion.div>
            )}

            {/* Quick stats */}
            <motion.div 
              className={styles.quickStats}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              {[
                { icon: <Target size={24} />, value: pods.length, label: 'Active Opportunities', color: '#E8C547', glow: true },
                { icon: <Users size={24} />, value: '2,500+', label: 'Community Members', color: '#3B82F6', glow: true },
                { icon: <TrendingUp size={24} />, value: '89%', label: 'Success Rate', color: '#10B981', glow: true },
                { icon: <Award size={24} />, value: '$10k+', label: 'Avg. Project Value', color: '#EC4899', glow: true }
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  className={styles.statItem}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: `0 10px 40px ${stat.color}40`
                  }}
                  style={{
                    '--stat-color': stat.color
                  }}
                >
                  <div className={styles.statIconWrapper}>
                    <div className={styles.statIcon} style={{ backgroundColor: `${stat.color}20` }}>
                      {React.cloneElement(stat.icon, { color: stat.color })}
                    </div>
                    <div className={styles.statGlow} style={{ backgroundColor: stat.color }} />
                  </div>
                  <div className={styles.statContent}>
                    <motion.h4 
                      style={{ color: stat.color }}
                      animate={{ 
                        scale: [1, 1.02, 1],
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      {stat.value}
                    </motion.h4>
                    <p>{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Enhanced Filter Section */}
      <motion.div 
        className={styles.filterSection}
        ref={filterRef}
        initial={{ opacity: 0, y: 30 }}
        animate={controls}
        variants={container}
      >
        <div className={styles.container}>
          {/* Search and View Toggle */}
          <div className={styles.searchBar}>
            <div className={styles.searchInputWrapper}>
              <Search size={20} />
              <input
                type="text"
                placeholder="Search pods, skills, or roles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
              {searchQuery && (
                <button 
                  className={styles.clearSearch}
                  onClick={() => setSearchQuery('')}
                >
                  <X size={16} />
                </button>
              )}
            </div>
            
            <div className={styles.viewToggle}>
              <button
                className={`${styles.viewButton} ${viewMode === 'grid' ? styles.active : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <Layers size={16} />
                Grid
              </button>
              <button
                className={`${styles.viewButton} ${viewMode === 'list' ? styles.active : ''}`}
                onClick={() => setViewMode('list')}
              >
                <SlidersHorizontal size={16} />
                List
              </button>
            </div>
          </div>

          {/* Enhanced Skill Pills */}
          <div className={styles.mainFilters}>
            <div className={styles.filterGroup}>
              <h3>Skills</h3>
              <div className={styles.skillPills}>
                <motion.button 
                  className={`${styles.pillButton} ${selectedSkill === 'all' ? styles.active : ''}`}
                  onClick={() => setSelectedSkill('all')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Sparkles size={14} />
                  All Skills
                </motion.button>
                
                {userSkills.map((skill, index) => (
                  <motion.button 
                    key={index}
                    className={`${styles.pillButton} ${selectedSkill === skill.name ? styles.active : ''}`}
                    onClick={() => setSelectedSkill(skill.name)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {skill.icon}
                    {skill.name}
                  </motion.button>
                ))}
                
                <motion.button 
                  className={styles.addSkillButton}
                  onClick={() => setShowSkillsModal(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus size={14} />
                  Add Skills
                </motion.button>
              </div>
            </div>
            
            {/* Urgency Filter with Icons */}
            <div className={styles.filterGroup}>
              <h3>Urgency</h3>
              <div className={styles.urgencyButtons}>
                {[
                  { value: 'all', label: 'All', icon: <Filter size={14} /> },
                  { value: 'high', label: 'High', icon: <AlertCircle size={14} /> },
                  { value: 'medium', label: 'Medium', icon: <Clock size={14} /> },
                  { value: 'low', label: 'Low', icon: <CheckCircle size={14} /> }
                ].map((urgency) => (
                  <motion.button 
                    key={urgency.value}
                    className={`${styles.urgencyButton} ${urgencyFilter === urgency.value ? styles.active : ''} ${urgency.value !== 'all' ? styles[urgency.value] : ''}`}
                    onClick={() => setUrgencyFilter(urgency.value)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {urgency.icon}
                    {urgency.label}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          <motion.div 
            className={styles.advancedFilters}
            animate={{ height: showAdvancedFilters ? 'auto' : 0 }}
            initial={{ height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AnimatePresence>
              {showAdvancedFilters && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={styles.filtersContent}
                >
                  {Object.entries(filterOptions).map(([key, values]) => (
                    <div key={key} className={styles.filterCategory}>
                      <h4>{key.charAt(0).toUpperCase() + key.slice(1)}</h4>
                      <div className={styles.filterChips}>
                        {values.map((value) => (
                          <motion.button
                            key={value}
                            className={`${styles.chip} ${activeFilters.some(f => f.type === key && f.value === value) ? styles.active : ''}`}
                            onClick={() => handleFilterToggle(key, value)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {value}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <button
            className={styles.advancedFilterToggle}
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            <SlidersHorizontal size={16} />
            Advanced Filters
            {showAdvancedFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {/* Active filters display */}
          {activeFilters.length > 0 && (
            <div className={styles.activeFilters}>
              <span>Active Filters:</span>
              {activeFilters.map((filter, index) => (
                <motion.span 
                  key={index}
                  className={styles.activeFilter}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                >
                  {filter.value}
                  <button onClick={() => handleFilterToggle(filter.type, filter.value)}>×</button>
                </motion.span>
              ))}
              <button 
                className={styles.clearAll}
                onClick={() => setActiveFilters([])}
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      </motion.div>
      
      {/* Content Section */}
      <div className={styles.contentSection}>
        <div className={styles.container}>
          {isLoading ? (
            <motion.div 
              className={styles.loadingState}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className={styles.loadingAnimation}>
                <motion.div 
                  className={styles.loadingCircle}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
                <motion.div 
                  className={styles.loadingCircle}
                  animate={{ rotate: -360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </div>
              <p>Finding your perfect pod matches...</p>
            </motion.div>
          ) : error ? (
            <motion.div 
              className={styles.errorState}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className={styles.errorIcon}>
                <AlertCircle size={48} />
              </div>
              <h3>Something went wrong</h3>
              <p>{error}</p>
              <motion.button 
                className={styles.retryButton}
                onClick={() => window.location.reload()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw size={16} />
                Try Again
              </motion.button>
            </motion.div>
          ) : sortedPods.length === 0 ? (
            <motion.div 
              className={styles.emptyState}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className={styles.emptyIcon}>
                <Layers size={64} />
              </div>
              <h3>No pods match your criteria</h3>
              <p>Try adjusting your filters or check back later for new opportunities</p>
              <motion.button 
                className={styles.resetButton}
                onClick={() => {
                  setSelectedSkill('all');
                  setUrgencyFilter('all');
                  setSearchQuery('');
                  setActiveFilters([]);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Reset All Filters
              </motion.button>
            </motion.div>
          ) : (
            <>
              <div className={styles.resultsHeader}>
                <h3>
                  <span>{sortedPods.length}</span> pods match your criteria
                </h3>
                <div className={styles.sortOptions}>
                  <select>
                    <option value="relevance">Sort by Relevance</option>
                    <option value="urgency">Sort by Urgency</option>
                    <option value="newest">Sort by Newest</option>
                    <option value="deadline">Sort by Deadline</option>
                  </select>
                </div>
              </div>

              <motion.div 
                className={`${styles.podsContainer} ${viewMode === 'list' ? styles.listView : ''}`}
                variants={container}
                initial="hidden"
                animate="visible"
              >
                {sortedPods.map((pod) => (
                  <motion.div 
                    key={pod._id}
                    className={`${styles.podCard} ${pod.featured ? styles.featured : ''}`}
                    variants={cardVariants}
                    whileHover="hover"
                    onHoverStart={() => setHoverPod(pod._id)}
                    onHoverEnd={() => setHoverPod(null)}
                    style={{
                      '--pod-color': pod.urgency === 'high' ? '#FF4D4D' : 
                                    pod.urgency === 'medium' ? '#FBBF24' : '#34D399'
                    }}
                  >
                    {pod.featured && (
                      <div className={styles.featuredBadge}>
                        <Star size={14} />
                        Featured
                      </div>
                    )}

                    <div className={styles.cardHeader}>
                      <div className={styles.headerLeft}>
                        <div className={`${styles.urgencyIndicator} ${styles[pod.urgency]}`}>
                          <motion.span 
                            className={styles.urgencyDot}
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                          {pod.urgency.charAt(0).toUpperCase() + pod.urgency.slice(1)} Priority
                        </div>
                        {renderSkillMatch(pod)}
                      </div>
                      
                      {isLoggedIn && (
                        <div className={styles.matchBadge}>
                          <Target size={16} />
                          <span>{pod.matchScore}% Match</span>
                        </div>
                      )}
                    </div>
                    
                    <div className={styles.podContent}>
                      <h3 className={styles.podTitle}>{pod.title}</h3>
                      
                      <div className={styles.podMeta}>
                        <div className={styles.metaItem}>
                          <User size={14} />
                          <span>{pod.creator?.name || 'Anonymous'}</span>
                        </div>
                        <div className={styles.metaItem}>
                          <Users size={14} />
                          <span>{pod.members} members</span>
                        </div>
                        <div className={styles.metaItem}>
                          <Clock size={14} />
                          <span>{formatDeadline(pod.deadline)}</span>
                        </div>
                      </div>

                      {pod.description && (
                        <p className={styles.description}>
                          {pod.description.slice(0, 120)}...
                        </p>
                      )}

                      <div className={styles.rolesSection}>
                        <h4>
                          <Briefcase size={14} />
                          Roles Needed
                        </h4>
                        <div className={styles.rolesTags}>
                          {pod.rolesNeeded?.map((role, index) => (
                            <motion.span 
                              key={index} 
                              className={`${styles.roleTag} ${userSkills.some(skill => role.toLowerCase().includes(skill.name.toLowerCase())) ? styles.matched : ''}`}
                              whileHover={{ scale: 1.05 }}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              {role}
                            </motion.span>
                          ))}
                        </div>
                      </div>

                      <div className={styles.extraInfo}>
                        <div className={styles.infoItem}>
                          <Activity size={14} />
                          <span>{pod.recentActivity}</span>
                        </div>
                        <div className={styles.infoItem}>
                          <BarChart3 size={14} />
                          <span>{pod.commitment}</span>
                        </div>
                        {pod.budget && (
                          <div className={styles.infoItem}>
                            <DollarSign size={14} />
                            <span>${(pod.budget / 1000).toFixed(0)}k Budget</span>
                          </div>
                        )}
                      </div>

                      {/* Progress Indicator */}
                      <div className={styles.progressSection}>
                        <div className={styles.progressHeader}>
                          <span>Project Progress</span>
                          <span>{pod.progress}%</span>
                        </div>
                        <div className={styles.progressBar}>
                          <motion.div 
                            className={styles.progressFill}
                            initial={{ width: 0 }}
                            animate={{ width: `${pod.progress}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles.cardFooter}>
                      <Link to={`/pods/${pod._id}`} className={styles.viewButton}>
                        <Eye size={16} />
                        View Details
                      </Link>
                      <motion.button 
                        className={styles.applyButton}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Zap size={16} />
                        Apply Now
                        <ArrowRight size={16} />
                      </motion.button>
                    </div>

                    {/* Hover Effect Overlay */}
                    <motion.div 
                      className={styles.hoverOverlay}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoverPod === pod._id ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className={styles.overlayContent}>
                        <h4>Quick Actions</h4>
                        <div className={styles.quickActions}>
                          <button>
                            <Heart size={16} />
                            Save Pod
                          </button>
                          <button>
                            <MessageSquare size={16} />
                            Message Creator
                          </button>
                          <button>
                            <Bell size={16} />
                            Set Alert
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Load More Section */}
              <motion.div 
                className={styles.loadMoreSection}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <button className={styles.loadMoreButton}>
                  Load More Pods
                  <ChevronDown size={16} />
                </button>
              </motion.div>
            </>
          )}
        </div>
      </div>

      {/* Newsletter/CTA Section */}
      <motion.div 
        className={styles.ctaSection}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <div className={styles.ctaText}>
              <h2>Get Instant Alerts for Pod Matches</h2>
              <p>Be the first to know when pods matching your skills are posted</p>
            </div>
            <div className={styles.ctaActions}>
              <button className={styles.primaryCta}>
                <Bell size={18} />
                Enable Notifications
              </button>
              <button className={styles.secondaryCta}>
                Set Preferences
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Skills Modal */}
      <AnimatePresence>
        {showSkillsModal && (
          <motion.div 
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSkillsModal(false)}
          >
            <motion.div 
              className={styles.modalContent}
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              onClick={e => e.stopPropagation()}
            >
              <h3>Add Your Skills</h3>
              <p>Select skills to improve your pod matches</p>
              
              <div className={styles.skillCategories}>
                {Object.entries(
                  skillsData.reduce((acc, skill) => {
                    if (!acc[skill.category]) acc[skill.category] = [];
                    acc[skill.category].push(skill);
                    return acc;
                  }, {})
                ).map(([category, skills]) => (
                  <div key={category} className={styles.skillCategory}>
                    <h4>{category.charAt(0).toUpperCase() + category.slice(1)}</h4>
                    <div className={styles.skillList}>
                      {skills.map((skill, index) => (
                        <label key={index} className={styles.skillCheckbox}>
                          <input 
                            type="checkbox" 
                            checked={userSkills.includes(skill)}
                            onChange={() => {
                              // Handle skill toggle
                            }}
                          />
                          <span className={styles.checkboxLabel}>
                            {skill.icon}
                            {skill.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className={styles.modalActions}>
                <button 
                  className={styles.cancelButton}
                  onClick={() => setShowSkillsModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className={styles.saveButton}
                  onClick={() => setShowSkillsModal(false)}
                >
                  Save Skills
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HelpFeed;