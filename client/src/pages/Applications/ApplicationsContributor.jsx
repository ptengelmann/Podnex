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
  ChevronUp,
  Grid,
  List,
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  Check,
  X,
  PlusCircle,
  RefreshCw,
  ArrowRight,
  Calendar,
  FileText,
  Inbox,
  Send,
  TrendingUp,
  Target,
  Zap
} from 'lucide-react';
import styles from './ApplicationsContributor.module.scss';

const ApplicationsContributor = () => {
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
    pod: 'all'
  });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [viewMode, setViewMode] = useState('cards');
  const [availablePods, setAvailablePods] = useState([]);
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [bulkActionMode, setBulkActionMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [stats, setStats] = useState({
    responseRate: 0,
    averageResponseTime: '2.1 days',
    mostAppliedPod: 'Loading...',
    applicationTrend: 'neutral'
  });
  
  // Refs and animations
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: false, threshold: 0.1 });
  const initialLoadCompleted = useRef(false);
  const successMessageTimeoutRef = useRef(null);

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
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate and update stats for contributors
  const updateStats = (apps) => {
    const respondedApps = apps.filter(app => app.status === 'Accepted' || app.status === 'Rejected').length;
    const responseRate = apps.length > 0 ? Math.round((respondedApps / apps.length) * 100) : 0;
    
    const podCounts = {};
    apps.forEach(app => {
      const podName = app.podTitle || 'Unknown Pod';
      podCounts[podName] = (podCounts[podName] || 0) + 1;
    });
    
    let mostAppliedPod = 'None';
    let maxPodCount = 0;
    
    Object.entries(podCounts).forEach(([pod, count]) => {
      if (count > maxPodCount) {
        maxPodCount = count;
        mostAppliedPod = pod;
      }
    });
    
    const recentApps = apps.filter(app => {
      const appDate = new Date(app.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return appDate > weekAgo;
    });
    
    const applicationTrend = recentApps.length > 2 ? 'up' : recentApps.length > 0 ? 'stable' : 'down';
    
    setStats({
      responseRate,
      averageResponseTime: '2.1 days',
      mostAppliedPod,
      applicationTrend
    });
  };

  // Apply filters and update filtered applications
  useEffect(() => {
    let filtered = [...applications];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(app => 
        (app.roleApplied && app.roleApplied.toLowerCase().includes(term)) ||
        (app.podTitle && app.podTitle.toLowerCase().includes(term)) ||
        (app.motivation && app.motivation.toLowerCase().includes(term)) ||
        (app.experience && app.experience.toLowerCase().includes(term))
      );
    }
    
    if (filters.status !== 'all') {
      filtered = filtered.filter(app => 
        app.status.toLowerCase() === filters.status.toLowerCase()
      );
    }
    
    if (filters.pod !== 'all') {
      filtered = filtered.filter(app => 
        app.podTitle === filters.pod
      );
    }
    
    if (activeTab !== 'all') {
      filtered = filtered.filter(app => 
        app.status.toLowerCase() === activeTab.toLowerCase()
      );
    }
    
    switch (filters.sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'a-z':
        filtered.sort((a, b) => (a.podTitle || '').localeCompare(b.podTitle || ''));
        break;
      case 'z-a':
        filtered.sort((a, b) => (b.podTitle || '').localeCompare(a.podTitle || ''));
        break;
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    setFilteredApplications(filtered);
  }, [applications, searchTerm, filters, activeTab]);

  // Fetch applications with robust authentication
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (!token || !storedUser) {
          console.error('Authentication error: Missing token or user data');
          setError('User not authenticated');
          setLoading(false);
          return;
        }
        
        let currentUser;
        try {
          currentUser = JSON.parse(storedUser);
          
          if (!currentUser || typeof currentUser !== 'object') {
            console.error('Invalid user data format');
            setError('Invalid user data format');
            setLoading(false);
            return;
          }
          
          setUser(currentUser);
          console.log('Successfully loaded contributor data:', currentUser);
        } catch (parseError) {
          console.error('Error parsing user data:', parseError);
          setError('Invalid user data. Please log in again.');
          setLoading(false);
          return;
        }
        
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
          
          const pods = Array.from(new Set(res.data.map(app => app.podTitle))).filter(Boolean);
          setAvailablePods(pods);
          
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
  
    let isMounted = true;
    if (isMounted) {
      fetchApplications();
    }
    
    const refreshInterval = setInterval(() => {
      if (initialLoadCompleted.current && isMounted) {
        fetchApplications();
      }
    }, 60000);
    
    return () => {
      isMounted = false;
      clearInterval(refreshInterval);
      if (successMessageTimeoutRef.current) {
        clearTimeout(successMessageTimeoutRef.current);
      }
    };
  }, []);

  // Withdraw application
  const withdrawApplication = async (applicationId) => {
    try {
      setActionLoading(prev => ({...prev, [applicationId]: true}));
      
      const token = localStorage.getItem('token');
      
      if (!token) throw new Error('User not authenticated');
      
      await axios.delete(`http://localhost:5000/api/applications/${applicationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setApplications(prevApplications => 
        prevApplications.filter(app => app._id !== applicationId)
      );
      
      setSuccessMessage('Application withdrawn successfully');
      
      if (successMessageTimeoutRef.current) {
        clearTimeout(successMessageTimeoutRef.current);
      }
      
      successMessageTimeoutRef.current = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      
      updateStats(applications.filter(app => app._id !== applicationId));
      
      setActionLoading(prev => {
        const newState = {...prev};
        delete newState[applicationId];
        return newState;
      });
    } catch (err) {
      console.error('Failed to withdraw application:', err);
      setError('Failed to withdraw application. Please try again.');
      
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
      pod: 'all'
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
  
  // Handle bulk withdrawal
  const performBulkWithdrawal = async () => {
    if (selectedApplications.length === 0) return;
    
    try {
      setLoading(true);
      
      const token = localStorage.getItem('token');
      if (!token) throw new Error('User not authenticated');
      
      for (const appId of selectedApplications) {
        await axios.delete(
          `http://localhost:5000/api/applications/${appId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      
      setApplications(prevApplications => 
        prevApplications.filter(app => !selectedApplications.includes(app._id))
      );
      
      setSuccessMessage(
        `${selectedApplications.length} applications withdrawn successfully`
      );
      
      if (successMessageTimeoutRef.current) {
        clearTimeout(successMessageTimeoutRef.current);
      }
      
      successMessageTimeoutRef.current = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      
      updateStats(applications.filter(app => !selectedApplications.includes(app._id)));
      
      setSelectedApplications([]);
      setBulkActionMode(false);
    } catch (err) {
      console.error('Failed to perform bulk withdrawal:', err);
      setError('Failed to withdraw applications. Please try again.');
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
          Loading your applications...
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
      
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className={styles.sectionHeader}
      >
        <div className={styles.badgeWrapper}>
          <span className={styles.badge}>
            MY APPLICATIONS
          </span>
        </div>
        <h2 className={styles.sectionTitle}>
          <span>My Applications</span>
          <span className={styles.highlight}> Dashboard</span>
        </h2>
        <p className={styles.sectionSubtitle}>
          Track and manage your applications to different pods, monitor your application progress
        </p>
      </motion.div>

      {/* Stats Overview */}
      <motion.div 
        className={styles.statsOverview}
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <motion.div className={styles.statCard} variants={item}>
          <div className={styles.statIconWrapper} style={{ backgroundColor: 'rgba(232, 197, 71, 0.1)' }}>
            <Send size={24} color="#E8C547" />
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
        
        {/* Enhanced stats insights */}
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
            <div className={styles.insightLabel}>Response Rate</div>
            <div className={styles.insightValue}>{stats.responseRate}%</div>
          </div>
          
          <div className={styles.statInsight}>
            <div className={styles.insightIcon}>
              <Clock size={16} />
            </div>
            <div className={styles.insightLabel}>Avg. Response Time</div>
            <div className={styles.insightValue}>{stats.averageResponseTime}</div>
          </div>
          
          <div className={styles.statInsight}>
            <div className={styles.insightIcon}>
              <Target size={16} />
            </div>
            <div className={styles.insightLabel}>Most Applied Pod</div>
            <div className={styles.insightValue}>{stats.mostAppliedPod}</div>
          </div>
          
          <div className={styles.statInsight}>
            <div className={styles.insightIcon}>
              {stats.applicationTrend === 'up' ? <TrendingUp size={16} /> : <Zap size={16} />}
            </div>
            <div className={styles.insightLabel}>Application Trend</div>
            <div className={styles.insightValue}>
              {stats.applicationTrend === 'up' ? 'Increasing' : 
               stats.applicationTrend === 'stable' ? 'Stable' : 'Steady'}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Controls Bar */}
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
              className={styles.bulkWithdrawButton}
              onClick={performBulkWithdrawal}
              disabled={selectedApplications.length === 0}
            >
              <XCircle size={16} />
              <span>Withdraw Selected</span>
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
                placeholder="Search by role, pod, or details..."
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
              
              <motion.button 
                className={styles.newApplicationButton}
                onClick={() => window.location.href = '/pods/explore'}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <PlusCircle size={18} />
                <span>Apply to Pod</span>
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

      {/* Tab Selector */}
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
          <Send size={18} />
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
          
          {(searchTerm || filters.status !== 'all' || filters.pod !== 'all') && (
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

      {/* Applications Display */}
      {filteredApplications.length === 0 ? (
        <motion.div 
          className={styles.emptyState}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.emptyStateIcon}>
            {searchTerm || filters.status !== 'all' || filters.pod !== 'all' ? (
              <Search size={64} />
            ) : (
              <Send size={64} />
            )}
          </div>
          <h3>
            {searchTerm || filters.status !== 'all' || filters.pod !== 'all' 
              ? 'No matching applications found' 
              : 'No applications yet'
            }
          </h3>
          <p>
            {searchTerm || filters.status !== 'all' || filters.pod !== 'all'
              ? 'Try adjusting your search or filters to find what you\'re looking for'
              : 'Start applying to pods that interest you and build your portfolio'
            }
          </p>
          
          {(searchTerm || filters.status !== 'all' || filters.pod !== 'all') && (
            <button 
              className={styles.resetFiltersButton}
              onClick={resetFilters}
            >
              <RefreshCw size={16} />
              <span>Clear all filters</span>
            </button>
          )}
          
          {!searchTerm && filters.status === 'all' && filters.pod === 'all' && (
            <button 
              className={styles.explorePodsButton}
              onClick={() => window.location.href = '/pods/explore'}
            >
              <PlusCircle size={16} />
              <span>Explore Pods</span>
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
              
              {/* Application submission info */}
              <div className={styles.applicationInfo}>
                <div className={styles.applicationDate}>
                  <Calendar size={12} />
                  <span>Applied {getTimeAgo(application.createdAt)}</span>
                </div>
                <div className={styles.applicationId}>
                  <FileText size={12} />
                  <span>#{application._id.slice(-6).toUpperCase()}</span>
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
                  <motion.button 
                    className={`${styles.withdrawButton} ${actionLoading[application._id] ? styles.loading : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      withdrawApplication(application._id);
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
                    <span>Withdraw</span>
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
                        <span>Message Creator</span>
                      </motion.button>
                      
                      <motion.a 
                        href={`/pods/${application.podId}`}
                        className={styles.viewPodButton}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <EyeIcon size={16} />
                        <span>View Pod</span>
                      </motion.a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
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

export default ApplicationsContributor;