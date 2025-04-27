import React, { useState, useEffect } from 'react';
import styles from './HeroSection.module.scss';
import { motion, AnimatePresence } from 'framer-motion';

const HeroSection = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState('');
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const valueProps = [
    "Creation is a team sport.",
    "Reputation is the foundation of opportunity.",
    "Systems outperform tools and hustle.",
    "Ownership and visibility should be built-in, not gated."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % valueProps.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [valueProps.length]); // <-- Added valueProps.length to dependencies

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEmail('');
  };
  
  return (
    <section className={styles.hero}>
      <div 
        className={styles.gridBackground}
        style={{
          transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`,
        }}
      />
      
      <motion.div
        className={styles.heroContent}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div 
          className={styles.badgeWrapper}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <span className={styles.badge}>The Creator-Driven Ecosystem</span>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Build <span className={styles.highlight}>Bold</span>.<br />
          Build <span className={styles.highlight}>Together</span>.
        </motion.h1>

        <div className={styles.valuePropsContainer}>
          <AnimatePresence mode="wait">
            <motion.p
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className={styles.valueProp}
            >
              {valueProps[currentStep]}
            </motion.p>
          </AnimatePresence>
          
          <div className={styles.indicatorContainer}>
            {valueProps.map((_, index) => (
              <div 
                key={index} 
                className={`${styles.indicator} ${currentStep === index ? styles.active : ''}`}
                onClick={() => setCurrentStep(index)}
              />
            ))}
          </div>
        </div>
        
        <motion.div 
          className={styles.ctaFunnel}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <form onSubmit={handleSubmit} className={styles.emailCaptureForm}>
            <div className={`${styles.inputWrapper} ${isEmailFocused ? styles.focused : ''}`}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
                required
              />
              <button type="submit" className={styles.submitBtn}>Get Early Access</button>
            </div>
          </form>
        </motion.div>
        
        <motion.div 
          className={styles.actions}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <motion.button 
            className={styles.primaryBtn}
            whileHover={{ scale: 1.05, backgroundColor: "#E8C547" }}
            whileTap={{ scale: 0.95 }}
          >
            Join Now
          </motion.button>
          <motion.button 
            className={styles.secondaryBtn}
            whileHover={{ scale: 1.05, borderColor: "#E8C547", color: "#E8C547" }}
            whileTap={{ scale: 0.95 }}
          >
            Explore Pods
          </motion.button>
        </motion.div>
        
        <motion.div 
          className={styles.socialProof}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.8 }}
        >
          <div className={styles.creators}>
            <div className={styles.avatarGroup}>
              {[1, 2, 3, 4, 5].map((num) => (
                <div key={num} className={styles.avatar} />
              ))}
            </div>
            <p><span>250+</span> Creators have launched Pods</p>
          </div>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.number}>120+</span>
              <span className={styles.label}>Live Products</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.number}>$1.2M</span>
              <span className={styles.label}>Creator Revenue</span>
            </div>
          </div>
        </motion.div>
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
      <motion.div
        className={`${styles.floatingShape} ${styles.shape3}`}
        animate={{
          x: [0, 25, 0],
          y: [0, 10, 0],
          rotate: [0, 15, 0],
        }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
      />

      <AnimatePresence>
        {showModal && (
          <motion.div 
            className={styles.modal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className={styles.modalContent}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h3>You're on the list!</h3>
              <p>We'll notify you as soon as PODNEX launches.</p>
              <p className={styles.emailConfirm}>{email}</p>
              <motion.button 
                onClick={closeModal}
                className={styles.closeBtn}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Continue Exploring
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className={styles.scrollIndicator}
        animate={{ 
          y: [0, 10, 0],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 10L12 15L17 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.div>
    </section>
  );
};

export default HeroSection;
