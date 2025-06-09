import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, 
  Users, 
  ArrowRight, 
  Star, 
  ChevronDown, 
  Zap,
  Briefcase,
  TrendingUp,
  BarChart,
  Lock,
  Sparkles
} from 'lucide-react';
import styles from './HeroSection.module.scss';
import PodCreationDemo from './PodCreationDemo'; // New import


const HeroSection = () => {
  // State management
  const [email, setEmail] = useState('');
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showPitch, setShowPitch] = useState(false);
  const [showPodDemo, setShowPodDemo] = useState(false); // Add this new state

  
  // Refs
  const sectionRef = useRef(null);
  
  // Core benefits - key selling points
  const coreBenefits = [
    {
      title: "Build Together",
      description: "Create collaborative teams with transparent contribution tracking",
      icon: <Users size={20} />,
      color: "#3B82F6"
    },
    {
      title: "Launch Products",
      description: "Take ideas to market with combined skills and resources",
      icon: <Rocket size={20} />,
      color: "#EC4899"
    },
    {
      title: "Share Revenue",
      description: "Earn based on your verified contributions",
      icon: <BarChart size={20} />,
      color: "#10B981"
    },
    {
      title: "Build Reputation",
      description: "Showcase your real work and impact",
      icon: <Star size={20} />,
      color: "#F59E0B"
    }
  ];

  // Mouse parallax effect for grid background
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
  
  // Show pitch after slight delay for marketing impact
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPitch(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setShowModal(true);
    }
  };
  
  // Scroll to next section without auto-scroll issues
  const scrollToNextSection = () => {
    if (sectionRef.current) {
      const nextSection = sectionRef.current.nextElementSibling;
      if (nextSection) {
        // Using scrollIntoView with options to avoid auto-scroll issues
        nextSection.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start'
        });
        
        // Prevent default scroll events temporarily
        const preventScroll = (e) => {
          e.preventDefault();
        };
        
        window.addEventListener('wheel', preventScroll, { passive: false });
        window.addEventListener('touchmove', preventScroll, { passive: false });
        
        // Remove event listeners after animation completes
        setTimeout(() => {
          window.removeEventListener('wheel', preventScroll);
          window.removeEventListener('touchmove', preventScroll);
        }, 1000);
      }
    }
  };
  
  return (
    <section ref={sectionRef} className={styles.hero}>
      {/* Animated grid background with parallax */}
      <div 
        className={styles.gridBackground}
        style={{
          transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`,
        }}
      />
      
      {/* Animated blob shapes for visual interest */}
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
      <div className={styles.heroContent}>
        <div className={styles.heroMainSection}>
          {/* Left column: main headline, description, and CTAs */}
          <div className={styles.heroMainContent}>
            {/* Clear primary brand badge */}
            <motion.div 
              className={styles.badgeWrapper}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <span className={styles.badge}>
                <Zap size={14} className={styles.badgeIcon} />
                <span>Creator Collaboration Ecosystem</span>
              </span>
            </motion.div>
            
            {/* Bold, clear primary headline */}
            <motion.h1
              className={styles.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <span>Form a Pod.</span>
              <br />
              <span className={styles.highlight}>Build & Launch.</span>
              <br />
              <span>Share Revenue.</span>
            </motion.h1>
            
            {/* Clear, concise value proposition */}
            <motion.p
              className={styles.mainSubtitle}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              PODNEX connects creators in collaborative teams called "Pods" to build, launch, and earn together. 
            Every contribution is tracked, validated, and tied directly to revenue.
          </motion.p>
            {/* Primary & secondary CTAs */}
            <motion.div 
    className={styles.actions}
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.8, duration: 0.8 }}
  >
    <motion.a 
      href="/register"
      className={styles.primaryBtn}
      whileHover={{ scale: 1.05, backgroundColor: "#E8C547" }}
      whileTap={{ scale: 0.95 }}
    >
      Start a Pod
      <ArrowRight size={18} />
    </motion.a>
    
    <motion.button 
      onClick={() => setShowPodDemo(true)} // Add this onClick handler
      className={styles.demoBtn}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      Try It Now
      <Sparkles size={18} />
    </motion.button>
    
    <motion.a 
      href="/explore"
      className={styles.secondaryBtn}
      whileHover={{ scale: 1.05, borderColor: "#E8C547", color: "#E8C547" }}
      whileTap={{ scale: 0.95 }}
    >
      Explore Pods
    </motion.a>
  </motion.div>
            
            {/* Quick benefits immediately visible */}
            <motion.div 
              className={styles.quickBenefits}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              {coreBenefits.map((benefit, index) => (
                <motion.div 
                  key={index}
                  className={styles.benefitItem}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + (index * 0.1), duration: 0.4 }}
                >
                  <div className={styles.benefitIcon} style={{ color: benefit.color, backgroundColor: `${benefit.color}15` }}>
                    {benefit.icon}
                  </div>
                  <div className={styles.benefitText}>
                    <h4>{benefit.title}</h4>
                    <p>{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
          
          {/* Right column: platform stats, testimonial, or email signup */}
          <div className={styles.heroVisualContent}>
            {/* Platform stats cards */}
            <motion.div 
              className={styles.statsCards}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <div className={styles.statCard} style={{ '--stat-color': '#3B82F6' }}>
                <div className={styles.statIcon}>
                  <Users size={24} />
                </div>
                <div className={styles.statContent}>
                  <span className={styles.statNumber}>250+</span>
                  <span className={styles.statLabel}>Active Pods</span>
                </div>
              </div>
              
              <div className={styles.statCard} style={{ '--stat-color': '#EC4899' }}>
                <div className={styles.statIcon}>
                  <Briefcase size={24} />
                </div>
                <div className={styles.statContent}>
                  <span className={styles.statNumber}>120+</span>
                  <span className={styles.statLabel}>Products Launched</span>
                </div>
              </div>
              
              <div className={styles.statCard} style={{ '--stat-color': '#10B981' }}>
                <div className={styles.statIcon}>
                  <TrendingUp size={24} />
                </div>
                <div className={styles.statContent}>
                  <span className={styles.statNumber}>$1.2M+</span>
                  <span className={styles.statLabel}>Creator Revenue</span>
                </div>
              </div>
            </motion.div>
            
            {/* Email signup for early access */}
            <AnimatePresence>
              {showPitch && (
                <motion.div 
                  className={styles.emailPitch}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                >
                  <div className={styles.pitchContent}>
                    <div className={styles.pitchBadge}>
                      <Lock size={14} />
                      <span>Private Beta Access</span>
                    </div>
                    <h3>Join the next generation of creative collaboration</h3>
                    <form className={styles.emailCaptureForm} onSubmit={handleSubmit}>
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
                        <button type="submit" className={styles.submitBtn}>
                          Get Early Access
                        </button>
                      </div>
                    </form>
                    <div className={styles.emailStatus}>
                      <div className={styles.statusBar}>
                        <div className={styles.statusFill}></div>
                      </div>
                      <div className={styles.statusText}>
                        <Sparkles size={14} className={styles.statusIcon} />
                        <span>68% of beta spots remaining</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Social proof section */}
            <motion.div 
              className={styles.testimonialCard}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.8 }}
            >
              <div className={styles.testimonialContent}>
                "PODNEX completely changed how I collaborate. My contributions are recognized, and I'm earning real revenue from my work."
              </div>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar}></div>
                <div className={styles.authorInfo}>
                  <span className={styles.authorName}>Sarah Chen</span>
                  <span className={styles.authorRole}>Product Designer</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
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
            <div className={styles.modalIcon}>
              <Star size={48} />
            </div>
            <h3>You're on the waitlist!</h3>
            <p>We'll notify you as soon as your exclusive PODNEX access is ready.</p>
            <p className={styles.emailConfirm}>{email}</p>
            <div className={styles.referralBonus}>
              <div className={styles.referralIcon}>
                <Zap size={16} />
              </div>
              <div className={styles.referralText}>
                <h4>Want priority access?</h4>
                <p>Refer 3 friends and jump to the top of the waitlist!</p>
              </div>
            </div>
            <div className={styles.modalActions}>
              <motion.button 
                onClick={() => setShowModal(false)}
                className={styles.primaryModalBtn}
                whileHover={{ scale: 1.05, backgroundColor: "#E8C547" }}
                whileTap={{ scale: 0.95 }}
              >
                Share & Earn Priority
                <ArrowRight size={16} />
              </motion.button>
              <motion.button 
                onClick={() => setShowModal(false)}
                className={styles.secondaryModalBtn}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Continue Exploring
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

{/* Add this to the end of your return statement */}
<AnimatePresence>
  {showPodDemo && (
    <motion.div 
      className={styles.demoOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => {
        // Close modal when clicking outside
        if (e.target === e.currentTarget) setShowPodDemo(false);
      }}
    >
      <motion.div 
        className={styles.demoContainer}
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }}
        transition={{ type: "spring", damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        <PodCreationDemo onClose={() => setShowPodDemo(false)} />
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

    </section>
  );
};

export default HeroSection;