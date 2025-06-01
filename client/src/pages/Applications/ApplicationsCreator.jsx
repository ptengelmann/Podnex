import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  Users,
  User,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  Hourglass,
  Award,
  BarChart2,
  EyeIcon,
  ListFilter,
  ChevronUp,
  Grid,
  List,
  Sparkles,
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  Archive,
  Check,
  X,
  CornerUpRight,
  PlusCircle,
  RefreshCw,
  ArrowRight,
  Calendar,
  FileText,
  Inbox
} from 'lucide-react';
import styles from './ApplicationsCreator.module.scss';

const ApplicationsCreator = () => {
  // State management with reliable initialization
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [expandedApplications, setExpandedApplications] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    sortBy: 'newest',
    pod: 'all',
    role: 'all',
    date: 'all'
  });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [viewMode, setViewMode] = useState('cards');
  const [availablePods, setAvailablePods] = useState([]);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [bulkActionMode, setBulkActionMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [stats, setStats] = useState({
    conversionRate: 0,
    responseTime: '2.4 days',
    topPod: 'Loading...',
    topRole: 'Loading...'
  });
  
  // Refs and animations
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: false, threshold: 0.1 });
  const initialLoadCompleted = useRef(false);
  const successMessageTimeoutRef = useRef(null);
  const animationControlsRef = useRef(null);

  // Get application counts
  const pendingCount = applications.filter(app => app.status === 'Pending').length;
  const acceptedCount = applications.filter(app => app.status === 'Accepted').length;
  const rejectedCount = applications.filter(app => app.status === 'Rejected').length;

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

  // Check viewport size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate and update stats
  const updateStats = (apps) => {
    // Conversion rate
    const decidedApps = apps.filter(app => app.status === 'Accepted' || app.status === 'Rejected').length;
    const acceptedApps = apps.filter(app => app.status === 'Accepted').length;
    const conversionRate = decidedApps > 0 ? Math.round((acceptedApps / decidedApps) * 100) : 0;
    
    // Find most popular pod
    const podCounts = {};
    apps.forEach(app => {
      const podName = app.podTitle || 'Unknown Pod';
      podCounts[podName] = (podCounts[podName] || 0) + 1;
    });
    
    let topPod = 'None';
    let maxPodCount = 0;
    
    Object.entries(podCounts).forEach(([pod, count]) => {
      if (count > maxPodCount) {
        maxPodCount = count;
        topPod = pod;
      }
    });
    
    // Find most requested role
    const roleCounts = {};
    apps.forEach(app => {
      const role = app.roleApplied || 'Unknown Role';
      roleCounts[role] = (roleCounts[role] || 0) + 1;
    });
    
    let topRole = 'None';
    let maxRoleCount = 0;
    
    Object.entries(roleCounts).forEach(([role, count]) => {
      if (count > maxRoleCount) {
        maxRoleCount = count;
        topRole = role;
      }
    });
    
    setStats({
      conversionRate,
      responseTime: '2.4 days', // Mocked for now, could be calculated
      topPod,
      topRole
    });
  };

  // Apply filters and update filtered applications
  useEffect(() => {
    let filtered = [...applications];
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(app => 
        (app.roleApplied && app.roleApplied.toLowerCase().includes(term)) ||
        (app.podTitle && app.podTitle.toLowerCase().includes(term)) ||
        (app.applicantName && app.applicantName.toLowerCase().includes(term)) ||
        (app.motivation && app.motivation.toLowerCase().includes(term)) ||
        (app.experience && app.experience.toLowerCase().includes(term))
      );
    }
    
    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter(app => 
        app.status.toLowerCase() === filters.status.toLowerCase()
      );
    }
    
    // Filter by pod
    if (filters.pod !== 'all') {
      filtered = filtered.filter(app => 
        app.podTitle === filters.pod
      );
    }
    
    // Filter by role
    if (filters.role !== 'all') {
      filtered = filtered.filter(app => 
        app.roleApplied === filters.role
      );
    }
    
    // Filter by tab
    if (activeTab !== 'all') {
      filtered = filtered.filter(app => 
        app.status.toLowerCase() === activeTab.toLowerCase()
      );
    }
    
    // Sort applications
    switch (filters.sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'a-z':
        filtered.sort((a, b) => (a.applicantName || '').localeCompare(b.applicantName || ''));
        break;
      case 'z-a':
        filtered.sort((a, b) => (b.applicantName || '').localeCompare(a.applicantName || ''));
        break;
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    setFilteredApplications(filtered);
  }, [applications, searchTerm, filters, activeTab]);

  // Fetch applications with robust authentication - Creator specific
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        
        // Check both localStorage items directly
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (!token || !storedUser) {
          console.error('Authentication error: Missing token or user data');
          setError('User not authenticated');
          setLoading(false);
          return;
        }
        
        // Parse user data from localStorage
        let currentUser;
        try {
          currentUser = JSON.parse(storedUser);
          
          // Ensure user object is valid - creator specific check
          if (!currentUser || typeof currentUser !== 'object') {
            console.error('Invalid user data format, not an object:', currentUser);
            setError('Invalid user data format');
            setLoading(false);
            return;
          }
          
          // Set user state
          setUser(currentUser);
          console.log('Successfully loaded creator data:', currentUser);
        } catch (parseError) {
          console.error('Error parsing user data:', parseError);
          setError('Invalid user data. Please log in again.');
          setLoading(false);
          return;
        }
        
        // Make API request with proper error handling
        try {
          const res = await axios.get('http://localhost:5000/api/applications', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            timeout: 10000
          });
    
          setApplications(res.data);
          setFilteredApplications(res.data);
          initialLoadCompleted.current = true;
          
          // Extract unique pods and roles for filters
          const pods = Array.from(new Set(res.data.map(app => app.podTitle))).filter(Boolean);
          const roles = Array.from(new Set(res.data.map(app => app.roleApplied))).filter(Boolean);
          
          setAvailablePods(pods);
          setAvailableRoles(roles);
          
          // Update stats
          updateStats(res.data);
        } catch (apiError) {
          console.error('API Error:', apiError);
          
          if (apiError.response) {
            if (apiError.response.status === 401 || apiError.response.status === 403) {
              setError('Authentication failed. Please log in again.');
            } else {
              setError(`Server error: ${apiError.response.status}`);
            }
          } else if (apiError.request) {
            setError('No response from server. Please check your connection.');
          } else {
            setError('Failed to fetch applications');
          }
          
          throw apiError;
        }
      } catch (err) {
        console.error('Overall fetch applications error:', err);
      } finally {
        setLoading(false);
      }
    };
  
    // Fetch data only if component is mounted
    let isMounted = true;
    if (isMounted) {
      fetchApplications();
    }
    
    // Set up an interval to periodically refresh data
    const refreshInterval = setInterval(() => {
      if (initialLoadCompleted.current && isMounted) {
        fetchApplications();
      }
    }, 60000); // Check every minute
    
    return () => {
      isMounted = false;
      clearInterval(refreshInterval);
      // Clear any pending timeouts
      if (successMessageTimeoutRef.current) {
        clearTimeout(successMessageTimeoutRef.current);
      }
    };
  }, []);

  // Update application status - specific to creators
  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      // Set loading state for this specific application
      setActionLoading(prev => ({...prev, [applicationId]: true}));
      
      const token = localStorage.getItem('token');
      
      if (!token) throw new Error('User not authenticated');
      
      await axios.patch(`http://localhost:5000/api/applications/${applicationId}/status`, 
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Update the local state to reflect the change
      setApplications(prevApplications => 
        prevApplications.map(app => 
          app._id === applicationId 
            ? { ...app, status: newStatus } 
            : app
        )
      );
      
      // Show success message
      setSuccessMessage(`Application successfully ${newStatus.toLowerCase()}`);
      
      // Clear success message after 3 seconds
      if (successMessageTimeoutRef.current) {
        clearTimeout(successMessageTimeoutRef.current);
      }
      
      successMessageTimeoutRef.current = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      
      // Update stats
      updateStats(applications.map(app => 
        app._id === applicationId ? { ...app, status: newStatus } : app
      ));
      
      // Clear loading state
      setActionLoading(prev => {
        const newState = {...prev};
        delete newState[applicationId];
        return newState;
      });
    } catch (err) {
      console.error('Failed to update application status:', err);
      setError('Failed to update application status. Please try again.');
      
      // Clear loading state
      setActionLoading(prev => {
        const newState = {...prev};
        delete newState[applicationId];
        return newState;
      });
    }
  };

  // Toggle expanded application
  const toggleExpandApplication = (id) => {
    setExpandedApplications(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilters({
      status: 'all',
      sortBy: 'newest',
      pod: 'all',
      role: 'all',
      date: 'all'
    });
    setSearchTerm('');
  };
  
  // Toggle bulk action mode
  const toggleBulkActionMode = () => {
    setBulkActionMode(!bulkActionMode);
    setSelectedApplications([]);
  };
  
  // Toggle application selection for bulk actions
  const toggleApplicationSelection = (id) => {
    if (selectedApplications.includes(id)) {
      setSelectedApplications(prev => prev.filter(appId => appId !== id));
    } else {
      setSelectedApplications(prev => [...prev, id]);
    }
  };
  
  // Handle bulk actions
  const performBulkAction = async (action) => {
    if (selectedApplications.length === 0) return;
    
    try {
      setLoading(true);
      
      const token = localStorage.getItem('token');
      if (!token) throw new Error('User not authenticated');
      
      // Determine status based on action
      const newStatus = action === 'accept' ? 'Accepted' : 'Rejected';
      
      // Process each selected application
      for (const appId of selectedApplications) {
        await axios.patch(
          `http://localhost:5000/api/applications/${appId}/status`,
          { status: newStatus },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      
      // Update the local state
      setApplications(prevApplications => 
        prevApplications.map(app => 
          selectedApplications.includes(app._id)
            ? { ...app, status: newStatus }
            : app
        )
      );
      
      // Show success message
      setSuccessMessage(
        `${selectedApplications.length} applications ${action === 'accept' ? 'accepted' : 'rejected'} successfully`
      );
      
      // Clear success message after 3 seconds
      if (successMessageTimeoutRef.current) {
        clearTimeout(successMessageTimeoutRef.current);
      }
      
      successMessageTimeoutRef.current = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      
      // Update stats
      updateStats(applications.map(app => 
        selectedApplications.includes(app._id) ? { ...app, status: newStatus } : app
      ));
      
      // Reset selection and bulk mode
      setSelectedApplications([]);
      setBulkActionMode(false);
    } catch (err) {
      console.error(`Failed to perform bulk ${action}:`, err);
      setError(`Failed to ${action} applications. Please try again.`);
    } finally {
      setLoading(false);
    }
  };
  
  // Format date nicely
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Get time ago for display
  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Unknown time';
    
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
      return interval === 1 ? '1 year ago' : `${interval} years ago`;
    }
    
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      return interval === 1 ? '1 month ago' : `${interval} months ago`;
    }
    
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
      return interval === 1 ? '1 day ago' : `${interval} days ago`;
    }
    
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
      return interval === 1 ? '1 hour ago' : `${interval} hours ago`;
    }
    
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
      return interval === 1 ? '1 minute ago' : `${interval} minutes ago`;
    }
    
    return seconds < 10 ? 'just now' : `${Math.floor(seconds)} seconds ago`;
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
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
        ease: "easeOut"
      }
    }
  };

  const tabVariants = {
    inactive: { 
      opacity: 0.7,
      y: 0,
      scale: 1
    },
    active: { 
      opacity: 1,
      y: -3,
      scale: 1.05,
      transition: { duration: 0.3 }
    }
  };
  
  const fadeIn = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  // Loading state UI
  if (loading && applications.length === 0) {
    return (
      <div className={styles.loadingContainer}>
        <motion.div
          className={styles.loadingIcon}
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { repeat: Infinity, duration: 1.5, ease: "linear" },
            scale: { repeat: Infinity, duration: 2, ease: "easeInOut" }
          }}
        >
          <Hourglass size={48} />
        </motion.div>
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className={styles.loadingText}
        >
          Loading applications...
        </motion.p>
      </div>
    );
  }

  // Error state UI
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <AlertCircle size={48} className={styles.errorIcon} />
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <div className={styles.errorDetails}>
          <small>If you continue to experience issues, please contact support.</small>
        </div>
        <div className={styles.errorActions}>
          <button
            className={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
          <button
            className={styles.loginButton}
            onClick={() => window.location.href = '/login'}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className={styles.applicationsPage} ref={sectionRef}>
      {/* Animated Background */}
      <div 
        className={styles.gridBackground}
        style={{
          transform: `translate(${mousePosition.x * 15}px, ${mousePosition.y * 15}px)`,
        }}
      />
      
      {/* Floating decorative elements */}
      <motion.div
        className={`${styles.floatingShape} ${styles.shape1}`}
        animate={{
          x: [0, 15, 0],
          y: [0, -15, 0],
          rotate: [0, 5, 0],
        }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
      />
      <motion.div
        className={`${styles.floatingShape} ${styles.shape2}`}
        animate={{
          x: [0, -20, 0],
          y: [0, 20, 0],
          rotate: [0, -10, 0],
        }}
        transition={{ repeat: Infinity, duration: 9, ease: "easeInOut" }}
      />
      
      {/* Success message */}
      <AnimatePresence>
        {successMessage && (
          <motion.div 
            className={styles.successMessage}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <CheckCircle size={18} />
            <span>{successMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Section Header - Creator Specific */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className={styles.sectionHeader}
      >
        <div className={styles.badgeWrapper}>
          <span className={styles.badge}>
            CREATOR APPLICATIONS
          </span>
        </div>
        <h2 className={styles.sectionTitle}>
          <span>Applications</span>
          <span className={styles.highlight}> Dashboard</span>
        </h2>
        <p className={styles.sectionSubtitle}>
          Manage and review applications to your pods, find the perfect contributors for your projects
        </p>
      </motion.div>

      {/* Stats Overview - Enhanced Grid with insights */}
      <motion.div 
        className={styles.statsOverview}
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <motion.div className={styles.statCard} variants={item}>
          <div className={styles.statIconWrapper} style={{ backgroundColor: 'rgba(232, 197, 71, 0.1)' }}>
            <Inbox size={24} color="#E8C547" />
          </div>
          <div className={styles.statInfo}>
            <h3>{applications.length}</h3>
            <p>Total Applications</p>
          </div>
        </motion.div>
        
        <motion.div className={styles.statCard} variants={item}>
          <div className={styles.statIconWrapper} style={{ backgroundColor: 'rgba(107, 91, 149, 0.1)' }}>
            <Clock size={24} color="#6B5B95" />
          </div>
          <div className={styles.statInfo}>
            <h3>{pendingCount}</h3>
            <p>Pending</p>
          </div>
        </motion.div>
        
        <motion.div className={styles.statCard} variants={item}>
          <div className={styles.statIconWrapper} style={{ backgroundColor: 'rgba(78, 205, 196, 0.1)' }}>
            <CheckCircle2 size={24} color="#4ECDC4" />
          </div>
          <div className={styles.statInfo}>
            <h3>{acceptedCount}</h3>
            <p>Accepted</p>
          </div>
        </motion.div>
        
        <motion.div className={styles.statCard} variants={item}>
          <div className={styles.statIconWrapper} style={{ backgroundColor: 'rgba(235, 77, 75, 0.1)' }}>
            <XCircle size={24} color="#EB4D4B" />
          </div>
          <div className={styles.statInfo}>
            <h3>{rejectedCount}</h3>
            <p>Rejected</p>
          </div>
        </motion.div>
        
        {/* Enhanced stats - second row with insights */}
        <motion.div 
          className={styles.statInsightRow}
          variants={fadeIn}
          initial="hidden"
          animate="visible"
        >
          <div className={styles.statInsight}>
            <div className={styles.insightIcon}>
              <BarChart2 size={16} />
            </div>
            <div className={styles.insightLabel}>Acceptance Rate</div>
            <div className={styles.insightValue}>{stats.conversionRate}%</div>
          </div>
          
          <div className={styles.statInsight}>
            <div className={styles.insightIcon}>
              <Clock size={16} />
            </div>
            <div className={styles.insightLabel}>Avg. Response Time</div>
            <div className={styles.insightValue}>{stats.responseTime}</div>
          </div>
          
          <div className={styles.statInsight}>
            <div className={styles.insightIcon}>
              <Sparkles size={16} />
            </div>
            <div className={styles.insightLabel}>Top Requested Role</div>
            <div className={styles.insightValue}>{stats.topRole}</div>
          </div>
          
          <div className={styles.statInsight}>
            <div className={styles.insightIcon}>
              <Award size={16} />
            </div>
            <div className={styles.insightLabel}>Most Popular Pod</div>
            <div className={styles.insightValue}>{stats.topPod}</div>
          </div>
        </motion.div>
      </motion.div>

      {/* Controls Bar - Enhanced with Bulk Actions */}
      <motion.div 
        className={styles.controlsBar}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {bulkActionMode ? (
          <div className={styles.bulkActionControls}>
            <div className={styles.selectedCounter}>
              <span className={styles.selectedCount}>{selectedApplications.length}</span>
              <span>selected</span>
            </div>
            
            <button 
              className={styles.bulkAcceptButton}
              onClick={() => performBulkAction('accept')}
              disabled={selectedApplications.length === 0}
            >
              <CheckCircle size={16} />
              <span>Accept Selected</span>
            </button>
            
            <button 
              className={styles.bulkRejectButton}
              onClick={() => performBulkAction('reject')}
              disabled={selectedApplications.length === 0}
            >
              <XCircle size={16} />
              <span>Reject Selected</span>
            </button>
            
            <button 
              className={styles.cancelBulkButton}
              onClick={toggleBulkActionMode}
            >
              <X size={16} />
              <span>Cancel</span>
            </button>
          </div>
        ) : (
          <>
            <div className={styles.searchContainer}>
              <Search size={18} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search by role, pod, or applicant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
              {searchTerm && (
                <button className={styles.clearSearchButton} onClick={() => setSearchTerm('')}>
                  <X size={14} />
                </button>
              )}
            </div>
            
            <div className={styles.rightControls}>
              <button 
                className={styles.viewModeToggle} 
                onClick={() => setViewMode(viewMode === 'cards' ? 'list' : 'cards')}
                title={`Switch to ${viewMode === 'cards' ? 'list' : 'cards'} view`}
              >
                {viewMode === 'cards' ? <List size={18} /> : <Grid size={18} />}
              </button>
              
              <motion.button 
                className={styles.filterButton}
                onClick={() => setShowFilters(!showFilters)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Filter size={18} />
                <span>Filters</span>
                <ChevronDown size={16} className={showFilters ? styles.rotated : ''} />
              </motion.button>
              
              <motion.button 
                className={styles.bulkActionButton}
                onClick={toggleBulkActionMode}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={applications.length === 0}
              >
                <Users size={18} />
                <span>Bulk Actions</span>
              </motion.button>
            </div>
          </>
        )}
      </motion.div>

      {/* Enhanced Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div 
            className={styles.filterPanel}
            initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
            animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
            exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.filterGroups}>
              <div className={styles.filterGroup}>
                <h4>Status</h4>
                <div className={styles.filterOptions}>
                  <button 
                    className={`${styles.filterOption} ${filters.status === 'all' ? styles.active : ''}`}
                    onClick={() => setFilters({...filters, status: 'all'})}
                  >
                    All
                  </button>
                  <button 
                    className={`${styles.filterOption} ${filters.status === 'pending' ? styles.active : ''}`}
                    onClick={() => setFilters({...filters, status: 'pending'})}
                  >
                    Pending
                  </button>
                  <button 
                    className={`${styles.filterOption} ${filters.status === 'accepted' ? styles.active : ''}`}
                    onClick={() => setFilters({...filters, status: 'accepted'})}
                  >
                    Accepted
                  </button>
                  <button 
                    className={`${styles.filterOption} ${filters.status === 'rejected' ? styles.active : ''}`}
                    onClick={() => setFilters({...filters, status: 'rejected'})}
                  >
                    Rejected
                  </button>
                </div>
              </div>
              
              <div className={styles.filterGroup}>
                <h4>Sort By</h4>
                <div className={styles.filterOptions}>
                  <button 
                    className={`${styles.filterOption} ${filters.sortBy === 'newest' ? styles.active : ''}`}
                    onClick={() => setFilters({...filters, sortBy: 'newest'})}
                  >
                    <ArrowDownNarrowWide size={14} />
                    <span>Newest First</span>
                  </button>
                  <button 
                    className={`${styles.filterOption} ${filters.sortBy === 'oldest' ? styles.active : ''}`}
                    onClick={() => setFilters({...filters, sortBy: 'oldest'})}
                  >
                    <ArrowUpNarrowWide size={14} />
                    <span>Oldest First</span>
                  </button>
                  <button 
                    className={`${styles.filterOption} ${filters.sortBy === 'a-z' ? styles.active : ''}`}
                    onClick={() => setFilters({...filters, sortBy: 'a-z'})}
                  >
                    <span>A-Z</span>
                  </button>
                  <button 
                    className={`${styles.filterOption} ${filters.sortBy === 'z-a' ? styles.active : ''}`}
                    onClick={() => setFilters({...filters, sortBy: 'z-a'})}
                  >
                    <span>Z-A</span>
                  </button>
                </div>
              </div>
              
              {availablePods.length > 0 && (
                <div className={styles.filterGroup}>
                  <h4>Pod</h4>
                  <div className={styles.filterSelectWrapper}>
                    <select
                      className={styles.filterSelect}
                      value={filters.pod}
                      onChange={(e) => setFilters({...filters, pod: e.target.value})}
                    >
                      <option value="all">All Pods</option>
                      {availablePods.map(pod => (
                        <option key={pod} value={pod}>{pod}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className={styles.selectIcon} />
                  </div>
                </div>
              )}
              
              {availableRoles.length > 0 && (
                <div className={styles.filterGroup}>
                  <h4>Role</h4>
                  <div className={styles.filterSelectWrapper}>
                    <select
                      className={styles.filterSelect}
                      value={filters.role}
                      onChange={(e) => setFilters({...filters, role: e.target.value})}
                    >
                      <option value="all">All Roles</option>
                      {availableRoles.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className={styles.selectIcon} />
                  </div>
                </div>
              )}
            </div>
            
            <div className={styles.filterActions}>
              <button 
                className={styles.resetFiltersButton}
                onClick={resetFilters}
              >
                <RefreshCw size={14} />
                <span>Reset Filters</span>
              </button>
              
              <button 
                className={styles.applyFiltersButton}
                onClick={() => setShowFilters(false)}
              >
                <Check size={14} />
                <span>Apply Filters</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tab Selector - Enhanced for clearer status filtering */}
      <motion.div 
        className={styles.tabSelector}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <motion.button 
          className={`${styles.tabButton} ${activeTab === 'all' ? styles.activeTab : ''}`}
          variants={tabVariants}
          animate={activeTab === 'all' ? 'active' : 'inactive'}
          onClick={() => setActiveTab('all')}
        >
          <Inbox size={18} />
          <span>All Applications</span>
          <div className={styles.tabCount}>{applications.length}</div>
        </motion.button>
        
        <motion.button 
          className={`${styles.tabButton} ${activeTab === 'pending' ? styles.activeTab : ''}`}
          variants={tabVariants}
          animate={activeTab === 'pending' ? 'active' : 'inactive'}
          onClick={() => setActiveTab('pending')}
        >
          <Clock size={18} />
          <span>Pending</span>
          <div className={styles.tabCount}>{pendingCount}</div>
        </motion.button>
        
        <motion.button 
          className={`${styles.tabButton} ${activeTab === 'accepted' ? styles.activeTab : ''}`}
          variants={tabVariants}
          animate={activeTab === 'accepted' ? 'active' : 'inactive'}
          onClick={() => setActiveTab('accepted')}
        >
          <CheckCircle2 size={18} />
          <span>Accepted</span>
          <div className={styles.tabCount}>{acceptedCount}</div>
        </motion.button>
        
        <motion.button 
          className={`${styles.tabButton} ${activeTab === 'rejected' ? styles.activeTab : ''}`}
          variants={tabVariants}
          animate={activeTab === 'rejected' ? 'active' : 'inactive'}
          onClick={() => setActiveTab('rejected')}
        >
          <XCircle size={18} />
          <span>Rejected</span>
          <div className={styles.tabCount}>{rejectedCount}</div>
        </motion.button>
      </motion.div>
      
      {/* Results Info */}
      {filteredApplications.length > 0 && (
        <motion.div 
          className={styles.resultsInfo}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className={styles.resultsCount}>
            <span>Showing</span>
            <strong>{filteredApplications.length}</strong>
            <span>of</span>
            <strong>{applications.length}</strong>
            <span>applications</span>
          </div>
          
          {(searchTerm || filters.status !== 'all' || filters.pod !== 'all' || filters.role !== 'all') && (
            <button 
              className={styles.clearAllButton}
              onClick={resetFilters}
            >
              <RefreshCw size={14} />
              <span>Clear all filters</span>
            </button>
          )}
        </motion.div>
      )}

      {/* Applications Display - Handles Empty State */}
      {filteredApplications.length === 0 ? (
        <motion.div 
          className={styles.emptyState}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.emptyStateIcon}>
            {searchTerm || filters.status !== 'all' || filters.pod !== 'all' || filters.role !== 'all' ? (
              <Search size={64} />
            ) : (
              <Inbox size={64} />
            )}
          </div>
          <h3>
            {searchTerm || filters.status !== 'all' || filters.pod !== 'all' || filters.role !== 'all' 
              ? 'No matching applications found' 
              : 'No applications yet'
            }
          </h3>
          <p>
            {searchTerm || filters.status !== 'all' || filters.pod !== 'all' || filters.role !== 'all'
              ? 'Try adjusting your search or filters to find what you\'re looking for'
              : 'When contributors apply to your pods, they\'ll appear here'
            }
          </p>
          
          {(searchTerm || filters.status !== 'all' || filters.pod !== 'all' || filters.role !== 'all') && (
            <button 
              className={styles.resetFiltersButton}
              onClick={resetFilters}
            >
              <RefreshCw size={16} />
              <span>Clear all filters</span>
            </button>
          )}
          
          {!searchTerm && filters.status === 'all' && filters.pod === 'all' && filters.role === 'all' && (
            <button 
              className={styles.createPodButton}
              onClick={() => window.location.href = '/create-pod'}
            >
              <PlusCircle size={16} />
              <span>Create a New Pod</span>
            </button>
          )}
        </motion.div>
      ) : (
        <motion.div 
          className={viewMode === 'cards' ? styles.applicationsGrid : styles.applicationsList}
          variants={container}
          initial="hidden"
          animate="visible"
        >
          {filteredApplications.map((application) => (
            <motion.div 
              key={application._id} 
              className={`${styles.applicationCard} ${bulkActionMode ? styles.selectable : ''} ${selectedApplications.includes(application._id) ? styles.selected : ''}`}
              variants={item}
              whileHover={{ y: -5 }}
              layout
              onClick={bulkActionMode ? () => toggleApplicationSelection(application._id) : undefined}
            >
              {/* Selection checkbox for bulk mode */}
              {bulkActionMode && (
                <div className={styles.selectionCheckbox}>
                  <input 
                    type="checkbox" 
                    checked={selectedApplications.includes(application._id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      toggleApplicationSelection(application._id);
                    }}
                    id={`select-${application._id}`}
                  />
                  <label htmlFor={`select-${application._id}`}></label>
                </div>
              )}
              
              <div className={styles.cardHeader}>
                <div className={styles.podInfo}>
                  <h3>{application.podTitle || 'Untitled Pod'}</h3>
                  <p className={styles.roleApplied}>
                    <Briefcase size={14} />
                    Role: {application.roleApplied}
                  </p>
                </div>
                <div 
                  className={`${styles.statusBadge} ${styles[application.status.toLowerCase()]}`}
                >
                  {application.status === 'Pending' && <Clock size={14} />}
                  {application.status === 'Accepted' && <CheckCircle size={14} />}
                  {application.status === 'Rejected' && <XCircle size={14} />}
                  {application.status}
                </div>
              </div>
              
              {/* Creator sees applicant info */}
              <div className={styles.applicantInfo}>
                <div className={styles.applicantAvatar}>
                  {application.applicant?.profileImage ? (
                    <img 
                      src={application.applicant.profileImage} 
                      alt={application.applicantName} 
                      className={styles.avatarImage}
                    />
                  ) : (
                    <span>{application.applicantName?.charAt(0).toUpperCase() || 'A'}</span>
                  )}
                </div>
                <div className={styles.applicantDetails}>
                  <span className={styles.applicantName}>{application.applicantName || 'Anonymous'}</span>
                  <span className={styles.applicationDate}>
                    <Calendar size={12} />
                    <span>{getTimeAgo(application.createdAt)}</span>
                  </span>
                </div>
              </div>
              
              <div className={styles.cardPreview}>
                <div className={styles.previewItem}>
                  <span className={styles.previewLabel}>Experience</span>
                  <p className={styles.previewValue}>
                    {application.experience?.length > 120
                      ? `${application.experience.substring(0, 120)}...`
                      : application.experience}
                  </p>
                </div>
              </div>
              
              <div className={styles.cardActions}>
                <motion.button 
                  className={styles.detailsButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpandApplication(application._id);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {expandedApplications[application._id] ? 'Hide Details' : 'View Details'}
                  <ChevronDown 
                    size={16} 
                    className={expandedApplications[application._id] ? styles.rotated : ''} 
                  />
                </motion.button>
                
                {!bulkActionMode && application.status === 'Pending' && (
                  <div className={styles.actionButtons}>
                    <motion.button 
                      className={`${styles.acceptButton} ${actionLoading[application._id] ? styles.loading : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        updateApplicationStatus(application._id, 'Accepted');
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={actionLoading[application._id]}
                    >
                      {actionLoading[application._id] ? (
                        <RefreshCw size={14} className={styles.spinner} />
                      ) : (
                        <CheckCircle size={14} />
                      )}
                      <span>Accept</span>
                    </motion.button>
                    
                    <motion.button 
                      className={`${styles.rejectButton} ${actionLoading[application._id] ? styles.loading : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        updateApplicationStatus(application._id, 'Rejected');
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={actionLoading[application._id]}
                    >
                      {actionLoading[application._id] ? (
                        <RefreshCw size={14} className={styles.spinner} />
                      ) : (
                        <XCircle size={14} />
                      )}
                      <span>Reject</span>
                    </motion.button>
                  </div>
                )}
                
                {!bulkActionMode && (application.status === 'Accepted' || application.status === 'Rejected') && (
                  <motion.button 
                    className={`${styles.resetButton} ${actionLoading[application._id] ? styles.loading : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      updateApplicationStatus(application._id, 'Pending');
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={actionLoading[application._id]}
                  >
                    {actionLoading[application._id] ? (
                      <RefreshCw size={14} className={styles.spinner} />
                    ) : (
                      <CornerUpRight size={14} />
                    )}
                    <span>Reset Status</span>
                  </motion.button>
                )}
              </div>
              
              <AnimatePresence>
                {expandedApplications[application._id] && (
                  <motion.div 
                    className={styles.expandedDetails}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={styles.detailsSection}>
                      <h4>Experience</h4>
                      <p>{application.experience}</p>
                    </div>
                    
                    <div className={styles.detailsSection}>
                      <h4>Motivation</h4>
                      <p>{application.motivation}</p>
                    </div>
                    
                    {application.portfolioLink && (
                      <div className={styles.detailsSection}>
                        <h4>Portfolio</h4>
                        <a 
                          href={application.portfolioLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={styles.portfolioLink}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink size={14} />
                          <span>View Portfolio</span>
                        </a>
                      </div>
                    )}
                    
                    <div className={styles.expandedActions}>
                      <motion.button 
                        className={styles.messageButton}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MessageSquare size={16} />
                        <span>Message Applicant</span>
                      </motion.button>
                      
                      <motion.a 
                        href={`/profile/${application.applicant?._id}`}
                        className={styles.viewProfileButton}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <User size={16} />
                        <span>View Profile</span>
                      </motion.a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      )}
      
      {/* Enhanced Pagination */}
      {filteredApplications.length >= 10 && (
        <motion.div 
          className={styles.pagination}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <button 
            className={styles.paginationButton}
            disabled
          >
            <ChevronRight size={18} className={styles.prevIcon} />
            <span>Previous</span>
          </button>
          
          <div className={styles.paginationPages}>
            <button className={`${styles.pageButton} ${styles.active}`}>1</button>
          </div>
          
          <button 
            className={styles.paginationButton}
            disabled
          >
            <span>Next</span>
            <ChevronRight size={18} />
          </button>
        </motion.div>
      )}
      
      {/* Scroll to top button */}
      <AnimatePresence>
        {applications.length > 10 && (
          <motion.button
            className={styles.scrollTopButton}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ApplicationsCreator;