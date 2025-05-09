import React, { useState, useRef, useEffect } from 'react';
import styles from './PricingSection.module.scss';
import { motion, useInView, useAnimation, AnimatePresence } from 'framer-motion';
import {
  RocketIcon, 
  UsersIcon, 
  Target,
  Zap,
  Star,
  CheckCircle,
  XCircle,
  Award,
  Crown,
  BarChart3,
  Globe,
  TrendingUp,
  ArrowRight,
  Sparkles,
  BadgeCheck,
  Megaphone,
  X
} from 'lucide-react';

const PricingSection = () => {
  const [activeTab, setActiveTab] = useState('podCreator');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  
  const sectionRef = useRef(null);
  const modalRef = useRef(null);
  const inView = useInView(sectionRef, { once: false, threshold: 0.2 });
  const controls = useAnimation();

  // Pricing plan data
  const pricingData = {
    podCreator: {
      icon: <RocketIcon size={36} />,
      title: "Pod Creators",
      description: "Launch Pods, attract talent, build real products.",
      plans: [
        {
          name: "Free Tier",
          price: "0",
          features: [
            { text: "Launch 1 active Pod", included: true },
            { text: "Access to limited analytics", included: true },
            { text: "No priority placement", included: true },
            { text: "Basic matchmaking", included: true },
            { text: "Community support", included: true },
            { text: "Advanced analytics", included: false },
            { text: "Featured placement", included: false },
            { text: "Unlimited Pods", included: false },
            { text: "XP Boosts", included: false }
          ],
          color: "#6B5B95",
          recommended: false
        },
        {
          name: "Pro Creator",
          price: "19",
          features: [
            { text: "Launch unlimited Pods", included: true },
            { text: "Advanced analytics", included: true },
            { text: "Featured placement on Explore", included: true },
            { text: "Invite-only contributor unlocks", included: true },
            { text: "Escrow-based revenue splitting", included: true },
            { text: "XP Boosts for Contributors", included: true },
            { text: "Contribution heatmaps", included: true },
            { text: "Success prediction", included: true },
            { text: "Priority support", included: true }
          ],
          color: "#E8C547",
          recommended: true
        }
      ],
      color: "#E8C547",
      benefits: [
        "Full pod customization",
        "Leadership experience",
        "Higher reputation growth",
        "Portfolio showcasing"
      ]
    },
    contributor: {
      icon: <UsersIcon size={36} />,
      title: "Contributors",
      description: "Join Pods, build reputation, earn revenue share.",
      plans: [
        {
          name: "Free Tier",
          price: "0",
          features: [
            { text: "Join unlimited Pods", included: true },
            { text: "Log contributions", included: true },
            { text: "Earn rep and points", included: true },
            { text: "Basic profile", included: true },
            { text: "Community support", included: true },
            { text: "Boosted profile visibility", included: false },
            { text: "Priority Pod matching", included: false },
            { text: "Monthly analytics", included: false },
            { text: "Profile badges", included: false }
          ],
          color: "#4ECDC4",
          recommended: false
        },
        {
          name: "Pro Contributor",
          price: "9",
          features: [
            { text: "Join unlimited Pods", included: true },
            { text: "Boosted profile visibility", included: true },
            { text: "Priority matching to high-rep Pods", included: true },
            { text: "Monthly contribution analytics", included: true },
            { text: "Growth tips & mentoring", included: true },
            { text: "Redeemable XP → Store credits", included: true },
            { text: "Exclusive profile badges", included: true },
            { text: "Priority Pod applications", included: true },
            { text: "Early access to new Pods", included: true }
          ],
          color: "#3B82F6",
          recommended: true
        }
      ],
      color: "#3B82F6",
      benefits: [
        "Showcase technical work",
        "Collaborate with designers",
        "Build real-world products",
        "Earn through contributions"
      ]
    },
    booster: {
      icon: <Megaphone size={36} />,
      title: "Boosters",
      description: "Test, promote, amplify, and give feedback.",
      plans: [
        {
          name: "Free Tier",
          price: "0",
          features: [
            { text: "Support unlimited Pods", included: true },
            { text: "Gamified reward system", included: true },
            { text: "Earn XP for feedback", included: true },
            { text: "Social share incentives", included: true },
            { text: "Bug report rewards", included: true },
            { text: "Early access to Pods", included: false },
            { text: "Feature voting rights", included: false },
            { text: "Public supporter visibility", included: false },
            { text: "Pod priority list inclusion", included: false }
          ],
          color: "#F59E0B",
          recommended: false
        },
        {
          name: "Booster Plus",
          price: "4",
          features: [
            { text: "Support unlimited Pods", included: true },
            { text: "Gamified reward system", included: true },
            { text: "Early access to Pods for testing", included: true },
            { text: "Feature voting rights", included: true },
            { text: "Badge + public supporter visibility", included: true },
            { text: "Pod priority list inclusion", included: true },
            { text: "Exclusive feedback sessions", included: true },
            { text: "Amplified reward multipliers", included: true },
            { text: "Recognition on Pod pages", included: true }
          ],
          color: "#EC4899",
          recommended: true
        }
      ],
      color: "#EC4899",
      benefits: [
        "Test innovative products",
        "Provide valuable feedback",
        "Earn rewards through promotion",
        "Early access to trending Pods"
      ]
    }
  };

  // Animation variants
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

  const cardVariants = {
    hidden: { 
      y: 20, 
      opacity: 0 
    },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    },
    hover: {
      y: -10,
      boxShadow: "0px 25px 50px rgba(0, 0, 0, 0.3)",
      transition: { duration: 0.3 }
    }
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1], // Custom easing
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.3,
        ease: [0.36, 0, 0.66, -0.56], // Custom easing
      }
    }
  };

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

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target) && isCompareModalOpen) {
        // Make sure we're not clicking on the compare button itself
        if (!event.target.closest(`.${styles.compareButton}`)) {
          setIsCompareModalOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isCompareModalOpen]);

  // Close modal on escape key
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && isCompareModalOpen) {
        setIsCompareModalOpen(false);
        // Add a small delay to re-enable click handlers
        setTimeout(() => {
          const compareBtn = document.querySelector(`.${styles.compareButton}`);
          if (compareBtn) {
            compareBtn.style.pointerEvents = 'auto';
          }
        }, 100);
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [isCompareModalOpen]);

  // Prevent body scroll when modal is open and handle button re-enabling
  useEffect(() => {
    if (isCompareModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      // Re-enable the compare button when modal closes
      setTimeout(() => {
        const compareBtn = document.querySelector(`.${styles.compareButton}`);
        if (compareBtn) {
          compareBtn.style.pointerEvents = 'auto';
        }
      }, 100);
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isCompareModalOpen]);

  // Function to handle opening the compare modal
  const handleCompareClick = (e) => {
    e.stopPropagation(); // Prevent event from bubbling
    setIsCompareModalOpen(true);
  };

  // Get all unique features for comparison
  const getAllUniqueFeatures = () => {
    const featuresSet = new Set();
    
    Object.keys(pricingData).forEach(roleKey => {
      pricingData[roleKey].plans.forEach(plan => {
        plan.features.forEach(feature => {
          featuresSet.add(feature.text);
        });
      });
    });
    
    return Array.from(featuresSet);
  };

  // Check if a plan has a specific feature
  const planHasFeature = (roleKey, planIndex, featureText) => {
    const plan = pricingData[roleKey].plans[planIndex];
    const feature = plan.features.find(f => f.text === featureText);
    return feature ? feature.included : false;
  };

  return (
    <section className={styles.pricingSection} ref={sectionRef}>
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
      <motion.div
        className={`${styles.floatingShape} ${styles.shape3}`}
        animate={{
          x: [0, 10, 0],
          y: [0, 10, 0],
          rotate: [0, 15, 0],
        }}
        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1 }}
      />
      
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className={styles.sectionHeader}
      >
        <div className={styles.badgeWrapper}>
          <span className={styles.badge}>Pricing Plans</span>
        </div>
        <h2 className={styles.sectionTitle}>
          Choose Your <span className={styles.highlight}>PODNEX</span> Path
        </h2>
        <p className={styles.sectionSubtitle}>
          Select the plan that aligns with your role and ambitions in our collaborative ecosystem
        </p>
      </motion.div>

      {/* Tab Selector */}
      <motion.div 
        className={styles.tabSelector}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <motion.button 
          className={`${styles.tabButton} ${activeTab === 'podCreator' ? styles.activeTab : ''}`}
          variants={tabVariants}
          animate={activeTab === 'podCreator' ? 'active' : 'inactive'}
          onClick={() => setActiveTab('podCreator')}
          style={activeTab === 'podCreator' ? {backgroundColor: `${pricingData.podCreator.color}20`, borderColor: `${pricingData.podCreator.color}40`, color: pricingData.podCreator.color} : {}}
        >
          <RocketIcon size={18} />
          Pod Creators
        </motion.button>
        
        <motion.button 
          className={`${styles.tabButton} ${activeTab === 'contributor' ? styles.activeTab : ''}`}
          variants={tabVariants}
          animate={activeTab === 'contributor' ? 'active' : 'inactive'}
          onClick={() => setActiveTab('contributor')}
          style={activeTab === 'contributor' ? {backgroundColor: `${pricingData.contributor.color}20`, borderColor: `${pricingData.contributor.color}40`, color: pricingData.contributor.color} : {}}
        >
          <UsersIcon size={18} />
          Contributors
        </motion.button>
        
        <motion.button 
          className={`${styles.tabButton} ${activeTab === 'booster' ? styles.activeTab : ''}`}
          variants={tabVariants}
          animate={activeTab === 'booster' ? 'active' : 'inactive'}
          onClick={() => setActiveTab('booster')}
          style={activeTab === 'booster' ? {backgroundColor: `${pricingData.booster.color}20`, borderColor: `${pricingData.booster.color}40`, color: pricingData.booster.color} : {}}
        >
          <Megaphone size={18} />
          Boosters
        </motion.button>
      </motion.div>

      <AnimatePresence mode="wait">
        {Object.keys(pricingData).map((key) => (
          activeTab === key && (
            <motion.div 
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className={styles.pricingView}
            >
              <motion.div
                className={styles.roleIntro}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div 
                  className={styles.roleIconContainer}
                  style={{ backgroundColor: `${pricingData[key].color}20`, color: pricingData[key].color }}
                >
                  {pricingData[key].icon}
                </div>
                <h3>{pricingData[key].title}</h3>
                <p>{pricingData[key].description}</p>
                
                <div className={styles.roleBenefits}>
                  {pricingData[key].benefits.map((benefit, index) => (
                    <motion.div 
                      key={index}
                      className={styles.benefitTag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + (index * 0.1) }}
                      style={{ backgroundColor: `${pricingData[key].color}15`, color: pricingData[key].color }}
                    >
                      <Star size={14} />
                      {benefit}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              
              <div className={styles.pricingCardsContainer}>
                <motion.div 
                  className={styles.pricingCards}
                  variants={container}
                  initial="hidden"
                  animate="visible"
                >
                  {pricingData[key].plans.map((plan, index) => (
                    <motion.div 
                      key={index} 
                      className={`${styles.pricingCard} ${plan.recommended ? styles.recommended : ''}`}
                      variants={cardVariants}
                      whileHover="hover"
                      onHoverStart={() => setHoveredCard(`${key}-${index}`)}
                      onHoverEnd={() => setHoveredCard(null)}
                      style={{
                        borderColor: hoveredCard === `${key}-${index}` || plan.recommended ? `${plan.color}50` : 'rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      {plan.recommended && (
                        <div 
                          className={styles.recommendedTag}
                          style={{ backgroundColor: plan.color }}
                        >
                          <Crown size={14} />
                          Recommended
                        </div>
                      )}
                      
                      <div className={styles.planHeader}>
                        <h3 className={styles.planName}>{plan.name}</h3>
                        <div className={styles.planPrice}>
                          <span className={styles.currency}>$</span>
                          <span className={styles.amount}>{plan.price}</span>
                          <span className={styles.period}>/month</span>
                        </div>
                      </div>
                      
                      <div className={styles.planFeatures}>
                        {plan.features.map((feature, i) => (
                          <motion.div 
                            key={i}
                            className={styles.featureItem}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + (i * 0.05) }}
                          >
                            {feature.included ? 
                              <CheckCircle size={18} className={styles.featureIncluded} style={{ color: plan.color }} /> :
                              <XCircle size={18} className={styles.featureExcluded} />
                            }
                            <span className={feature.included ? '' : styles.featureMuted}>{feature.text}</span>
                          </motion.div>
                        ))}
                      </div>
                      
                      <motion.button 
                        className={styles.planButton}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{ 
                          backgroundColor: plan.recommended ? plan.color : 'transparent',
                          color: plan.recommended ? '#000' : plan.color,
                          borderColor: plan.color
                        }}
                      >
                        {plan.price === "0" ? "Get Started" : "Subscribe"}
                        <ArrowRight size={16} />
                      </motion.button>
                      
                      {/* Glow effect on hover */}
                      <div 
                        className={styles.cardGlow}
                        style={{ 
                          backgroundColor: plan.color,
                          opacity: hoveredCard === `${key}-${index}` ? 0.07 : 0 
                        }}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
              
              <motion.div 
                className={styles.compareBenefits}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <div className={styles.benefitHeader}>
                  <BadgeCheck size={20} style={{ color: pricingData[key].color }} />
                  <h4>All plans include:</h4>
                </div>
                <div className={styles.benefitGrid}>
                  <div className={styles.benefitItem}>
                    <div className={styles.benefitIcon} style={{ backgroundColor: `${pricingData[key].color}15`, color: pricingData[key].color }}>
                      <Globe size={20} />
                    </div>
                    <h5>Global Community</h5>
                    <p>Connect with creators from around the world</p>
                  </div>
                  <div className={styles.benefitItem}>
                    <div className={styles.benefitIcon} style={{ backgroundColor: `${pricingData[key].color}15`, color: pricingData[key].color }}>
                      <TrendingUp size={20} />
                    </div>
                    <h5>Reputation System</h5>
                    <p>Build your credibility through contributions</p>
                  </div>
                  <div className={styles.benefitItem}>
                    <div className={styles.benefitIcon} style={{ backgroundColor: `${pricingData[key].color}15`, color: pricingData[key].color }}>
                      <BarChart3 size={20} />
                    </div>
                    <h5>Transparent Metrics</h5>
                    <p>Track your progress with clear analytics</p>
                  </div>
                  <div className={styles.benefitItem}>
                    <div className={styles.benefitIcon} style={{ backgroundColor: `${pricingData[key].color}15`, color: pricingData[key].color }}>
                      <Sparkles size={20} />
                    </div>
                    <h5>Skills Development</h5>
                    <p>Grow your capabilities through real projects</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )
        ))}
      </AnimatePresence>

      {/* CTA Section */}
      <motion.div 
        className={styles.ctaContainer}
        initial={{ opacity: 0, y: 30 }}
        animate={controls}
        variants={{
          visible: { opacity: 1, y: 0, transition: { delay: 0.6, duration: 0.8 } }
        }}
      >
        <div className={styles.ctaContent}>
          <h3>Start Your PODNEX Journey</h3>
          <p>Join our ecosystem of creators and contributors today</p>
        </div>
        <motion.button 
          className={styles.ctaButton}
          whileHover={{ scale: 1.05, backgroundColor: "#E8C547" }}
          whileTap={{ scale: 0.95 }}
        >
          Sign Up Now
          <ArrowRight size={20} />
        </motion.button>
      </motion.div>
      
      {/* Compare Plans Button */}
      <motion.button
        className={styles.compareButton}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        whileHover={{ y: -5 }}
        onClick={handleCompareClick}
        id="compare-all-plans-button"
      >
        <Award size={18} />
        Compare All Plans
      </motion.button>
      
      {/* Compare Modal */}
      <AnimatePresence>
        {isCompareModalOpen && (
          <motion.div 
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onAnimationComplete={(definition) => {
              // Re-enable compare button when modal animation completes
              if (definition === "exit") {
                const compareBtn = document.querySelector(`.${styles.compareButton}`);
                if (compareBtn) {
                  compareBtn.style.pointerEvents = 'auto';
                }
              }
            }}
          >
            <motion.div 
              className={styles.compareModal}
              ref={modalRef}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className={styles.modalHeader}>
                <h3>Compare All Plans</h3>
                <button 
                  className={styles.closeModalButton} 
                  onClick={() => {
                    setIsCompareModalOpen(false);
                    // Ensure the compare button is clickable again
                    setTimeout(() => {
                      const compareBtn = document.querySelector(`.${styles.compareButton}`);
                      if (compareBtn) {
                        compareBtn.style.pointerEvents = 'auto';
                      }
                    }, 100);
                  }}
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className={styles.compareTableWrapper}>
                <table className={styles.compareTable}>
                  <thead>
                    <tr>
                      <th className={styles.featureColumn}>Features</th>
                      {Object.keys(pricingData).map(roleKey => (
                        pricingData[roleKey].plans.map((plan, planIndex) => (
                          <th 
                            key={`${roleKey}-${planIndex}`}
                            className={plan.recommended ? styles.recommendedColumn : ''}
                            style={{ 
                              borderColor: plan.recommended ? `${plan.color}50` : 'transparent',
                              backgroundColor: plan.recommended ? `${plan.color}10` : 'transparent' 
                            }}
                          >
                            <div className={styles.planColumnHeader}>
                              {plan.recommended && (
                                <div className={styles.recommendedPill} style={{ backgroundColor: plan.color }}>
                                  <Crown size={12} />
                                  Recommended
                                </div>
                              )}
                              <div className={styles.roleIndicator} style={{ color: pricingData[roleKey].color }}>
                                {roleKey === 'podCreator' ? (
                                  <RocketIcon size={14} />
                                ) : roleKey === 'contributor' ? (
                                  <UsersIcon size={14} />
                                ) : (
                                  <Megaphone size={14} />
                                )}
                                {pricingData[roleKey].title}
                              </div>
                              <div className={styles.planTitleCompare}>{plan.name}</div>
                              <div className={styles.planPriceCompare}>
                                <span className={styles.currencyCompare}>$</span>
                                <span className={styles.amountCompare}>{plan.price}</span>
                                <span className={styles.periodCompare}>/mo</span>
                              </div>
                            </div>
                          </th>
                        ))
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {getAllUniqueFeatures().map((feature, index) => (
                      <tr key={index} className={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
                        <td className={styles.featureColumn}>{feature}</td>
                        {Object.keys(pricingData).map(roleKey => (
                          pricingData[roleKey].plans.map((plan, planIndex) => {
                            const hasFeature = planHasFeature(roleKey, planIndex, feature);
                            return (
                              <td 
                                key={`${roleKey}-${planIndex}`}
                                className={plan.recommended ? styles.recommendedColumn : ''}
                              >
                                {hasFeature ? (
                                  <CheckCircle size={18} className={styles.featureIncludedCompare} style={{ color: plan.color }} />
                                ) : (
                                  <XCircle size={18} className={styles.featureExcludedCompare} />
                                )}
                              </td>
                            );
                          })
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className={styles.modalActions}>
                <motion.button 
                  className={styles.modalCloseButton}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setIsCompareModalOpen(false);
                    // Ensure the compare button is clickable again
                    setTimeout(() => {
                      const compareBtn = document.querySelector(`.${styles.compareButton}`);
                      if (compareBtn) {
                        compareBtn.style.pointerEvents = 'auto';
                      }
                    }, 100);
                  }}
                >
                  Close Comparison
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default PricingSection;