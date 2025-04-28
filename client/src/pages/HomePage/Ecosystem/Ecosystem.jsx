import React, { useState, useEffect, useRef } from 'react';
import styles from './EcosystemSection.module.scss';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';

const EcosystemSection = () => {
  // Define ecosystem stages
  const ecosystemStages = [
    {
      id: 'creation',
      title: 'Pod Creation',
      icon: (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      description: 'Launch a Pod with a mission, needed roles, and visual style.',
      bullets: ['Define mission', 'Set visual style', 'Specify needed roles'],
      color: '#E8C547', // Gold accent
    },
    {
      id: 'build',
      title: 'Build Phase',
      icon: (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      description: 'Collaborate with contributors to build your vision.',
      bullets: ['Task assignment', 'Contribution logging', 'Verification'],
      color: '#34D399', // Green
    },
    {
      id: 'prelaunch',
      title: 'Pre-Launch',
      icon: (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      description: 'Test, refine, and prepare for market.',
      bullets: ['Public testing', 'Final assembly', 'Marketing prep'],
      color: '#FBBF24', // Yellow
    },
    {
      id: 'launch',
      title: 'Launch',
      icon: (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      description: 'Release your product to the world and earn reputation.',
      bullets: ['Product sales', 'Reputation earned', 'Revenue distribution'],
      color: '#818CF8', // Purple
    },
    {
      id: 'evolution',
      title: 'Evolution',
      icon: (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 9L12 16L5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      description: 'Archive successful Pods or fork for the next version.',
      bullets: ['Archive', 'Fork', 'New opportunities'],
      color: '#EC4899', // Pink
    },
  ];

  // Define user roles
  const userRoles = [
    {
      id: 'creators',
      title: 'Pod Creators',
      icon: (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      description: 'Visionaries who initiate Pods with innovative ideas and clear direction.',
      color: '#E8C547', // Gold
    },
    {
      id: 'contributors',
      title: 'Contributors',
      icon: (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      description: 'Specialists who power Pods with their expertise - developers, designers, marketers, and writers.',
      color: '#34D399', // Green
    },
    {
      id: 'boosters',
      title: 'Boosters',
      icon: (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 19V6L21 3V16M9 19C9 20.1046 7.88071 21 6.5 21C5.11929 21 4 20.1046 4 19C4 17.8954 5.11929 17 6.5 17C7.88071 17 9 17.8954 9 19ZM21 16C21 17.1046 19.8807 18 18.5 18C17.1193 18 16 17.1046 16 16C16 14.8954 17.1193 14 18.5 14C19.8807 14 21 14.8954 21 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      description: 'Users who amplify Pods via promotion, feedback, and testing to increase visibility and impact.',
      color: '#FBBF24', // Yellow
    },
    {
      id: 'buyers',
      title: 'Buyers',
      icon: (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 22V16M17 19H23M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      description: 'Supporters who purchase final products/services and provide valuable market validation.',
      color: '#818CF8', // Purple
    },
    {
      id: 'backers',
      title: 'Backers (Future)',
      icon: (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      description: 'Investors/sponsors funding Pods or backing top contributors in future platform phases.',
      color: '#EC4899', // Pink
    },
  ];
  
  // Define pod states
  const podStates = [
    {
      id: 'draft',
      title: 'Draft',
      description: 'Private exploration phase for Pod creators.',
      color: '#6B7280', // Gray
    },
    {
      id: 'open',
      title: 'Open',
      description: 'Public, actively recruiting contributors.',
      color: '#3B82F6', // Blue
    },
    {
      id: 'inProgress',
      title: 'In Progress',
      description: 'Active building phase with contributors working.',
      color: '#10B981', // Green
    },
    {
      id: 'prelaunch',
      title: 'Pre-Launch',
      description: 'Final preparation and testing before launch.',
      color: '#F59E0B', // Amber
    },
    {
      id: 'live',
      title: 'Live',
      description: 'Actively selling products/services to buyers.',
      color: '#8B5CF6', // Purple
    },
    {
      id: 'archived',
      title: 'Archived',
      description: 'Concluded project, available for forking.',
      color: '#6B7280', // Gray
    },
  ];

  // Define pod contributor roles
  const contributorRoles = [
    { id: 'creator', title: 'Creator / Co-Creator' },
    { id: 'designer', title: 'Designer' },
    { id: 'developer', title: 'Developer' },
    { id: 'writer', title: 'Writer' },
    { id: 'marketer', title: 'Marketer' },
    { id: 'strategist', title: 'Strategist' },
    { id: 'tester', title: 'Tester' },
  ];

  // State for active views
  const [activeStage, setActiveStage] = useState('creation');
  const [activeView, setActiveView] = useState('lifecycle'); // 'lifecycle', 'roles', 'states', 'contributors'
  const [activeRole, setActiveRole] = useState('creators');
  const [activeState, setActiveState] = useState('open');
  // State for animation trigger
  const [isVisible, setIsVisible] = useState(false);
  // State for particles
  const [particles, setParticles] = useState([]);
  // Reference for the ecosystem container
  const ecosystemRef = useRef(null);
  
  // Controls for staggered animations
  const controls = useAnimation();

  // Generate particles
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 40; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 1,
          speed: Math.random() * 0.3 + 0.1,
          opacity: Math.random() * 0.5 + 0.1,
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  // Intersection Observer to trigger animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          controls.start("visible");
        }
      },
      { threshold: 0.2 }
    );

    const section = ecosystemRef.current;
    if (section) observer.observe(section);

    return () => {
      if (section) observer.unobserve(section);
    };
  }, [controls]);

  // Find active items based on current view
  const currentStage = ecosystemStages.find(stage => stage.id === activeStage);
  const currentRole = userRoles.find(role => role.id === activeRole);
  const currentState = podStates.find(state => state.id === activeState);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.3 }
    }
  };

  return (
    <section className={styles.ecosystem} ref={ecosystemRef}>
      {/* Particle background */}
      <div className={styles.particleContainer}>
        {particles.map(particle => (
          <div
            key={particle.id}
            className={styles.particle}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              animationDuration: `${20 / particle.speed}s`,
            }}
          />
        ))}
      </div>
      
      <div className={styles.ecosystemContent}>
        <motion.div 
          className={styles.sectionTitleWrapper}
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.sectionTitle}>Ecosystem Map</h2>
          <div className={styles.titleDecoration} />
        </motion.div>
        
        <motion.p 
          className={styles.sectionDescription}
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Discover how the PODNEX ecosystem works, from Pod creation to successful launch.
        </motion.p>
        
        {/* View selector tabs */}
        <motion.div 
          className={styles.viewSelector}
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <button 
            className={`${styles.viewTab} ${activeView === 'lifecycle' ? styles.activeTab : ''}`}
            onClick={() => setActiveView('lifecycle')}
          >
            Pod Lifecycle
          </button>
          <button 
            className={`${styles.viewTab} ${activeView === 'roles' ? styles.activeTab : ''}`}
            onClick={() => setActiveView('roles')}
          >
            User Roles
          </button>
          <button 
            className={`${styles.viewTab} ${activeView === 'states' ? styles.activeTab : ''}`}
            onClick={() => setActiveView('states')}
          >
            Pod States
          </button>
          <button 
            className={`${styles.viewTab} ${activeView === 'contributors' ? styles.activeTab : ''}`}
            onClick={() => setActiveView('contributors')}
          >
            Contributor Roles
          </button>
        </motion.div>
        
        <AnimatePresence mode="wait">
          {/* Pod Lifecycle View */}
          {activeView === 'lifecycle' && (
            <motion.div 
              key="lifecycle"
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div 
                className={styles.stagesContainer}
                variants={containerVariants}
                initial="hidden"
                animate={controls}
              >
                {ecosystemStages.map((stage, index) => (
                  <motion.button
                    key={stage.id}
                    className={`${styles.stageButton} ${activeStage === stage.id ? styles.active : ''}`}
                    onClick={() => setActiveStage(stage.id)}
                    variants={itemVariants}
                    style={{
                      '--stage-color': stage.color,
                      '--stage-index': index,
                    }}
                  >
                    <div className={styles.stageIcon}>{stage.icon}</div>
                    <span className={styles.stageTitle}>{stage.title}</span>
                    {activeStage === stage.id && (
                      <span className={styles.stageIndicator} />
                    )}
                  </motion.button>
                ))}
              </motion.div>
              
              <motion.div 
                className={styles.stageDetailOuter}
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <motion.div 
                  className={styles.stageDetail}
                  key={activeStage}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  style={{ '--stage-color': currentStage.color }}
                >
                  <div className={styles.stageHeader}>
                    <div className={styles.stageIconLarge}>{currentStage.icon}</div>
                    <h3 className={styles.stageDetailTitle}>{currentStage.title}</h3>
                  </div>
                  
                  <p className={styles.stageDescription}>{currentStage.description}</p>
                  
                  <ul className={styles.stageBullets}>
                    {currentStage.bullets.map((bullet, index) => (
                      <motion.li 
                        key={index}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className={styles.stageBullet}
                      >
                        <span className={styles.bulletDot} />
                        {bullet}
                      </motion.li>
                    ))}
                  </ul>
                  
                  <motion.div 
                    className={styles.stageActions}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <button className={styles.learnMoreBtn}>
                      Learn More
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 3L14 8L8 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M14 8H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Visualization of the ecosystem flow */}
              <motion.div 
                className={styles.ecosystemFlow}
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <div className={styles.flowLine}></div>
                {ecosystemStages.map((stage, index) => (
                  <div 
                    key={stage.id}
                    className={`${styles.flowNode} ${activeStage === stage.id ? styles.activeNode : ''}`}
                    style={{ 
                      left: `${(index / (ecosystemStages.length - 1)) * 100}%`,
                      '--node-color': stage.color 
                    }}
                    onClick={() => setActiveStage(stage.id)}
                  >
                    <div className={styles.flowNodeInner}></div>
                    <div className={styles.flowNodePulse}></div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* User Roles View */}
          {activeView === 'roles' && (
            <motion.div 
              key="roles"
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={styles.rolesContainer}
            >
              <div className={styles.rolesGrid}>
                {userRoles.map((role, index) => (
                  <motion.div
                    key={role.id}
                    className={`${styles.roleCard} ${activeRole === role.id ? styles.activeRole : ''}`}
                    onClick={() => setActiveRole(role.id)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                    style={{ '--role-color': role.color }}
                  >
                    <div className={styles.roleIconContainer} style={{ backgroundColor: `${role.color}20` }}>
                      {role.icon}
                    </div>
                    <h3 className={styles.roleTitle}>{role.title}</h3>
                    <p className={styles.roleDescription}>{role.description}</p>
                  </motion.div>
                ))}
              </div>

              <motion.div 
                className={styles.profileGraph}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                <h3 className={styles.graphTitle}>User Profile Graph</h3>
                <p className={styles.graphDescription}>
                  Each user has a visible Profile Graph showcasing their journey in the ecosystem:
                </p>
                <div className={styles.graphCategories}>
                  <div className={styles.graphCategory}>
                    <div className={styles.categoryIcon} style={{ backgroundColor: '#10B981' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M14 2V8H20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16 13H8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16 17H8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10 9H9H8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h4>Contributions</h4>
                  </div>
                  <div className={styles.graphCategory}>
                    <div className={styles.categoryIcon} style={{ backgroundColor: '#8B5CF6' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M18.7273 14.7273C18.6063 15.0909 18.6518 15.4818 18.8591 15.8091L18.9045 15.8545C19.0699 16.0199 19.2011 16.2168 19.2898 16.4338C19.3785 16.6508 19.4235 16.8836 19.4222 17.1187C19.4209 17.3539 19.3732 17.5861 19.2822 17.8019C19.1912 18.0177 19.058 18.213 18.8909 18.3764C18.7239 18.5398 18.5254 18.6688 18.3073 18.7551C18.0892 18.8414 17.8553 18.8838 17.6201 18.8798C17.385 18.8758 17.1527 18.8255 16.9379 18.7318C16.7232 18.6382 16.5289 18.5035 16.3682 18.3355L16.3227 18.29C15.9955 18.0827 15.6045 17.9827 15.2409 18.1036C14.8864 18.2245 14.6091 18.5255 14.5 18.8891L14.4773 18.9673C14.3939 19.1899 14.2681 19.3936 14.1067 19.5676C13.9452 19.7417 13.7512 19.8826 13.5359 19.9812C13.3207 20.0798 13.0885 20.1345 12.8536 20.1425C12.6188 20.1505 12.3838 20.1118 12.1623 20.0282C11.9408 19.9447 11.7382 19.8182 11.5655 19.6565C11.3929 19.4947 11.2534 19.3004 11.1548 19.0851C11.0562 18.8698 11.0007 18.6369 10.9917 18.4012C10.9827 18.1656 11.0203 17.9299 11.1027 17.7073L11.1255 17.6291C11.2464 17.2655 11.1464 16.8745 10.9391 16.5473L10.8936 16.5018C10.7283 16.3364 10.597 16.1395 10.5083 15.9225C10.4196 15.7055 10.3746 15.4727 10.3759 15.2376C10.3772 15.0024 10.4249 14.7702 10.5159 14.5544C10.6069 14.3386 10.7401 14.1434 10.9072 13.9799C11.0742 13.8165 11.2727 13.6876 11.4908 13.6012C11.7089 13.5149 11.9428 13.4725 12.178 13.4765C12.4131 13.4805 12.6454 13.5308 12.8601 13.6245C13.0749 13.7181 13.2692 13.8528 13.4299 14.0209L13.4754 14.0664C13.8027 14.2736 14.1936 14.3736 14.5573 14.2527C14.9118 14.1318 15.1891 13.8309 15.2982 13.4673L15.3209 13.3891C15.4043 13.1665 15.5301 12.9627 15.6916 12.7887C15.853 12.6147 16.047 12.4737 16.2623 12.3751C16.4776 12.2765 16.7097 12.2218 16.9446 12.2138C17.1794 12.2058 17.4144 12.2445 17.6359 12.3282C17.8574 12.4117 18.06 12.5382 18.2327 12.6999C18.4054 12.8617 18.5449 13.056 18.6435 13.2713C18.7421 13.4866 18.7976 13.7195 18.8066 13.9551C18.8156 14.1908 18.778 14.4264 18.6955 14.6491L18.6727 14.7273C18.5518 15.0909 18.6518 15.4818 18.8591 15.8091M13.9091 8.72727C13.7882 9.09091 13.8336 9.48182 14.0409 9.80909L14.0864 9.85454C14.2517 10.0199 14.3829 10.2168 14.4717 10.4338C14.5604 10.6508 14.6054 10.8836 14.6041 11.1187C14.6028 11.3539 14.5551 11.5861 14.4641 11.8019C14.3731 12.0177 14.2399 12.213 14.0728 12.3764C13.9058 12.5398 13.7072 12.6688 13.4891 12.7551C13.271 12.8414 13.0372 12.8838 12.802 12.8798C12.5669 12.8758 12.3346 12.8255 12.1198 12.7318C11.905 12.6382 11.7108 12.5035 11.55 12.3355L11.5045 12.29C11.1773 12.0827 10.7864 11.9827 10.4227 12.1036C10.0682 12.2245 9.79091 12.5255 9.68182 12.8891L9.65909 12.9673C9.57574 13.1899 9.44993 13.3936 9.28847 13.5676C9.12701 13.7417 8.93303 13.8826 8.71773 13.9812C8.50244 14.0798 8.27026 14.1345 8.03542 14.1425C7.80059 14.1505 7.56565 14.1118 7.34411 14.0282C7.12256 13.9447 6.92001 13.8182 6.74735 13.6565C6.5747 13.4947 6.4352 13.3004 6.33659 13.0851C6.23798 12.8698 6.18252 12.6369 6.17353 12.4012C6.16454 12.1656 6.20215 11.9299 6.28455 11.7073L6.30727 11.6291C6.42818 11.2655 6.32818 10.8745 6.12091 10.5473L6.07545 10.5018C5.91014 10.3364 5.77886 10.1395 5.69015 9.92248C5.60145 9.70551 5.55643 9.47268 5.55772 9.23754C5.55902 9.0024 5.60671 8.77019 5.69773 8.5544C5.78875 8.33861 5.92196 8.14335 6.08905 7.97994C6.25614 7.81653 6.45467 7.68756 6.67276 7.60123C6.89085 7.5149 7.12473 7.47245 7.35992 7.47652C7.5951 7.48059 7.82735 7.53114 8.04211 7.62478C8.25687 7.71841 8.45121 7.85317 8.61192 8.02091L8.65736 8.06636C8.98464 8.27364 9.37555 8.37364 9.73918 8.25273C10.0936 8.13182 10.3709 7.83091 10.48 7.46727L10.5027 7.38909C10.5861 7.16647 10.7119 6.96274 10.8734 6.78871C11.0348 6.61468 11.2288 6.47375 11.4441 6.37514C11.6594 6.27653 11.8916 6.22182 12.1264 6.21383C12.3612 6.20584 12.5962 6.24452 12.8177 6.32818C13.0392 6.41185 13.2418 6.53825 13.4145 6.70001C13.5871 6.86177 13.7266 7.05604 13.8252 7.27133C13.9238 7.48663 13.9794 7.71951 13.9884 7.95514C13.9974 8.19078 13.9598 8.42643 13.8773 8.64909L13.8545 8.72727C13.7336 9.09091 13.8336 9.48182 14.0409 9.80909" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h4>Reputation</h4>
                  </div>
                  <div className={styles.graphCategory}>
                    <div className={styles.categoryIcon} style={{ backgroundColor: '#F59E0B' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M22 12C22 12 19 18 12 18C5 18 2 12 2 12C2 12 5 6 12 6C19 6 22 12 22 12Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h4>Badges</h4>
                  </div>
                  <div className={styles.graphCategory}>
                    <div className={styles.categoryIcon} style={{ backgroundColor: '#E8C547' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 19.5L4 18.5L12 22L20 18.5L22 19.5M2 14.5L4 13.5L12 17L20 13.5L22 14.5M12 2L2 9.5L12 17L22 9.5L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h4>Earnings History</h4>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Pod States View */}
          {activeView === 'states' && (
            <motion.div 
              key="states"
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={styles.statesContainer}
            >
              <div className={styles.statesFlow}>
                {podStates.map((state, index) => (
                  <motion.div
                    key={state.id}
                    className={`${styles.stateCard} ${activeState === state.id ? styles.activeState : ''}`}
                    onClick={() => setActiveState(state.id)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                    style={{ '--state-color': state.color }}
                  >
                    <div className={styles.stateHeader}>
                      <div className={styles.stateColorIndicator} style={{ backgroundColor: state.color }}></div>
                      <h3 className={styles.stateTitle}>{state.title}</h3>
                    </div>
                    <p className={styles.stateDescription}>{state.description}</p>
                    
                    {index < podStates.length - 1 && (
                      <div className={styles.stateArrow}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
              
              <motion.div 
                className={styles.stateNote}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <div className={styles.noteIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className={styles.noteText}>
                  <strong>Pods are dynamic, living entities.</strong> Contributors can join or leave, new roles can be opened, and new versions can be forked at any time during the Pod lifecycle.
                </p>
              </motion.div>
            </motion.div>
          )}
          
          {/* Contributor Roles View */}
          {activeView === 'contributors' && (
            <motion.div 
              key="contributors"
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={styles.contributorRolesContainer}
            >
              <div className={styles.rolesGrid}>
                {contributorRoles.map((role, index) => (
                  <motion.div
                    key={role.id}
                    className={styles.contributorRole}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                  >
                    <div className={styles.roleBadge}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 7L9 18L4 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h3 className={styles.contributorRoleTitle}>{role.title}</h3>
                  </motion.div>
                ))}
              </div>
              
              <motion.div 
                className={styles.contributorInfo}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <h3 className={styles.infoTitle}>Multiple Contribution Paths</h3>
                <p className={styles.infoDescription}>
                  Contributors can take on multiple roles within a Pod, bringing their unique skills to the table. Each role can be filled by multiple contributors, allowing for collaborative expertise and diverse perspectives.
                </p>
                <div className={styles.infoHighlight}>
                  <p>Contribution is tracked, verified, and rewarded based on agreed Pod terms, with reputation building over time.</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.div 
          className={styles.joinEcosystem}
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <motion.button 
            className={styles.joinEcosystemBtn}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Join The Ecosystem
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 3L14 8L8 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 8H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default EcosystemSection;