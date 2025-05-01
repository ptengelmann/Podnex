import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Rocket, Award, Globe, ArrowRight, Github, ChevronDown } from 'lucide-react';
import styles from './HeroSection.module.scss';

const HeroSection = () => {
  const [email, setEmail] = useState('');
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentValueProp, setCurrentValueProp] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isTyping, setIsTyping] = useState(true);
  const [currentWord, setCurrentWord] = useState(0);
  const [typedText, setTypedText] = useState('');
  
  const sectionRef = useRef(null);
  
  // Value propositions that will rotate
  const valueProps = [
    "Build real products with verified contributors.",
    "Reputation is the foundation of opportunity.",
    "No fake equity, only real ownership.",
    "Systems outperform tools and hustle."
  ];
  
  // Words that will be typed in animation
  const boldWords = ['Bold', 'Together', 'Transparently'];
  
  // Animation interval for value props
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentValueProp((prev) => (prev + 1) % valueProps.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [valueProps.length]);
  
  // Mouse movement effect for grid background
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
  
  // Typewriter effect
  useEffect(() => {
    if (!isTyping) return;
    
    const word = boldWords[currentWord];
    
    if (typedText.length < word.length) {
      const timeout = setTimeout(() => {
        setTypedText(word.substring(0, typedText.length + 1));
      }, 150);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setIsTyping(false);
        setTimeout(() => {
          setTypedText('');
          setCurrentWord((currentWord + 1) % boldWords.length);
          setIsTyping(true);
        }, 1500);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [typedText, isTyping, currentWord]);
  
  // Form submission handler
  const handleSubmit = () => {
    if (email) {
      setShowModal(true);
    }
  };
  
  // Scroll to next section
  const scrollToNextSection = () => {
    if (sectionRef.current) {
      window.scrollTo({
        top: sectionRef.current.offsetHeight,
        behavior: 'smooth'
      });
    }
  };
  
  return (
    <section ref={sectionRef} className={styles.hero}>
      {/* Animated grid background */}
      <div 
        className={styles.gridBackground}
        style={{
          transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`,
        }}
      />
      
      {/* Floating animated shapes */}
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
      
      {/* Main hero content container */}
      <motion.div
        className={styles.heroContent}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Badge */}
        <motion.div 
          className={styles.badgeWrapper}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <span className={styles.badge}>The Creator-Driven Ecosystem</span>
        </motion.div>
        
        {/* Main heading */}
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Build <span className={styles.highlight}>
            <span className={isTyping ? styles.typewriterText : ''}>{typedText}</span>
          </span>
          <br />
          Ideas With Real People
        </motion.h1>
        
        {/* Animated value propositions */}
        <div className={styles.valuePropsContainer}>
          <AnimatePresence mode="wait">
            <motion.p
              key={currentValueProp}
              className={styles.valueProp}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {valueProps[currentValueProp]}
            </motion.p>
          </AnimatePresence>
          
          {/* Indicator dots */}
          <div className={styles.indicatorContainer}>
            {valueProps.map((_, index) => (
              <div 
                key={index} 
                className={`${styles.indicator} ${currentValueProp === index ? styles.active : ''}`}
                onClick={() => setCurrentValueProp(index)}
              />
            ))}
          </div>
        </div>
        
        {/* Email signup */}
        <motion.div 
          className={styles.ctaFunnel}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <div className={styles.emailCaptureForm}>
            <div className={`${styles.inputWrapper} ${isEmailFocused ? styles.focused : ''}`}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
              />
              <button 
                onClick={handleSubmit} 
                className={styles.submitBtn}
              >
                Get Early Access
              </button>
            </div>
          </div>
        </motion.div>
        
        {/* Action buttons */}
        <motion.div 
          className={styles.actions}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <motion.a 
            href="/register"
            className={styles.primaryBtn}
            whileHover={{ scale: 1.05, backgroundColor: "#E8C547" }}
            whileTap={{ scale: 0.95 }}
          >
            Start Your Pod
          </motion.a>
          
          <motion.a 
            href="/explore"
            className={styles.secondaryBtn}
            whileHover={{ scale: 1.05, borderColor: "#E8C547", color: "#E8C547" }}
            whileTap={{ scale: 0.95 }}
          >
            Explore Pods
          </motion.a>
        </motion.div>
        
        {/* Features highlight row */}
        <motion.div 
          className={styles.featuresRow}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <motion.div 
            className={styles.featureItem}
            whileHover={{ 
              scale: 1.1, 
              backgroundColor: "rgba(232, 197, 71, 0.1)",
              y: -2
            }}
          >
            <motion.div
              whileHover={{ rotate: 15 }}
              animate={{ 
                scale: [1, 1.15, 1],
                rotate: [0, 0, 0]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 3,
                repeatDelay: 1
              }}
            >
              <Award size={18} className={styles.featureIcon} />
            </motion.div>
            <span>No fake equity</span>
          </motion.div>
          
          <motion.div 
            className={styles.featureItem}
            whileHover={{ 
              scale: 1.1, 
              backgroundColor: "rgba(232, 197, 71, 0.1)",
              y: -2
            }}
          >
            <motion.div
              whileHover={{ rotate: 15 }}
              animate={{ 
                y: [0, -3, 0],
                scale: [1, 1.15, 1]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 3,
                repeatDelay: 1.5,
                delay: 0.5
              }}
            >
              <Rocket size={18} className={styles.featureIcon} />
            </motion.div>
            <span>Launch-focused Pods</span>
          </motion.div>
          
          <motion.div 
            className={styles.featureItem}
            whileHover={{ 
              scale: 1.1, 
              backgroundColor: "rgba(232, 197, 71, 0.1)",
              y: -2
            }}
          >
            <motion.div
              whileHover={{ rotate: 15 }}
              animate={{ 
                scale: [1, 1.15, 1],
                x: [0, 3, 0]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 3,
                repeatDelay: 1,
                delay: 1
              }}
            >
              <Users size={18} className={styles.featureIcon} />
            </motion.div>
            <span>Transparent XP & rep</span>
          </motion.div>
          
          <motion.div 
            className={styles.featureItem}
            whileHover={{ 
              scale: 1.1, 
              backgroundColor: "rgba(232, 197, 71, 0.1)",
              y: -2
            }}
          >
            <motion.div
              whileHover={{ rotate: 15 }}
              animate={{ 
                rotate: [0, 360, 360],
                scale: [1, 1.15, 1]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 5,
                repeatDelay: 2,
                delay: 1.5,
                ease: "easeInOut" 
              }}
            >
              <Globe size={18} className={styles.featureIcon} />
            </motion.div>
            <span>Built in public</span>
          </motion.div>
        </motion.div>
        
        {/* Social proof section */}
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
            <p>
              <span>250+</span> Creators have launched Pods
            </p>
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
        
        {/* GitHub link - Positioned within the social proof section */}
        <motion.a
          href="https://github.com/ptengelmann/Podnex"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.githubLink}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          whileHover={{ 
            scale: 1.05,
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            color: "#E8C547"
          }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div 
            className={styles.githubIconWrapper}
            whileHover={{ rotate: 15 }}
          >
            <Github size={24} className={styles.githubIcon} />
          </motion.div>
          <span>View on GitHub</span>
          <motion.div
            animate={{ x: [0, 3, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <ArrowRight size={16} />
          </motion.div>
        </motion.a>
      </motion.div>
      
      {/* Scroll indicator */}
      <motion.div 
        className={styles.scrollIndicator}
        animate={{ 
          y: [0, 10, 0],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{ repeat: Infinity, duration: 2 }}
        onClick={scrollToNextSection}
      >
        <ChevronDown size={24} />
      </motion.div>
      
      {/* Success modal */}
      {showModal && (
        <div className={styles.modal}>
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
              onClick={() => setShowModal(false)}
              className={styles.closeBtn}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Continue Exploring
            </motion.button>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;