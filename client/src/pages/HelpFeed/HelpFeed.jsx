import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './HelpFeed.module.scss';

const HelpFeed = () => {
  const [pods, setPods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userSkills, setUserSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const isLoggedIn = localStorage.getItem('token') !== null;
  
  // Mock skills for demo - in real app, these would come from user profile
  const mockSkills = [
    'React', 'UI Design', 'Marketing', 'Podcast Production', 
    'Copywriting', 'Backend Development', 'Branding'
  ];

  useEffect(() => {
    // Set mock skills for demo purposes
    setUserSkills(mockSkills);
    
    const fetchPods = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would filter to only get pods needing help
        const res = await axios.get('http://localhost:5000/api/pods');
        
        // Add mock urgency levels and needed skills for demo purposes
        const podsWithUrgency = res.data.map(pod => {
          const urgencyLevels = ['high', 'medium', 'low'];
          const randomIndex = Math.floor(Math.random() * urgencyLevels.length);
          
          // Add mock roles needed if they don't exist
          const roles = pod.rolesNeeded || [
            'UI Designer', 'React Developer', 'Content Writer', 
            'Marketing Specialist', 'Podcast Host'
          ].slice(0, 2 + Math.floor(Math.random() * 3));
          
          return {
            ...pod,
            urgency: urgencyLevels[randomIndex],
            rolesNeeded: roles,
            matchScore: Math.floor(Math.random() * 100) // Mock match score
          };
        });
        
        setPods(podsWithUrgency);
        setError(null);
      } catch (err) {
        console.error(err.response?.data?.message || err.message);
        setError('Failed to load help feed. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPods();
  }, []);
  
  // Filter pods based on selected skill and urgency
  const filteredPods = pods.filter(pod => {
    const matchesSkill = selectedSkill === 'all' || 
      (pod.rolesNeeded && pod.rolesNeeded.some(role => 
        role.toLowerCase().includes(selectedSkill.toLowerCase())
      ));
    
    const matchesUrgency = urgencyFilter === 'all' || pod.urgency === urgencyFilter;
    
    return matchesSkill && matchesUrgency;
  });
  
  // Sort pods by urgency and match score
  const sortedPods = [...filteredPods].sort((a, b) => {
    const urgencyOrder = { high: 3, medium: 2, low: 1 };
    
    // First sort by urgency
    if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
      return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
    }
    
    // Then by match score
    return b.matchScore - a.matchScore;
  });

  return (
    <div className={styles.helpFeedPage}>
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
      
      <div className={styles.heroSection}>
        <div className={styles.container}>
          <motion.div 
            className={styles.heroContent}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className={styles.sectionTitleWrapper}>
              <h1 className={styles.sectionTitle}>Help Feed</h1>
              <div className={styles.titleDecoration}></div>
            </div>
            <p className={styles.sectionDescription}>
              Pods with urgent needs matching your skills. Join, contribute, and earn reputation by helping these pods succeed.
            </p>
            
            {!isLoggedIn && (
              <div className={styles.loginPrompt}>
                <p>Sign in to see pods that match your skills</p>
                <Link to="/login" className={styles.loginButton}>Sign In</Link>
              </div>
            )}
          </motion.div>
        </div>
      </div>
      
      <div className={styles.contentSection}>
        <div className={styles.container}>
          <div className={styles.filterBar}>
            <div className={styles.filterSection}>
              <h3>Filter by skill</h3>
              <div className={styles.skillPills}>
                <button 
                  className={`${styles.skillPill} ${selectedSkill === 'all' ? styles.active : ''}`}
                  onClick={() => setSelectedSkill('all')}
                >
                  All Skills
                </button>
                
                {userSkills.map((skill, index) => (
                  <button 
                    key={index}
                    className={`${styles.skillPill} ${selectedSkill === skill ? styles.active : ''}`}
                    onClick={() => setSelectedSkill(skill)}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
            
            <div className={styles.filterSection}>
              <h3>Filter by urgency</h3>
              <div className={styles.urgencyPills}>
                <button 
                  className={`${styles.urgencyPill} ${urgencyFilter === 'all' ? styles.active : ''}`}
                  onClick={() => setUrgencyFilter('all')}
                >
                  All
                </button>
                <button 
                  className={`${styles.urgencyPill} ${urgencyFilter === 'high' ? styles.active : ''}`}
                  onClick={() => setUrgencyFilter('high')}
                >
                  High Urgency
                </button>
                <button 
                  className={`${styles.urgencyPill} ${urgencyFilter === 'medium' ? styles.active : ''}`}
                  onClick={() => setUrgencyFilter('medium')}
                >
                  Medium Urgency
                </button>
                <button 
                  className={`${styles.urgencyPill} ${urgencyFilter === 'low' ? styles.active : ''}`}
                  onClick={() => setUrgencyFilter('low')}
                >
                  Low Urgency
                </button>
              </div>
            </div>
          </div>
          
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loader}></div>
              <p>Finding pods that need your help...</p>
            </div>
          ) : error ? (
            <div className={styles.errorContainer}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p>{error}</p>
              <button 
                className={styles.retryButton}
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          ) : sortedPods.length === 0 ? (
            <div className={styles.emptyState}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 16V8.00002C20.9996 7.6493 20.9071 7.30483 20.7315 7.00119C20.556 6.69754 20.3037 6.44539 20 6.27002L13 2.27002C12.696 2.09449 12.3511 2.00208 12 2.00208C11.6489 2.00208 11.304 2.09449 11 2.27002L4 6.27002C3.69626 6.44539 3.44398 6.69754 3.26846 7.00119C3.09294 7.30483 3.00036 7.6493 3 8.00002V16C3.00036 16.3508 3.09294 16.6952 3.26846 16.9989C3.44398 17.3025 3.69626 17.5547 4 17.73L11 21.73C11.304 21.9056 11.6489 21.998 12 21.998C12.3511 21.998 12.696 21.9056 13 21.73L20 17.73C20.3037 17.5547 20.556 17.3025 20.7315 16.9989C20.9071 16.6952 20.9996 16.3508 21 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3.27002 6.96002L12 12.01L20.73 6.96002" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 22.08V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h3>No pods match your filters</h3>
              <p>Try adjusting your skill or urgency filters</p>
              <button 
                className={styles.resetButton}
                onClick={() => {
                  setSelectedSkill('all');
                  setUrgencyFilter('all');
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <motion.div 
              className={styles.podGrid}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {sortedPods.map((pod) => (
                <motion.div 
                  key={pod._id}
                  className={styles.podCard}
                  variants={itemVariants}
                >
                  <div className={styles.cardHeader}>
                    <div className={`${styles.urgencyBadge} ${styles[pod.urgency]}`}>
                      <span className={styles.dot}></span>
                      {pod.urgency.charAt(0).toUpperCase() + pod.urgency.slice(1)} Urgency
                    </div>
                    
                    {isLoggedIn && (
                      <div className={styles.matchScore}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21 16V8.00002C20.9996 7.6493 20.9071 7.30483 20.7315 7.00119C20.556 6.69754 20.3037 6.44539 20 6.27002L13 2.27002C12.696 2.09449 12.3511 2.00208 12 2.00208C11.6489 2.00208 11.304 2.09449 11 2.27002L4 6.27002C3.69626 6.44539 3.44398 6.69754 3.26846 7.00119C3.09294 7.30483 3.00036 7.6493 3 8.00002V16C3.00036 16.3508 3.09294 16.6952 3.26846 16.9989C3.44398 17.3025 3.69626 17.5547 4 17.73L11 21.73C11.304 21.9056 11.6489 21.998 12 21.998C12.3511 21.998 12.696 21.9056 13 21.73L20 17.73C20.3037 17.5547 20.556 17.3025 20.7315 16.9989C20.9071 16.6952 20.9996 16.3508 21 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 22.08V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {pod.matchScore}% Match
                      </div>
                    )}
                  </div>
                  
                  <h3 className={styles.podTitle}>{pod.title}</h3>
                  
                  <div className={styles.creatorInfo}>
                    <div className={styles.avatar}>
                      {pod.creator?.name?.charAt(0) || 'P'}
                    </div>
                    <span>by {pod.creator?.name || 'Anonymous'}</span>
                  </div>
                  
                  <div className={styles.rolesList}>
                    <div className={styles.rolesHeader}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 20H22V18C22 16.3431 20.6569 15 19 15C18.0444 15 17.1931 15.4468 16.6438 16.1429M17 20H7M17 20V18C17 17.3438 16.8736 16.717 16.6438 16.1429M7 20H2V18C2 16.3431 3.34315 15 5 15C5.95561 15 6.80686 15.4468 7.35625 16.1429M7 20V18C7 17.3438 7.12642 16.717 7.35625 16.1429M7.35625 16.1429C8.0935 14.301 9.89482 13 12 13C14.1052 13 15.9065 14.301 16.6438 16.1429M15 7C15 9.20914 13.2091 11 11 11C8.79086 11 7 9.20914 7 7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7ZM21 8C21 9.65685 19.6569 11 18 11C16.3431 11 15 9.65685 15 8C15 6.34315 16.3431 5 18 5C19.6569 5 21 6.34315 21 8ZM9 8C9 9.65685 7.65685 11 6 11C4.34315 11 3 9.65685 3 8C3 6.34315 4.34315 5 6 5C7.65685 5 9 6.34315 9 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>Roles Needed:</span>
                    </div>
                    <div className={styles.roles}>
                      {pod.rolesNeeded?.map((role, index) => (
                        <span key={index} className={styles.role}>
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className={styles.cardActions}>
                    <Link to={`/pods/${pod._id}`} className={styles.viewButton}>
                      View Pod
                    </Link>
                    <button className={styles.joinButton}>
                      <span>Join Now</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HelpFeed;