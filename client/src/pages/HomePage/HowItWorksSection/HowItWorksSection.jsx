import React, { useState, useRef, useEffect } from 'react';
import styles from './HowItWorksSection.module.scss';
import { motion, useInView, useAnimation, AnimatePresence } from 'framer-motion';
import { RocketIcon, UsersIcon, HammerIcon, ChevronRight, ChevronDown } from 'lucide-react';

const HowItWorksSection = () => {
  const [activeStep, setActiveStep] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: false, threshold: 0.2 });
  const controls = useAnimation();

  // Steps data with expanded details
  const steps = [
    {
      icon: <UsersIcon size={48} />,
      title: 'Join or Create a Pod',
      description: 'Jump into an existing Pod or launch your own to start building bold ideas.',
      details: [
        'Browse trending Pods in the explore page',
        'Apply to join with your skills and experience',
        'Create your own Pod with just a mission and needed roles',
        'Invite collaborators from your network'
      ],
      color: '#6B5B95'
    },
    {
      icon: <HammerIcon size={48} />,
      title: 'Collaborate and Build',
      description: 'Contribute, create, and grow your Pod with real work tracked transparently.',
      details: [
        'Track contributions in real-time',
        'Validate completed work with peer reviews',
        'Build reputation through consistent delivery',
        'Share progress updates with the community'
      ],
      color: '#4ECDC4'
    },
    {
      icon: <RocketIcon size={48} />,
      title: 'Launch to the World',
      description: 'Go live with your product, service, or movement — fully backed by your team.',
      details: [
        'Build a Pod storefront to showcase your work',
        'Set up revenue splits based on contributions',
        'Generate contracts between collaborators',
        'Collect payments through built-in systems'
      ],
      color: '#E8C547'
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, inView]);

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

  const toggleStep = (index) => {
    setActiveStep(activeStep === index ? null : index);
  };

  return (
    <section className={styles.howItWorks} ref={sectionRef}>
      <div 
        className={styles.gridBackground}
        style={{
          transform: `translate(${mousePosition.x * 15}px, ${mousePosition.y * 15}px)`,
        }}
      />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className={styles.sectionHeader}
      >
        <div className={styles.badgeWrapper}>
          <span className={styles.badge}>The Process</span>
        </div>
        <h2 className={styles.sectionTitle}>
          How It <span className={styles.highlight}>Works</span>
        </h2>
        <p className={styles.sectionSubtitle}>
          Three simple steps to turn your ideas into reality with your dream team
        </p>
      </motion.div>

      <motion.div 
        className={styles.stepsContainer}
        variants={container}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <div className={styles.progressLine}>
          {steps.map((_, index) => (
            <React.Fragment key={`node-${index}`}>
              <motion.div 
                className={`${styles.progressNode} ${activeStep === index ? styles.active : ''}`}
                variants={item}
                whileHover={{ scale: 1.2 }}
                style={{ backgroundColor: activeStep === index ? steps[index].color : '' }}
              />
              {index < steps.length - 1 && (
                <motion.div 
                  className={styles.progressConnector}
                  variants={item}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className={styles.stepsGrid}>
          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              className={`${styles.stepCard} ${activeStep === index ? styles.active : ''}`}
              variants={item}
              whileHover={{ y: -5 }}
              onClick={() => toggleStep(index)}
            >
              <motion.div 
                className={styles.iconContainer}
                style={{ backgroundColor: activeStep === index ? step.color : 'rgba(255, 255, 255, 0.05)' }}
                whileHover={{ rotate: 5 }}
              >
                <motion.div 
                  className={styles.icon}
                  style={{ color: activeStep === index ? '#000' : step.color }}
                >
                  {step.icon}
                </motion.div>
              </motion.div>
              
              <div className={styles.stepContent}>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                
                <motion.div 
                  className={styles.expandButton}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {activeStep === index ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </motion.div>
              </div>

              <AnimatePresence>
                {activeStep === index && (
                  <motion.div 
                    className={styles.detailsContainer}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ul>
                      {step.details.map((detail, i) => (
                        <motion.li 
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          {detail}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div 
        className={styles.ctaContainer}
        initial={{ opacity: 0, y: 30 }}
        animate={controls}
        variants={{
          visible: { opacity: 1, y: 0, transition: { delay: 0.6, duration: 0.8 } }
        }}
      >
        <motion.button 
          className={styles.ctaButton}
          whileHover={{ scale: 1.05, backgroundColor: "#E8C547" }}
          whileTap={{ scale: 0.95 }}
        >
          Start Building Today
        </motion.button>
      </motion.div>

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
    </section>
  );
};

export default HowItWorksSection;