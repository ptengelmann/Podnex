import React, { useState, useEffect } from 'react';
import styles from './FeaturedPodsSection.module.scss';
import PodCard from '../../../components/PodCard/PodCard';
import { motion } from 'framer-motion';

const FeaturedPodsSection = () => {
  // Keeping the original data structure to maintain compatibility
  const featuredPods = [
    {
      title: 'Nomad Tools — Remote Worker Kit',
      status: 'In Progress',
      neededRoles: ['Designer', 'Marketer', 'Dev'],
    },
    {
      title: 'EcoHome — Sustainable Living Products',
      status: 'Open',
      neededRoles: ['Strategist', 'Writer', 'Tester'],
    },
    {
      title: 'Pulse AI — Mental Health Tracker',
      status: 'Live',
      neededRoles: ['Promoter', 'Marketer'],
    },
  ];

  // Additional data to enhance the display while keeping original structure
  const enhancedPods = [
    {
      ...featuredPods[0],
      contributors: 8,
      completion: 65,
      category: 'Productivity',
      description: 'Essential tools for digital nomads working remotely around the world.',
    },
    {
      ...featuredPods[1],
      contributors: 5,
      completion: 30,
      category: 'Sustainability',
      description: 'Products designed to reduce your environmental footprint at home.',
    },
    {
      ...featuredPods[2],
      contributors: 12,
      completion: 100,
      category: 'Health Tech',
      description: 'AI-powered app to track and improve mental wellbeing over time.',
    },
  ];

  // State for the filter
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'Open', 'In Progress', 'Live'];

  // State for animation trigger
  const [isVisible, setIsVisible] = useState(false);

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

    const section = document.querySelector(`.${styles.featured}`);
    if (section) observer.observe(section);

    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  // Filtered pods based on selected filter
  const filteredPods = activeFilter === 'All' 
    ? enhancedPods 
    : enhancedPods.filter(pod => pod.status === activeFilter);

  return (
    <section className={styles.featured}>
      <div className={styles.featuredHeader}>
        <motion.div 
          className={styles.sectionTitleWrapper}
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.sectionTitle}>Featured Pods</h2>
          <div className={styles.titleDecoration} />
        </motion.div>
        
        <motion.p 
          className={styles.sectionDescription}
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Join these thriving collaborations or get inspired to start your own.
        </motion.p>
        
        <motion.div 
          className={styles.filterContainer}
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {filters.map((filter, index) => (
            <button
              key={index}
              className={`${styles.filterButton} ${activeFilter === filter ? styles.active : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
              {activeFilter === filter && <span className={styles.activeDot} />}
            </button>
          ))}
        </motion.div>
      </div>

      <motion.div 
        className={styles.podGrid}
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {filteredPods.length > 0 ? (
          filteredPods.map((pod, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              className={styles.podCardWrapper}
            >
              <div className={styles.podCardEnhanced}>
                <div className={styles.podTagRow}>
                  <span className={styles.podCategory}>{pod.category}</span>
                  <span className={`${styles.podStatus} ${styles[pod.status.toLowerCase().replace(' ', '')]}`}>
                    {pod.status}
                  </span>
                </div>
                
                {/* Original PodCard component maintains compatibility with your backend */}
                <PodCard
                  title={pod.title}
                  status={pod.status}
                  neededRoles={pod.neededRoles}
                />
                
                {/* Enhanced information displayed outside the original component */}
                <div className={styles.podEnhancedInfo}>
                  <p className={styles.podDescription}>{pod.description}</p>
                  
                  <div className={styles.podStats}>
                    <div className={styles.podStatItem}>
                      <span className={styles.statValue}>{pod.contributors}</span>
                      <span className={styles.statLabel}>Contributors</span>
                    </div>
                    
                    <div className={styles.podStatItem}>
                      <div className={styles.progressWrapper}>
                        <div 
                          className={styles.progressBar} 
                          style={{ width: `${pod.completion}%` }}
                        />
                      </div>
                      <span className={styles.progressLabel}>{pod.completion}% Complete</span>
                    </div>
                  </div>
                  
                  <div className={styles.podActions}>
                    <motion.button 
                      className={styles.viewDetailsBtn}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      View Details
                    </motion.button>
                    <motion.button 
                      className={styles.joinPodBtn}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Join Pod
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className={styles.noPodsMessage}>
            No pods matching this filter. Check back later!
          </div>
        )}
      </motion.div>
      
      <motion.div 
        className={styles.viewAllContainer}
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <motion.button 
          className={styles.viewAllBtn}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Explore All Pods
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 3L14 8L8 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 8H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.button>
      </motion.div>
    </section>
  );
};

export default FeaturedPodsSection;