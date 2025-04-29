import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import styles from './PodDetailPage.module.scss';

const PodDetailPage = () => {
  const { id } = useParams();
  
  // Data safety util - moved to the beginning
  const safelyAccessData = (obj, path, fallback = null) => {
    try {
      return path.split('.').reduce((acc, part) => 
        acc && acc[part] !== undefined ? acc[part] : undefined, obj) || fallback;
    } catch (e) {
      return fallback;
    }
  };
  
  const [pod, setPod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('about');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [experience, setExperience] = useState('');
  const [motivation, setMotivation] = useState('');
  const [portfolioLink, setPortfolioLink] = useState('');
  const [submissionStatus, setSubmissionStatus] = useState(''); // '', 'success', or 'error'

  useEffect(() => {
    const fetchPod = async () => {
      try {
        // Simulating a slight delay for loading animation
        setTimeout(async () => {
          const res = await axios.get(`http://localhost:5000/api/pods/${id}`);
          setPod(res.data);
          setLoading(false);
        }, 800);
      } catch (err) {
        console.error(err.response?.data?.message || err.message);
        setError('Failed to load pod details. Please try again.');
        setLoading(false);
      }
    };
    
    fetchPod();
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [id]);

  // Toggle bookmark status
  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Here you would typically make an API call to save this preference
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const token = localStorage.getItem('token'); // Assuming token is stored here after login
      if (!token) {
        throw new Error('User not logged in');
      }
  
      const res = await axios.post(
        'http://localhost:5000/api/applications',
        {
          podId: pod._id,
          roleApplied: selectedRole,
          experience,
          motivation,
          portfolioLink,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log(res.data); // Application successfully sent
      setSubmissionStatus('success');
      
      // Reset form
      setExperience('');
      setMotivation('');
      setPortfolioLink('');
  
      // Auto-close modal after 2 seconds
      setTimeout(() => {
        setApplyModalOpen(false);
        setSubmissionStatus('');
        setSelectedRole('');
      }, 2000);
  
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
      setSubmissionStatus('error');
    }
  };
  
  // Open apply modal with selected role
  const handleApplyClick = (role) => {
    setSelectedRole(role);
    setApplyModalOpen(true);
  };
  
  // Close apply modal
  const closeApplyModal = () => {
    setApplyModalOpen(false);
    setSelectedRole('');
  };

  // Get status class for styling
  const getStatusClass = () => {
    const status = safelyAccessData(pod, 'status', '');
    if (!status) return '';
    
    try {
      switch(status.toLowerCase()) {
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
    } catch (e) {
      return '';
    }
  };

  // Loading state with animation
  if (loading) {
    return (
      <div className={styles.podDetailPage}>
        <div className={styles.loadingContainer}>
          <motion.div 
            className={styles.loader}
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Loading amazing pod details...
          </motion.p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={styles.podDetailPage}>
        <div className={styles.errorContainer}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p>{error}</p>
          <Link to="/explore" className={styles.backToExploreBtn}>
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.podDetailPage}>
      <motion.div 
        className={styles.gridBackground}
        animate={{ 
          scale: [1, 1.02, 1],
          rotate: [0, 1, 0]
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity,
          repeatType: "reverse" 
        }}
      />
      
      <div className={styles.container}>
        {/* Back navigation */}
        <motion.div 
          className={styles.backNavigation}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/explore" className={styles.backLink}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Back to Explore</span>
          </Link>
        </motion.div>
        
        {/* Pod header section */}
        <motion.div 
          className={styles.podHeader}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.podHeaderContent}>
            <div className={styles.podTitleSection}>
              <div className={`${styles.status} ${getStatusClass()}`}>
                <span className={styles.statusDot}></span>
                {safelyAccessData(pod, 'status', 'Status Unknown')}
              </div>
              <h1 className={styles.podTitle}>{pod.title}</h1>
              
              {pod.creator && (
                <div className={styles.creatorInfo}>
                  <div className={styles.creatorAvatar}>
                    {pod.creator.name.charAt(0).toUpperCase()}
                  </div>
                  <p>Created by <span>{pod.creator.name}</span></p>
                  <div className={styles.creationDate}>
                    {new Date(pod.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              )}
            </div>
            
            <div className={styles.podActions}>
              <motion.button 
                className={`${styles.bookmarkBtn} ${isBookmarked ? styles.bookmarked : ''}`}
                onClick={toggleBookmark}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill={isBookmarked ? "currentColor" : "none"} xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
              </motion.button>
              
              <motion.button 
                className={styles.shareBtn}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 6.65685 16.3431 8 18 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 15C7.65685 15 9 13.6569 9 12C9 10.3431 7.65685 9 6 9C4.34315 9 3 10.3431 3 12C3 13.6569 4.34315 15 6 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18 22C19.6569 22 21 20.6569 21 19C21 17.3431 19.6569 16 18 16C16.3431 16 15 17.3431 15 19C15 20.6569 16.3431 22 18 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8.59 13.51L15.42 17.49" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15.41 6.51L8.59 10.49" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Share</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
        
        {/* Tab navigation */}
        <motion.div 
          className={styles.tabNavigation}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <button 
            className={`${styles.tabButton} ${activeTab === 'about' ? styles.active : ''}`}
            onClick={() => setActiveTab('about')}
          >
            About
            {activeTab === 'about' && <motion.div className={styles.activeIndicator} layoutId="activeTab" />}
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'roles' ? styles.active : ''}`}
            onClick={() => setActiveTab('roles')}
          >
            Roles Needed
            {activeTab === 'roles' && <motion.div className={styles.activeIndicator} layoutId="activeTab" />}
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'updates' ? styles.active : ''}`}
            onClick={() => setActiveTab('updates')}
          >
            Updates
            {activeTab === 'updates' && <motion.div className={styles.activeIndicator} layoutId="activeTab" />}
          </button>
        </motion.div>
        
        {/* Content area */}
        <motion.div 
          className={styles.contentArea}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {activeTab === 'about' && (
            <motion.div 
              className={styles.aboutSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className={styles.missionSection}>
                <h2>Mission</h2>
                <p>{pod.mission || 'No mission statement provided.'}</p>
              </div>
              
              <div className={styles.descriptionSection}>
                <h2>Description</h2>
                <p>{pod.description || 'No description provided.'}</p>
              </div>
              
              <div className={styles.detailsGrid}>
                <div className={styles.detailCard}>
                  <h3>Category</h3>
                  <p>{pod.category || 'Not specified'}</p>
                </div>
                <div className={styles.detailCard}>
                  <h3>Format</h3>
                  <p>{pod.format || 'Not specified'}</p>
                </div>
                <div className={styles.detailCard}>
                  <h3>Frequency</h3>
                  <p>{pod.frequency || 'Not specified'}</p>
                </div>
                <div className={styles.detailCard}>
                  <h3>Duration</h3>
                  <p>{pod.duration || 'Not specified'}</p>
                </div>
              </div>
            </motion.div>
          )}
          
          {activeTab === 'roles' && (
            <motion.div 
              className={styles.rolesSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2>Roles Needed</h2>
              
              {safelyAccessData(pod, 'rolesNeeded', []).length > 0 ? (
                <div className={styles.rolesGrid}>
                  {safelyAccessData(pod, 'rolesNeeded', []).map((role, index) => (
                    <motion.div 
                      key={index}
                      className={styles.roleCard}
                      whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)" }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <h3>{role}</h3>
                      <p>Join this pod as a {typeof role === 'string' ? role.toLowerCase() : role} and help bring this podcast to life!</p>
                      <motion.button 
                        className={styles.applyButton}
                        onClick={() => handleApplyClick(role)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Apply for this role
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className={styles.noRolesMessage}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <p>No roles are currently needed for this pod.</p>
                </div>
              )}
            </motion.div>
          )}
          
          {activeTab === 'updates' && (
            <motion.div 
              className={styles.updatesSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2>Recent Updates</h2>
              
              {safelyAccessData(pod, 'updates', []).length > 0 ? (
                <div className={styles.timelineContainer}>
                  {safelyAccessData(pod, 'updates', []).map((update, index) => (
                    <div key={index} className={styles.timelineItem}>
                      <div className={styles.timelineDot}></div>
                      <div className={styles.timelineContent}>
                        <div className={styles.updateDate}>
                          {safelyAccessData(update, 'date') 
                            ? new Date(update.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })
                            : 'Date not specified'
                          }
                        </div>
                        <h3>{safelyAccessData(update, 'title', 'Update')}</h3>
                        <p>{safelyAccessData(update, 'description', 'No details provided.')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.noUpdatesMessage}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3.05 11.5C3.5 7.5 7 4.5 11 4.5C15 4.5 18.5 7.5 19 11.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M19 15V19.5H3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <p>No updates have been posted yet.</p>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
      
      {/* Apply Modal - Only rendered when open */}
      {applyModalOpen && (
        <div className={styles.modalOverlay}>
          <motion.div 
            className={styles.applyModal}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
          >

{submissionStatus === 'success' && (
  <div className={styles.successMessage}>
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
    <p>Thank you for applying! We'll get back to you soon.</p>
  </div>
)}


{submissionStatus === 'error' && (
  <div className={styles.errorMessage}>
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
    <p>Failed to submit application. Please try again.</p>
  </div>
)}

            <div className={styles.modalHeader}>
              <h2>Apply for {selectedRole}</h2>
              <button className={styles.closeModalButton} onClick={closeApplyModal}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            <div className={styles.modalContent}>
            <form className={styles.applyForm} onSubmit={handleApplicationSubmit}>
            <div className={styles.formField}>
                  <label htmlFor="experience">Your experience as a {selectedRole}</label>
                  <textarea 
  id="experience" 
  placeholder="Tell us about your experience..."
  rows="4"
  value={experience}
  onChange={(e) => setExperience(e.target.value)}
></textarea>
                </div>
                
                <div className={styles.formField}>
                  <label htmlFor="why">Why are you interested in this pod?</label>
                  <textarea 
  id="why" 
  placeholder="Share why you're excited about this project..."
  rows="3"
  value={motivation}
  onChange={(e) => setMotivation(e.target.value)}
></textarea>
                </div>
                
                <div className={styles.formField}>
                  <label htmlFor="portfolio">Portfolio link (optional)</label>
                  <input 
  type="url" 
  id="portfolio" 
  placeholder="https://your-portfolio.com"
  value={portfolioLink}
  onChange={(e) => setPortfolioLink(e.target.value)}
/>
                </div>
                
                <div className={styles.formActions}>
                  <button 
                    type="button" 
                    className={styles.cancelButton}
                    onClick={closeApplyModal}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className={styles.submitButton}
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PodDetailPage;