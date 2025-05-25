import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useAnimation, useInView } from 'framer-motion';
import { 
  Users, 
  Star, 
  Target, 
  Zap, 
  Clock, 
  ArrowRight, 
  Search,
  Filter,
  Briefcase,
  Code,
  Paintbrush,
  PenTool,
  AlertCircle,
  RefreshCw,
  Sparkles,
  BarChart3,
  CheckCircle,
  MessageSquare,
  TrendingUp,
  Activity,
  User,
  Shield,
  Award,
  Globe,
  Github,
  Twitter,
  Linkedin,
  ChevronDown,
  ChevronUp, 
  SlidersHorizontal,
  Layers,
  X,
  Edit,
  Plus,
  Heart,
  MapPin,
  ChevronLeft,  // ADD THIS
  ChevronRight, // ADD THIS
  Calendar
} from 'lucide-react';
import axios from 'axios';
import styles from './ProfileDiscoveryFeed.module.scss';

const ProfileDiscoveryFeed = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const [hoverProfile, setHoverProfile] = useState(null);
  const [showSkillsModal, setShowSkillsModal] = useState(false);
  const [sortBy, setSortBy] = useState('reputation');
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [allLoadedProfiles, setAllLoadedProfiles] = useState([]);
  const [pagination, setPagination] = useState({
  page: 1,
  totalPages: 1,
  total: 0
});
  
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

  // Enhanced skills data with better categorization
  const skillsData = [
    { name: 'React', icon: <Code size={16} />, category: 'development' },
    { name: 'Vue.js', icon: <Code size={16} />, category: 'development' },
    { name: 'Node.js', icon: <Code size={16} />, category: 'development' },
    { name: 'Python', icon: <Code size={16} />, category: 'development' },
    { name: 'UI Design', icon: <Paintbrush size={16} />, category: 'design' },
    { name: 'UX Research', icon: <Users size={16} />, category: 'design' },
    { name: 'Figma', icon: <Paintbrush size={16} />, category: 'design' },
    { name: 'Photoshop', icon: <Paintbrush size={16} />, category: 'design' },
    { name: 'Digital Marketing', icon: <TrendingUp size={16} />, category: 'marketing' },
    { name: 'SEO', icon: <TrendingUp size={16} />, category: 'marketing' },
    { name: 'Content Strategy', icon: <PenTool size={16} />, category: 'marketing' },
    { name: 'Social Media', icon: <MessageSquare size={16} />, category: 'marketing' },
    { name: 'Backend Development', icon: <Code size={16} />, category: 'development' },
    { name: 'DevOps', icon: <Code size={16} />, category: 'development' },
    { name: 'Content Writing', icon: <PenTool size={16} />, category: 'content' },
    { name: 'Copywriting', icon: <PenTool size={16} />, category: 'content' },
    { name: 'Video Editing', icon: <Activity size={16} />, category: 'content' },
    { name: 'Photography', icon: <Activity size={16} />, category: 'content' },
    { name: 'Data Analysis', icon: <BarChart3 size={16} />, category: 'analysis' },
    { name: 'Business Intelligence', icon: <BarChart3 size={16} />, category: 'analysis' },
    { name: 'Product Management', icon: <Target size={16} />, category: 'management' },
    { name: 'Project Management', icon: <Target size={16} />, category: 'management' },
    { name: 'Branding', icon: <Star size={16} />, category: 'design' },
    { name: 'Illustration', icon: <Paintbrush size={16} />, category: 'design' }
  ];

  // Enhanced filter options
  const filterOptions = {
    role: ['Creator', 'Contributor', 'Both'],
    tier: ['Bronze', 'Silver', 'Gold', 'Platinum'],
    experience: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    activity: ['Active Today', 'Active This Week', 'Active This Month']
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

  // Pagination range helper
const getPaginationRange = (currentPage, totalPages) => {
  const range = [];
  const showPages = 5; // Show 5 page numbers at a time
  
  if (totalPages <= showPages) {
    for (let i = 1; i <= totalPages; i++) {
      range.push(i);
    }
  } else {
    if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) range.push(i);
      range.push('...');
      range.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      range.push(1);
      range.push('...');
      for (let i = totalPages - 3; i <= totalPages; i++) range.push(i);
    } else {
      range.push(1);
      range.push('...');
      for (let i = currentPage - 1; i <= currentPage + 1; i++) range.push(i);
      range.push('...');
      range.push(totalPages);
    }
  }
  
  return range;
};

  // Enhanced fetch profiles with better error handling and pagination
  const fetchProfiles = useCallback(async (page = 1, append = false) => {
  setIsLoading(true);
  try {
    // Build query parameters based on filters
    let queryParams = new URLSearchParams();
    
    if (searchQuery) queryParams.append('search', searchQuery);
    if (roleFilter !== 'all') queryParams.append('role', roleFilter);
    if (tierFilter !== 'all') queryParams.append('tier', tierFilter);
    if (selectedSkill !== 'all') queryParams.append('skill', selectedSkill);
    if (sortBy) queryParams.append('sortBy', sortBy);
    queryParams.append('page', page.toString());
queryParams.append('limit', itemsPerPage.toString());
    
    // Add active filters
    activeFilters.forEach(filter => {
      queryParams.append(filter.type, filter.value);
    });

    const url = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/profile/discover?${queryParams.toString()}`;
    const token = localStorage.getItem('token');
    
    const config = token ? {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 10000
    } : { timeout: 10000 };
    
    const response = await axios.get(url, config);
    
    console.log('Profiles fetched:', response.data);

    let profilesData;
    let paginationData = { page: 1, totalPages: 1, total: 0 };
    
    if (response.data.profiles) {
      profilesData = response.data.profiles;
      paginationData = {
        page: response.data.page || 1,
        totalPages: response.data.totalPages || 1,
        total: response.data.total || profilesData.length
      };
    } else if (Array.isArray(response.data)) {
      profilesData = response.data;
    } else {
      throw new Error('Unexpected response format');
    }

    const validProfiles = profilesData.filter(profile => {
      const profileData = profile.profile || profile;
      const userData = profileData.user || {};
      return userData._id && (profileData.displayName || userData.name);
    });

    if (append) {
      setProfiles(prev => [...prev, ...validProfiles]);
      setAllLoadedProfiles(prev => [...prev, ...validProfiles]);
    } else {
      setProfiles(validProfiles);
      setAllLoadedProfiles(validProfiles);
    }
    
    setPagination(paginationData);
    setError(null);
  } catch (err) {
    console.error('Error fetching profiles:', err);
    let errorMessage = 'Failed to load profiles. Please try again later.';
    
    if (err.response?.status === 404) {
      errorMessage = 'No profiles found matching your criteria.';
    } else if (err.response?.status === 500) {
      errorMessage = 'Server error. Please try again in a moment.';
    } else if (err.code === 'ECONNABORTED') {
      errorMessage = 'Request timed out. Please check your connection.';
    }
    
    setError(errorMessage);
  } finally {
    setIsLoading(false);
  }
}, [searchQuery, roleFilter, tierFilter, selectedSkill, sortBy, activeFilters]);

  // Fetch profiles effect
  useEffect(() => {
    fetchProfiles(1);
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [fetchProfiles]);

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

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedSkill('all');
    setRoleFilter('all');
    setTierFilter('all');
    setSearchQuery('');
    setActiveFilters([]);
    setSortBy('reputation');
  };

  // Get user initials for avatar
  const getUserInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Format tier for display
  const formatTier = (tier) => {
    if (!tier) return 'Bronze';
    return tier.charAt(0).toUpperCase() + tier.slice(1);
  };

  // Enhanced message user handler
  const handleMessageUser = useCallback((userId) => {
    if (!isLoggedIn) {
      navigate('/login', { state: { returnTo: `/profile/${userId}` } });
      return;
    }
    navigate(`/messages/new?recipient=${userId}`);
  }, [isLoggedIn, navigate]);

  // Load more profiles
const loadMoreProfiles = () => {
  if (pagination.page < pagination.totalPages) {
    fetchProfiles(pagination.page + 1, true);
  }
};

const showPreviousProfiles = () => {
  const itemsPerPage = 12;
  const currentLength = profiles.length;
  const newLength = Math.max(itemsPerPage, currentLength - itemsPerPage);
  
  setProfiles(allLoadedProfiles.slice(0, newLength));
  setPagination(prev => ({
    ...prev,
    page: Math.ceil(newLength / itemsPerPage)
  }));
};

  return (
    <div className={styles.profileDiscoveryFeed} ref={sectionRef}>
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
                Talent Discovery
              </span>
            </div>
            
            <h1 className={styles.mainTitle}>
              Discover <span className={styles.highlight}>Exceptional Talent</span>
            </h1>
            
            <p className={styles.subtitle}>
              Connect with skilled creators and contributors. Find the perfect match for your projects or showcase your expertise to the community.
            </p>
            
            {!isLoggedIn && (
              <motion.div 
                className={styles.loginPrompt}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className={styles.promptIcon}>
                  <User size={24} />
                </div>
                <div className={styles.promptContent}>
                  <h3>Unlock Personalized Matches</h3>
                  <p>Sign in to see profiles tailored to your preferences and projects</p>
                </div>
                <button 
                  onClick={() => navigate('/login')} 
                  className={styles.loginButton}
                >
                  Sign In
                  <ArrowRight size={16} />
                </button>
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
                { icon: <Users size={24} />, value: `${pagination.total || '2,500'}+`, label: 'Community Members', color: '#3B82F6' },
                { icon: <Award size={24} />, value: '89%', label: 'Success Rate', color: '#10B981' },
                { icon: <Briefcase size={24} />, value: '350+', label: 'Active Projects', color: '#E8C547' },
                { icon: <Star size={24} />, value: '4.8/5', label: 'Avg. Rating', color: '#EC4899' }
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
                placeholder="Search by name, skills, or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
              {searchQuery && (
                <button 
                  className={styles.clearSearch}
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            
            <div className={styles.viewToggle}>
              <button
                className={`${styles.viewButton} ${viewMode === 'grid' ? styles.active : ''}`}
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
              >
                <Layers size={16} />
                Grid
              </button>
              <button
                className={`${styles.viewButton} ${viewMode === 'list' ? styles.active : ''}`}
                onClick={() => setViewMode('list')}
                aria-label="List view"
              >
                <SlidersHorizontal size={16} />
                List
              </button>
            </div>
          </div>

          {/* Main Filters */}
          <div className={styles.mainFilters}>
            {/* Role Filter */}
            <div className={styles.filterGroup}>
              <h3>Role</h3>
              <div className={styles.rolePills}>
                {[
                  { value: 'all', label: 'All Roles', icon: <Users size={14} /> },
                  { value: 'creator', label: 'Creators', icon: <Target size={14} /> },
                  { value: 'contributor', label: 'Contributors', icon: <Code size={14} /> }
                ].map((role) => (
                  <motion.button 
                    key={role.value}
                    className={`${styles.pillButton} ${roleFilter === role.value ? styles.active : ''}`}
                    onClick={() => setRoleFilter(role.value)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {role.icon}
                    {role.label}
                  </motion.button>
                ))}
              </div>
            </div>
            
            {/* Skills Filter */}
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
                
                {skillsData.slice(0, 5).map((skill, index) => (
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
                  More Skills
                </motion.button>
              </div>
            </div>
            
            {/* Experience Tier Filter */}
            <div className={styles.filterGroup}>
              <h3>Experience Tier</h3>
              <div className={styles.tierButtons}>
                {[
                  { value: 'all', label: 'All Tiers', icon: <Filter size={14} /> },
                  { value: 'bronze', label: 'Bronze', icon: <Shield size={14} /> },
                  { value: 'silver', label: 'Silver', icon: <Shield size={14} /> },
                  { value: 'gold', label: 'Gold', icon: <Shield size={14} /> },
                  { value: 'platinum', label: 'Platinum', icon: <Shield size={14} /> }
                ].map((tier) => (
                  <motion.button 
                    key={tier.value}
                    className={`${styles.tierButton} ${tierFilter === tier.value ? styles.active : ''} ${tier.value !== 'all' ? styles[tier.value] : ''}`}
                    onClick={() => setTierFilter(tier.value)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {tier.icon}
                    {tier.label}
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
                onClick={clearAllFilters}
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
              <p>Discovering talent in the community...</p>
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
                onClick={() => fetchProfiles(1)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw size={16} />
                Try Again
              </motion.button>
            </motion.div>
          ) : profiles.length === 0 ? (
            <motion.div 
              className={styles.emptyState}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className={styles.emptyIcon}>
                <Users size={64} />
              </div>
              <h3>No profiles match your criteria</h3>
              <p>Try adjusting your filters or check back later for new talent</p>
              <motion.button 
                className={styles.resetButton}
                onClick={clearAllFilters}
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
                  <span>{profiles.length}</span> of <span>{pagination.total}</span> talents match your criteria
                </h3>
                <div className={styles.sortOptions}>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="reputation">Sort by Reputation</option>
                    <option value="experience">Sort by Experience</option>
                    <option value="activity">Sort by Recent Activity</option>
                    <option value="skills">Sort by Skill Match</option>
                  </select>
                </div>
              </div>

              <motion.div 
                className={`${styles.profilesContainer} ${viewMode === 'list' ? styles.listView : ''}`}
                variants={container}
                initial="hidden"
                animate="visible"
              >
                {profiles.map((profile) => {
                  const profileData = profile.profile || profile;
                  const userData = profileData.user || {};
                  const displayName = profileData.displayName || userData.name || 'User';
                  const tier = formatTier(userData.tier || profileData.experience?.tier || 'bronze');
                  const skills = profileData.skills || [];
                  const userRole = userData.role || 'contributor';
                  const socialLinks = profileData.socialLinks || {};
                  
                  return (
                    <motion.div 
                      key={userData._id}
                      className={styles.profileCard}
                      variants={cardVariants}
                      whileHover="hover"
                      onHoverStart={() => setHoverProfile(userData._id)}
                      onHoverEnd={() => setHoverProfile(null)}
                      style={{
                        '--profile-color': tier === 'Gold' ? '#E8C547' : 
                                         tier === 'Silver' ? '#C0C0C0' : 
                                         tier === 'Platinum' ? '#E5E4E2' : '#CD7F32'
                      }}
                    >
                      <div className={styles.tierBadge} data-tier={tier.toLowerCase()}>
                        <Shield size={14} />
                        <span>{tier} Tier</span>
                      </div>

                      <div className={styles.profileHeader}>
                        <div className={styles.profileImageContainer}>
                          {profileData.profileImage ? (
                            <img 
                              src={profileData.profileImage} 
                              alt={displayName} 
                              className={styles.profileImage}
                              loading="lazy"
                            />
                          ) : (
                            <div className={styles.profileInitials}>
                              {getUserInitials(displayName)}
                            </div>
                          )}
                          {/* Online status indicator */}
                          <div className={styles.onlineStatus} title="Recently active" />
                        </div>
                        
                        <div className={styles.roleBadge} data-role={userRole.toLowerCase()}>
                          {userRole === 'creator' ? (
                            <Target size={14} />
                          ) : (
                            <Code size={14} />
                          )}
                          <span>{userRole.charAt(0).toUpperCase() + userRole.slice(1)}</span>
                        </div>
                      </div>
                      
                      <div className={styles.profileContent}>
                        <h3 className={styles.displayName}>{displayName}</h3>
                        
                        {profileData.headline && (
                          <p className={styles.headline}>{profileData.headline}</p>
                        )}

                        {/* Enhanced stats row with better data handling */}
                        <div className={styles.statsRow}>
                          <div className={styles.statItem}>
                            <Star size={16} />
                            <span>{userData.reputation || userData.totalXP || profileData.experience?.currentXP || 0} XP</span>
                          </div>
                          
                          <div className={styles.statItem}>
                            <Briefcase size={16} />
                            <span>{profileData.stats?.podsJoined || 0} Pods</span>
                          </div>
                          
                          <div className={styles.statItem}>
                            <CheckCircle size={16} />
                            <span>{profileData.stats?.tasksCompleted || 0} Tasks</span>
                          </div>
                        </div>

                        {/* Enhanced skills display */}
                        {skills.length > 0 && (
                          <div className={styles.skillsContainer}>
                            <h4>
                              <Zap size={14} />
                              Top Skills
                            </h4>
                            <div className={styles.skillsList}>
                              {skills.slice(0, 3).map((skill, index) => (
                                <div 
                                  key={index} 
                                  className={styles.skillItem}
                                  data-level={skill.level || 'intermediate'}
                                >
                                  <span className={styles.skillName}>{skill.name}</span>
                                  <span className={styles.skillLevel}>{skill.level}</span>
                                </div>
                              ))}
                              {skills.length > 3 && (
                                <div className={styles.moreSkills}>
                                  +{skills.length - 3} more
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Enhanced social links */}
                        {Object.keys(socialLinks).length > 0 && (
                          <div className={styles.socialLinks}>
                            {socialLinks.github && (
                              <a 
                                href={socialLinks.github} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className={styles.socialLink}
                                title="GitHub Profile"
                              >
                                <Github size={16} />
                              </a>
                            )}
                            
                            {socialLinks.linkedin && (
                              <a 
                                href={socialLinks.linkedin} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className={styles.socialLink}
                                title="LinkedIn Profile"
                              >
                                <Linkedin size={16} />
                              </a>
                            )}
                            
                            {socialLinks.twitter && (
                              <a 
                                href={socialLinks.twitter} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className={styles.socialLink}
                                title="Twitter Profile"
                              >
                                <Twitter size={16} />
                              </a>
                            )}
                            
                            {socialLinks.website && (
                              <a 
                                href={socialLinks.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className={styles.socialLink}
                                title="Personal Website"
                              >
                                <Globe size={16} />
                              </a>
                            )}
                          </div>
                        )}

                        {/* Location and activity indicators */}
                        <div className={styles.profileMeta}>
                          {profileData.location && (
                            <div className={styles.metaItem}>
                              <MapPin size={12} />
                              <span>{profileData.location}</span>
                            </div>
                          )}
                          <div className={styles.metaItem}>
                            <Calendar size={12} />
                            <span>Joined {new Date(userData.createdAt || Date.now()).getFullYear()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className={styles.profileActions}>
                        <button 
                          className={styles.viewProfileButton}
                          onClick={() => navigate(`/profile/${userData._id}`)}
                        >
                          View Profile
                        </button>
                        
                        <button 
                          className={styles.messageButton}
                          onClick={() => handleMessageUser(userData._id)}
                        >
                          <MessageSquare size={16} />
                          Message
                        </button>
                        
                        {/* Heart/Like button for logged in users */}
                        {isLoggedIn && (
                          <button 
                            className={styles.likeButton}
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle like/unlike logic here
                            }}
                            title="Add to favorites"
                          >
                            <Heart size={16} />
                          </button>
                        )}
                      </div>

                      {/* Enhanced hover effect overlay */}
                      <AnimatePresence>
                        {hoverProfile === userData._id && (
                          <motion.div 
                            className={styles.hoverOverlay}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className={styles.overlayContent}>
                              <h4>Quick Preview</h4>
                              
                              {profileData.bio && (
                                <div className={styles.bioPreview}>
                                  <p>{profileData.bio.length > 120 
                                    ? profileData.bio.substring(0, 120) + '...' 
                                    : profileData.bio}
                                  </p>
                                </div>
                              )}
                              
                              <div className={styles.quickStats}>
                                {userRole === 'creator' && (
                                  <div className={styles.quickStat}>
                                    <Target size={14} />
                                    <span>{profileData.stats?.podsCreated || 0} Pods Created</span>
                                  </div>
                                )}
                                
                                <div className={styles.quickStat}>
                                  <Users size={14} />
                                  <span>{profileData.stats?.podsJoined || 0} Pods Joined</span>
                                </div>
                                
                                <div className={styles.quickStat}>
                                  <Activity size={14} />
                                  <span>{profileData.stats?.successRate || 85}% Success Rate</span>
                                </div>

                                {/* Show top badges */}
                                {profileData.badges && profileData.badges.length > 0 && (
                                  <div className={styles.quickStat}>
                                    <Award size={14} />
                                    <span>{profileData.badges.length} Badges Earned</span>
                                  </div>
                                )}
                              </div>
                              
                              <div className={styles.overlayActions}>
                                <button 
                                  className={styles.overlayButton}
                                  onClick={() => navigate(`/profile/${userData._id}`)}
                                >
                                  Full Profile
                                </button>
                                
                                <button 
                                  className={styles.overlayButton}
                                  onClick={() => handleMessageUser(userData._id)}
                                >
                                  Send Message
                                </button>
                                
                                {userRole === 'contributor' && isLoggedIn && user.role === 'creator' && (
                                  <button 
                                    className={styles.overlayButton}
                                    onClick={() => navigate(`/invite-to-pod?user=${userData._id}`)}
                                  >
                                    Invite to Pod
                                  </button>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Enhanced Load More Section with navigation */}
{/* Professional Pagination */}
{pagination.totalPages > 1 && (
  <motion.div 
    className={styles.paginationSection}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.5 }}
  >
    <div className={styles.paginationInfo}>
      <span>Showing {((pagination.page - 1) * 12) + 1}-{Math.min(pagination.page * 12, pagination.total)} of {pagination.total} profiles</span>
    </div>
    
    <div className={styles.paginationControls}>
      {/* Previous Button */}
      <button 
        className={`${styles.paginationButton} ${styles.prevButton}`}
        onClick={() => fetchProfiles(pagination.page - 1)}
        disabled={pagination.page === 1 || isLoading}
      >
        <ChevronLeft size={16} />
        Previous
      </button>
      
      {/* Page Numbers */}
      <div className={styles.pageNumbers}>
        {getPaginationRange(pagination.page, pagination.totalPages).map((page, index) => (
          page === '...' ? (
            <span key={index} className={styles.ellipsis}>...</span>
          ) : (
            <button
              key={index}
              className={`${styles.pageButton} ${pagination.page === page ? styles.active : ''}`}
              onClick={() => fetchProfiles(page)}
              disabled={isLoading}
            >
              {page}
            </button>
          )
        ))}
      </div>
      
      {/* Next Button */}
      <button 
        className={`${styles.paginationButton} ${styles.nextButton}`}
        onClick={() => fetchProfiles(pagination.page + 1)}
        disabled={pagination.page === pagination.totalPages || isLoading}
      >
        Next
        <ChevronRight size={16} />
      </button>
    </div>
    
    {/* Items per page selector */}
    <div className={styles.itemsPerPage}>
      <span>Show:</span>
      <select 
        value={itemsPerPage}
        onChange={(e) => {
          setItemsPerPage(Number(e.target.value));
          fetchProfiles(1);
        }}
      >
        <option value={12}>12 per page</option>
        <option value={24}>24 per page</option>
        <option value={48}>48 per page</option>
      </select>
    </div>
  </motion.div>
)}
            </>
          )}
        </div>
      </div>

      {/* Enhanced CTA Section */}
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
              <h2>Ready to showcase your talents?</h2>
              <p>Join our community of creators and contributors. Build your professional profile and get discovered by top projects.</p>
            </div>
            <div className={styles.ctaActions}>
              {!isLoggedIn ? (
                <>
                  <button 
                    className={styles.primaryCta}
                    onClick={() => navigate('/register')}
                  >
                    <User size={18} />
                    Join Community
                  </button>
                  <button 
                    className={styles.secondaryCta}
                    onClick={() => navigate('/login')}
                  >
                    Sign In
                  </button>
                </>
              ) : (
                <>
                  <button 
                    className={styles.primaryCta}
                    onClick={() => navigate('/settings/profile')}
                  >
                    <Edit size={18} />
                    Complete Your Profile
                  </button>
                  <button 
                    className={styles.secondaryCta}
                    onClick={() => navigate('/explore')}
                  >
                    Explore Pods
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Skills Modal */}
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
              <div className={styles.modalHeader}>
                <h3>Filter by Skills</h3>
                <button 
                  className={styles.modalClose}
                  onClick={() => setShowSkillsModal(false)}
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>
              
              <p>Select a skill to filter profiles and find the perfect match for your project.</p>
              
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
                        <button 
                          key={index} 
                          className={`${styles.skillOption} ${selectedSkill === skill.name ? styles.selected : ''}`}
                          onClick={() => {
                            setSelectedSkill(skill.name);
                            setShowSkillsModal(false);
                          }}
                        >
                          {skill.icon}
                          {skill.name}
                          {selectedSkill === skill.name && (
                            <CheckCircle size={14} className={styles.checkIcon} />
                          )}
                        </button>
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
                  className={styles.applyButton}
                  onClick={() => setShowSkillsModal(false)}
                >
                  Apply Filter
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDiscoveryFeed;