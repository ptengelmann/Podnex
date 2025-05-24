// PricingSection.jsx
import React, { useState, useRef, useEffect, useMemo } from 'react';
import styles from './PricingSection.module.scss';
import { motion, AnimatePresence, useInView } from 'framer-motion';
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
  X,
  ChevronDown,
  ChevronUp,
  Layers,
  Shield,
  Activity
} from 'lucide-react';

const PricingSection = () => {
  const [activeTab, setActiveTab] = useState('podCreator');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isComparing, setIsComparing] = useState(false);
  const [expandedFeatures, setExpandedFeatures] = useState({});
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'
  const [selectedPlans, setSelectedPlans] = useState({});
  
  const sectionRef = useRef(null);
  const cardsRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, threshold: 0.1 });

  // Pricing plan data
  const pricingData = {
    podCreator: {
      icon: <RocketIcon />,
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
      icon: <UsersIcon />,
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
      icon: <Megaphone />,
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

  // Initialize selected plans
  useEffect(() => {
    const initialSelectedPlans = {};
    Object.keys(pricingData).forEach(role => {
      initialSelectedPlans[role] = pricingData[role].plans.findIndex(plan => plan.recommended) || 0;
    });
    setSelectedPlans(initialSelectedPlans);
  }, []);

  // Toggle feature expansion
  const toggleFeatureExpansion = (roleKey, planIndex) => {
    const key = `${roleKey}-${planIndex}`;
    setExpandedFeatures(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Get all unique features for comparison
  const getAllFeatures = useMemo(() => {
    const featuresMap = {};
    
    Object.keys(pricingData).forEach(roleKey => {
      pricingData[roleKey].plans.forEach(plan => {
        plan.features.forEach(feature => {
          if (!featuresMap[feature.text]) {
            featuresMap[feature.text] = true;
          }
        });
      });
    });
    
    return Object.keys(featuresMap);
  }, [pricingData]);

  // Check if a plan has a specific feature
  const planHasFeature = (roleKey, planIndex, featureText) => {
    const plan = pricingData[roleKey].plans[planIndex];
    const feature = plan.features.find(f => f.text === featureText);
    return feature ? feature.included : false;
  };

  // Toggle comparison mode
  const toggleComparisonMode = () => {
    setIsComparing(prev => !prev);
    setViewMode(prev => prev === 'cards' ? 'table' : 'cards');
  };

  // Animation variants
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.1,
        duration: 0.6
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    },
    hover: {
      y: -10,
      boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3)",
      transition: { duration: 0.3 }
    }
  };

  const featureRowVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: "auto",
      transition: { duration: 0.3 }
    }
  };

  const tableVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.section 
      className={styles.pricingSection} 
      ref={sectionRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={sectionVariants}
    >
      {/* Background Elements */}
      <div className={styles.gridBackground} />
      <div className={styles.floatingShapes}>
        <motion.div 
          className={`${styles.floatingShape} ${styles.shape1}`}
          animate={{
            y: [0, -20, 0],
            x: [0, 15, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        />
        <motion.div 
          className={`${styles.floatingShape} ${styles.shape2}`}
          animate={{
            y: [0, 20, 0],
            x: [0, -15, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ repeat: Infinity, duration: 9, ease: "easeInOut" }}
        />
        <motion.div 
          className={`${styles.floatingShape} ${styles.shape3}`}
          animate={{
            y: [0, 15, 0],
            x: [0, 10, 0],
            rotate: [0, 8, 0]
          }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut", delay: 1 }}
        />
      </div>

      {/* Section Header */}
      <motion.div 
        className={styles.sectionHeader}
        variants={itemVariants}
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

      {/* View Mode Toggles */}
      <motion.div 
        className={styles.viewControls}
        variants={itemVariants}
      >
        <div className={styles.tabSelector}>
          <motion.button 
            className={`${styles.tabButton} ${activeTab === 'podCreator' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('podCreator')}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
            style={{
              backgroundColor: activeTab === 'podCreator' ? `${pricingData.podCreator.color}20` : '',
              borderColor: activeTab === 'podCreator' ? `${pricingData.podCreator.color}50` : '',
              color: activeTab === 'podCreator' ? pricingData.podCreator.color : ''
            }}
          >
            <RocketIcon size={18} />
            Pod Creators
          </motion.button>
          
          <motion.button 
            className={`${styles.tabButton} ${activeTab === 'contributor' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('contributor')}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
            style={{
              backgroundColor: activeTab === 'contributor' ? `${pricingData.contributor.color}20` : '',
              borderColor: activeTab === 'contributor' ? `${pricingData.contributor.color}50` : '',
              color: activeTab === 'contributor' ? pricingData.contributor.color : ''
            }}
          >
            <UsersIcon size={18} />
            Contributors
          </motion.button>
          
          <motion.button 
            className={`${styles.tabButton} ${activeTab === 'booster' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('booster')}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
            style={{
              backgroundColor: activeTab === 'booster' ? `${pricingData.booster.color}20` : '',
              borderColor: activeTab === 'booster' ? `${pricingData.booster.color}50` : '',
              color: activeTab === 'booster' ? pricingData.booster.color : ''
            }}
          >
            <Megaphone size={18} />
            Boosters
          </motion.button>
        </div>

        <motion.button 
          className={styles.compareToggle}
          onClick={toggleComparisonMode}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            backgroundColor: isComparing ? `rgba(232, 197, 71, 0.15)` : `rgba(255, 255, 255, 0.05)`,
            color: isComparing ? `#E8C547` : `rgba(255, 255, 255, 0.7)`,
            borderColor: isComparing ? `rgba(232, 197, 71, 0.3)` : `rgba(255, 255, 255, 0.1)`
          }}
          transition={{ duration: 0.3 }}
        >
          <Award size={18} />
          {isComparing ? 'Hide Comparison' : 'Compare All Plans'}
        </motion.button>
      </motion.div>

      {/* Role Introduction */}
      <AnimatePresence mode="wait">
        {!isComparing && (
          <motion.div 
            key={`intro-${activeTab}`}
            className={styles.roleIntro}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <div 
              className={styles.roleIconContainer}
              style={{ 
                backgroundColor: `${pricingData[activeTab].color}20`, 
                color: pricingData[activeTab].color 
              }}
            >
              {React.cloneElement(pricingData[activeTab].icon, { size: 32 })}
            </div>
            <h3>{pricingData[activeTab].title}</h3>
            <p>{pricingData[activeTab].description}</p>
            
            <motion.div 
              className={styles.roleBenefits}
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              {pricingData[activeTab].benefits.map((benefit, index) => (
                <motion.div 
                  key={index}
                  className={styles.benefitTag}
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: { opacity: 1, scale: 1 }
                  }}
                  style={{ 
                    backgroundColor: `${pricingData[activeTab].color}15`, 
                    color: pricingData[activeTab].color 
                  }}
                >
                  <Star size={14} />
                  {benefit}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        {viewMode === 'cards' && !isComparing ? (
          /* Pricing Cards View */
          <motion.div 
            key={`cards-${activeTab}`}
            className={styles.pricingCardsContainer}
            ref={cardsRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className={styles.pricingCards}
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.2
                  }
                }
              }}
            >
              {pricingData[activeTab].plans.map((plan, planIndex) => (
                <motion.div 
                  key={`${activeTab}-plan-${planIndex}`}
                  className={`${styles.pricingCard} ${plan.recommended ? styles.recommended : ''}`}
                  variants={cardVariants}
                  whileHover="hover"
                  onHoverStart={() => setHoveredCard(`${activeTab}-${planIndex}`)}
                  onHoverEnd={() => setHoveredCard(null)}
                  style={{
                    borderColor: hoveredCard === `${activeTab}-${planIndex}` || plan.recommended 
                      ? `${plan.color}50` 
                      : 'rgba(255, 255, 255, 0.1)'
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
                  
                  <div 
                    className={styles.planHeader}
                    style={{
                      background: plan.recommended 
                        ? `linear-gradient(to bottom, ${plan.color}10, transparent)` 
                        : ''
                    }}
                  >
                    <h3 className={styles.planName}>{plan.name}</h3>
                    <div className={styles.planPrice}>
                      <span className={styles.currency}>$</span>
                      <span 
                        className={styles.amount}
                        style={{ color: plan.recommended ? plan.color : '' }}
                      >
                        {plan.price}
                      </span>
                      <span className={styles.period}>/month</span>
                    </div>
                  </div>
                  
                  <div className={styles.planFeatures}>
                    {plan.features.slice(0, 5).map((feature, i) => (
                      <motion.div 
                        key={`${activeTab}-${planIndex}-feature-${i}`}
                        className={styles.featureItem}
                        variants={{
                          hidden: { opacity: 0, x: -10 },
                          visible: { opacity: 1, x: 0, transition: { delay: i * 0.05 } }
                        }}
                      >
                        {feature.included ? 
                          <CheckCircle size={18} className={styles.featureIncluded} style={{ color: plan.color }} /> :
                          <XCircle size={18} className={styles.featureExcluded} />
                        }
                        <span className={feature.included ? '' : styles.featureMuted}>{feature.text}</span>
                      </motion.div>
                    ))}

                    {/* Expandable features section */}
                    <AnimatePresence>
                      {expandedFeatures[`${activeTab}-${planIndex}`] && (
                        <motion.div
                          key={`expanded-${activeTab}-${planIndex}`}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          variants={featureRowVariants}
                          className={styles.expandedFeatures}
                        >
                          {plan.features.slice(5).map((feature, i) => (
                            <motion.div 
                              key={`${activeTab}-${planIndex}-expanded-feature-${i}`}
                              className={styles.featureItem}
                              variants={{
                                hidden: { opacity: 0, x: -10 },
                                visible: { 
                                  opacity: 1, 
                                  x: 0, 
                                  transition: { delay: i * 0.05 } 
                                }
                              }}
                            >
                              {feature.included ? 
                                <CheckCircle size={18} className={styles.featureIncluded} style={{ color: plan.color }} /> :
                                <XCircle size={18} className={styles.featureExcluded} />
                              }
                              <span className={feature.included ? '' : styles.featureMuted}>{feature.text}</span>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Show/hide features toggle */}
                    {plan.features.length > 5 && (
                      <motion.button
                        className={styles.toggleFeaturesButton}
                        onClick={() => toggleFeatureExpansion(activeTab, planIndex)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{ color: plan.color }}
                      >
                        {expandedFeatures[`${activeTab}-${planIndex}`] ? (
                          <>
                            <ChevronUp size={16} />
                            <span>Show less</span>
                          </>
                        ) : (
                          <>
                            <ChevronDown size={16} />
                            <span>Show all features</span>
                          </>
                        )}
                      </motion.button>
                    )}
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
                  
                  {/* Glow effect */}
                  <div 
                    className={styles.cardGlow}
                    style={{ 
                      backgroundColor: plan.color,
                      opacity: hoveredCard === `${activeTab}-${planIndex}` ? 0.07 : 0 
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        ) : (
          /* Comparison Table View */
          <motion.div 
            key="comparison-table"
            className={styles.comparisonTableContainer}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={tableVariants}
          >
            <div className={styles.tableScrollContainer}>
              <table className={styles.comparisonTable}>
                <thead>
                  <tr>
                    <th className={styles.featureColumn}>Feature</th>
                    {Object.keys(pricingData).map(roleKey => 
                      pricingData[roleKey].plans.map((plan, planIndex) => (
                        <th 
                          key={`header-${roleKey}-${planIndex}`}
                          className={plan.recommended ? styles.recommendedColumn : ''}
                          style={{
                            borderColor: plan.recommended ? `${plan.color}50` : '',
                            backgroundColor: plan.recommended ? `${plan.color}10` : ''
                          }}
                        >
                          <div className={styles.planHeader}>
                            {plan.recommended && (
                              <div 
                                className={styles.recommendedPill}
                                style={{ backgroundColor: plan.color }}
                              >
                                <Crown size={12} />
                                Recommended
                              </div>
                            )}
                            <div 
                              className={styles.roleIndicator}
                              style={{ color: pricingData[roleKey].color }}
                            >
                              {React.cloneElement(pricingData[roleKey].icon, { size: 14 })}
                              <span>{pricingData[roleKey].title}</span>
                            </div>
                            <div className={styles.planName}>{plan.name}</div>
                            <div className={styles.planPrice}>
                              <span className={styles.currency}>$</span>
                              <span className={styles.amount}>{plan.price}</span>
                              <span className={styles.period}>/mo</span>
                            </div>
                          </div>
                        </th>
                      ))
                    )}
                  </tr>
                </thead>
                <tbody>
                  {getAllFeatures.map((feature, index) => (
                    <tr 
                      key={`feature-row-${index}`}
                      className={index % 2 === 0 ? styles.evenRow : styles.oddRow}
                    >
                      <td className={styles.featureColumn}>{feature}</td>
                      {Object.keys(pricingData).map(roleKey => 
                        pricingData[roleKey].plans.map((plan, planIndex) => (
                          <td 
                            key={`cell-${roleKey}-${planIndex}-${index}`}
                            className={`${styles.featureCell} ${plan.recommended ? styles.recommendedColumn : ''}`}
                            style={{ borderColor: plan.recommended ? `${plan.color}50` : '' }}
                          >
                            {planHasFeature(roleKey, planIndex, feature) ? (
                              <CheckCircle 
                                size={20} 
                                className={styles.featureIncluded} 
                                style={{ color: plan.color }} 
                              />
                            ) : (
                              <XCircle 
                                size={20} 
                                className={styles.featureExcluded} 
                              />
                            )}
                          </td>
                        ))
                      )}
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td className={styles.featureColumn}></td>
                    {Object.keys(pricingData).map(roleKey => 
                      pricingData[roleKey].plans.map((plan, planIndex) => (
                        <td 
                          key={`footer-${roleKey}-${planIndex}`}
                          className={plan.recommended ? styles.recommendedColumn : ''}
                          style={{ borderColor: plan.recommended ? `${plan.color}50` : '' }}
                        >
                          <motion.button 
                            className={styles.tableActionButton}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{ 
                              backgroundColor: plan.recommended ? plan.color : 'transparent',
                              color: plan.recommended ? '#000' : plan.color,
                              borderColor: plan.color
                            }}
                          >
                            {plan.price === "0" ? "Get Started" : "Subscribe"}
                          </motion.button>
                        </td>
                      ))
                    )}
                  </tr>
                </tfoot>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Common Benefits Section */}
      <motion.div 
        className={styles.commonBenefits}
        variants={itemVariants}
      >
        <div className={styles.benefitHeader}>
          <BadgeCheck size={20} />
          <h4>All plans include:</h4>
        </div>
        <div className={styles.benefitGrid}>
          <motion.div 
            className={styles.benefitItem}
            whileHover={{ y: -5 }}
          >
            <div 
              className={styles.benefitIcon} 
              style={{ backgroundColor: "#E8C54720" }}
            >
              <Globe size={24} />
            </div>
            <h5>Global Community</h5>
            <p>Connect with creators worldwide on cutting-edge projects</p>
          </motion.div>
          
          <motion.div 
            className={styles.benefitItem}
            whileHover={{ y: -5 }}
          >
            <div 
              className={styles.benefitIcon}
              style={{ backgroundColor: "#3B82F620" }}
            >
              <TrendingUp size={24} />
            </div>
            <h5>Reputation System</h5>
            <p>Build your credibility through verified contributions</p>
          </motion.div>
          
          <motion.div 
            className={styles.benefitItem}
            whileHover={{ y: -5 }}
          >
            <div 
              className={styles.benefitIcon}
              style={{ backgroundColor: "#EC489920" }}
            >
              <Shield size={24} />
            </div>
            <h5>Secure Platform</h5>
            <p>Protected intellectual property and transparent rewards</p>
          </motion.div>
          
          <motion.div 
            className={styles.benefitItem}
            whileHover={{ y: -5 }}
          >
            <div 
              className={styles.benefitIcon}
              style={{ backgroundColor: "#4ECDC420" }}
            >
              <Activity size={24} />
            </div>
            <h5>Skills Development</h5>
            <p>Grow your capabilities through real-world projects</p>
          </motion.div>
        </div>
      </motion.div>

   {/* CTA Section */}
      <motion.div 
        className={styles.ctaContainer}
        variants={itemVariants}
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
    </motion.section>
  );
};

export default PricingSection;