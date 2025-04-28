import React, { useState, useEffect, useRef } from 'react';
import styles from './EcosystemSection.module.scss';
import { motion, useAnimation } from 'framer-motion';

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

  // State for active stage
  const [activeStage, setActiveStage] = useState('creation');
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

  // Find active stage
  const currentStage = ecosystemStages.find(stage => stage.id === activeStage);

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