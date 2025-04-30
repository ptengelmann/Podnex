import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence, useInView, useAnimation } from 'framer-motion';
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
  ArrowRight,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  Hourglass
} from 'lucide-react';
import styles from './ApplicationsPage.module.scss';

const ApplicationsPage = () => {
  // State management
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'pending', 'accepted', 'rejected'
  const [expandedApplication, setExpandedApplication] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    sortBy: 'newest'
  });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const userRole = user?.role;

  // Refs and animations
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: false, threshold: 0.2 });
  const controls = useAnimation();

  // Get application counts
  const pendingCount = applications.filter(app => app.status === 'Pending').length;
  const acceptedCount = applications.filter(app => app.status === 'Accepted').length;
  const rejectedCount = applications.filter(app => app.status === 'Rejected').length;

  // Enhanced display titles based on role
  const getPageTitle = () => {
    if (userRole === 'creator') {
      return 'Applications Received';
    } else {
      return 'My Applications';
    }
  };
  
  // Get badge text based on role
  const getBadgeText = () => {
    if (userRole === 'creator') {
      return 'CREATOR APPLICATIONS';
    } else {
      return 'MY APPLICATIONS';
    }
  };

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

  // Handle animation based on scroll
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, inView]);

  // Fetch applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
  
        if (!token || !storedUser) throw new Error('User not authenticated');
  
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
  
        const res = await axios.get('http://localhost:5000/api/applications', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        setApplications(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch applications');
        setLoading(false);
      }
    };
  
    fetchApplications();
  }, []);
  
  // Update application status
  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      setLoading(true);
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
      
      setLoading(false);
    } catch (err) {
      console.error('Failed to update application status:', err);
      setError('Failed to update application status. Please try again.');
      setLoading(false);
    }
  };

  // Withdraw application
  const withdrawApplication = async (applicationId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) throw new Error('User not authenticated');
      
      await axios.delete(`http://localhost:5000/api/applications/${applicationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Update the local state by removing the application
      setApplications(prevApplications => 
        prevApplications.filter(app => app._id !== applicationId)
      );
      
      setLoading(false);
    } catch (err) {
      console.error('Failed to withdraw application:', err);
      setError('Failed to withdraw application. Please try again.');
      setLoading(false);
    }
  };

  // Toggle expanded application
  const toggleExpandApplication = (id) => {
    setExpandedApplication(expandedApplication === id ? null : id);
  };

  // Filter applications based on search term and filters
  const filteredApplications = applications.filter(app => {
    // Filter by search term
    const searchMatch = 
      app.roleApplied.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.pod?.title && app.pod.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (userRole === 'creator' && app.applicant?.name && 
       app.applicant.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filter by status
    const statusMatch = 
      filters.status === 'all' || 
      app.status.toLowerCase() === filters.status.toLowerCase();
    
    // Filter by tab
    const tabMatch = 
      activeTab === 'all' || 
      app.status.toLowerCase() === activeTab.toLowerCase();
    
    return searchMatch && statusMatch && tabMatch;
  }).sort((a, b) => {
    // Sort applications
    if (filters.sortBy === 'newest') {
      return new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now());
    } else if (filters.sortBy === 'oldest') {
      return new Date(a.createdAt || Date.now()) - new Date(b.createdAt || Date.now());
    }
    return 0;
  });

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
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
      y: -5,
      scale: 1.05,
      transition: { duration: 0.3 }
    }
  };

  // Loading state UI
  if (loading) {
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
        <button
          className={styles.retryButton}
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
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
      
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className={styles.sectionHeader}
      >
        <div className={styles.badgeWrapper}>
          <span className={styles.badge}>
            {getBadgeText()}
          </span>
        </div>
        <h2 className={styles.sectionTitle}>
          <span>{getPageTitle()}</span>
          <span className={styles.highlight}> Tracker</span>
        </h2>
        <p className={styles.sectionSubtitle}>
          {userRole === 'creator' 
            ? 'Manage applications for your pod roles and find the right contributors'
            : 'Track your applications to different pods and their current status'
          }
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
            <Briefcase size={24} color="#E8C547" />
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
      </motion.div>

      {/* Search and Filter Bar */}
      <motion.div 
        className={styles.searchFilterBar}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className={styles.searchContainer}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder={userRole === 'creator' ? "Search by role, pod, or applicant..." : "Search by role or pod..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        
        <motion.button 
          className={styles.filterButton}
          onClick={() => setShowFilters(!showFilters)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Filter size={18} />
          Filters
          <ChevronDown size={18} className={showFilters ? styles.rotated : ''} />
        </motion.button>
      </motion.div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div 
            className={styles.filterPanel}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
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
                  Newest First
                </button>
                <button 
                  className={`${styles.filterOption} ${filters.sortBy === 'oldest' ? styles.active : ''}`}
                  onClick={() => setFilters({...filters, sortBy: 'oldest'})}
                >
                  Oldest First
                </button>
              </div>
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
          <Briefcase size={18} />
          All Applications
        </motion.button>
        
        <motion.button 
          className={`${styles.tabButton} ${activeTab === 'pending' ? styles.activeTab : ''}`}
          variants={tabVariants}
          animate={activeTab === 'pending' ? 'active' : 'inactive'}
          onClick={() => setActiveTab('pending')}
        >
          <Clock size={18} />
          Pending
        </motion.button>
        
        <motion.button 
          className={`${styles.tabButton} ${activeTab === 'accepted' ? styles.activeTab : ''}`}
          variants={tabVariants}
          animate={activeTab === 'accepted' ? 'active' : 'inactive'}
          onClick={() => setActiveTab('accepted')}
        >
          <CheckCircle2 size={18} />
          Accepted
        </motion.button>
        
        <motion.button 
          className={`${styles.tabButton} ${activeTab === 'rejected' ? styles.activeTab : ''}`}
          variants={tabVariants}
          animate={activeTab === 'rejected' ? 'active' : 'inactive'}
          onClick={() => setActiveTab('rejected')}
        >
          <XCircle size={18} />
          Rejected
        </motion.button>
      </motion.div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <motion.div 
          className={styles.emptyState}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.emptyStateIcon}>
            {userRole === 'creator' ? <Users size={64} /> : <Briefcase size={64} />}
          </div>
          <h3>{searchTerm ? 'No matching applications found' : 'No applications yet'}</h3>
          <p>
            {searchTerm 
              ? 'Try adjusting your search or filters to find what you\'re looking for'
              : userRole === 'creator'
                ? 'When contributors apply to your pods, they\'ll appear here'
                : 'Find interesting pods to collaborate with and submit your applications'
            }
          </p>
          {userRole !== 'creator' && !searchTerm && (
            <motion.button 
              className={styles.emptyStateButton}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/pods/explore'}
            >
              Explore Pods
              <ArrowRight size={18} />
            </motion.button>
          )}
        </motion.div>
      ) : (
        <motion.div 
          className={styles.applicationsGrid}
          variants={container}
          initial="hidden"
          animate="visible"
        >
          {filteredApplications.map((application) => (
            <motion.div 
              key={application._id} 
              className={styles.applicationCard}
              variants={item}
              whileHover={{ y: -5 }}
              layout
            >
              <div className={styles.cardHeader}>
                <div className={styles.podInfo}>
                  <h3>{application.pod?.title || 'Untitled Pod'}</h3>
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
              
              {userRole === 'creator' && (
                <div className={styles.applicantInfo}>
                  <div className={styles.applicantAvatar}>
                    <User size={20} />
                  </div>
                  <span>{application.applicant?.name || 'Anonymous'}</span>
                </div>
              )}
              
              <div className={styles.cardPreview}>
                <div className={styles.previewItem}>
                  <span className={styles.previewLabel}>Experience</span>
                  <p className={styles.previewValue}>
                    {application.experience.length > 120
                      ? `${application.experience.substring(0, 120)}...`
                      : application.experience}
                  </p>
                </div>
              </div>
              
              <div className={styles.cardActions}>
                <div className={styles.leftActions}>
                  <motion.button 
                    className={styles.detailsButton}
                    onClick={() => toggleExpandApplication(application._id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {expandedApplication === application._id ? 'Hide Details' : 'View Details'}
                    {expandedApplication === application._id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </motion.button>
                </div>
                
                <div className={styles.rightActions}>
                  {/* Creator can accept or reject pending applications */}
                  {userRole === 'creator' && application.status === 'Pending' && (
                    <div className={styles.actionButtons}>
                      <motion.button 
                        className={styles.acceptButton}
                        onClick={() => updateApplicationStatus(application._id, 'Accepted')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <CheckCircle size={16} />
                        Accept
                      </motion.button>
                      <motion.button 
                        className={styles.rejectButton}
                        onClick={() => updateApplicationStatus(application._id, 'Rejected')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <XCircle size={16} />
                        Reject
                      </motion.button>
                    </div>
                  )}
                  
                  {/* Only contributors can withdraw pending applications */}
                  {userRole === 'contributor' && application.status === 'Pending' && (
                    <motion.button 
                      className={styles.withdrawButton}
                      onClick={() => withdrawApplication(application._id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <XCircle size={16} />
                      Withdraw
                    </motion.button>
                  )}
                </div>
              </div>
              
              <AnimatePresence>
                {expandedApplication === application._id && (
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
                        >
                          View Portfolio
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    )}
                    
                    <div className={styles.expandedActions}>
                      {userRole === 'creator' && (
                        <motion.button 
                          className={styles.messageButton}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <MessageSquare size={16} />
                          Message Applicant
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
};

export default ApplicationsPage;