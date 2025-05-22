import React, { useState, useRef, useEffect, useMemo } from 'react';
import styles from './HowItWorksSection.module.scss';
import { motion, useInView, useAnimation, AnimatePresence } from 'framer-motion';
import { 
  RocketIcon, 
  UsersIcon, 
  HammerIcon, 
  ChevronRight, 
  ChevronDown, 
  Target,
  Star,
  Code,
  Paintbrush,
  Megaphone,
  MessageSquare,
  Shield,
  Zap,
  Award,
  ArrowRight,
  ChevronUp,
  Play,
  Sparkles,
  Layers,
  CheckCircle,
  X,
  ArrowLeft
} from 'lucide-react';

const HowItWorksSection = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [activeTab, setActiveTab] = useState('process');
  const [hoverRole, setHoverRole] = useState(null);
  const [activeShowcase, setActiveShowcase] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [expandedRoleIndex, setExpandedRoleIndex] = useState(null);
  
  const sectionRef = useRef(null);
  const processRef = useRef(null);
  const showcaseRef = useRef(null);
  const rolesRef = useRef(null);
  
  const isInView = useInView(sectionRef, { once: false, threshold: 0.1 });
  const processInView = useInView(processRef, { once: false, threshold: 0.3 });
  const showcaseInView = useInView(showcaseRef, { once: false, threshold: 0.3 });
  const rolesInView = useInView(rolesRef, { once: false, threshold: 0.3 });
  
  const controls = useAnimation();

  // Process steps data with expanded details
  const steps = [
    {
      icon: <UsersIcon />,
      title: 'Join or Create a Pod',
      description: 'Jump into an existing Pod or launch your own to start building bold ideas.',
      details: [
        'Browse trending Pods in the explore page',
        'Apply to join with your skills and experience',
        'Create your own Pod with just a mission and needed roles',
        'Invite collaborators from your network'
      ],
      color: '#6B5B95',
      tag: 'Step 01',
    },
    {
      icon: <HammerIcon />,
      title: 'Collaborate and Build',
      description: 'Contribute, create, and grow your Pod with real work tracked transparently.',
      details: [
        'Track contributions in real-time',
        'Validate completed work with peer reviews',
        'Build reputation through consistent delivery',
        'Share progress updates with the community'
      ],
      color: '#4ECDC4',
      tag: 'Step 02',
    },
    {
      icon: <RocketIcon />,
      title: 'Launch to the World',
      description: 'Go live with your product, service, or movement — fully backed by your team.',
      details: [
        'Build a Pod storefront to showcase your work',
        'Set up revenue splits based on contributions',
        'Generate contracts between collaborators',
        'Collect payments through built-in systems'
      ],
      color: '#E8C547',
      tag: 'Step 03',
     
    },
  ];

  // Role categories
  const roles = [
    {
      icon: <Target />,
      title: 'Pod Creators',
      description: 'Visionaries who initiate Pods with innovative ideas and clear direction.',
      benefits: [
        'Full pod customization',
        'Leadership experience',
        'Higher reputation growth',
        'Portfolio showcasing'
      ],
      skills: ['Vision', 'Leadership', 'Project Management', 'Strategy'],
      color: '#E8C547'
    },
    {
      icon: <Code />,
      title: 'Developers',
      description: "Technical specialists who bring the Pod's vision to life through code.",
      benefits: [
        'Showcase technical work',
        'Collaborate with designers',
        'Build real-world products',
        'Earn through contributions'
      ],
      skills: ['Programming', 'Problem Solving', 'System Architecture', 'Technical Documentation'],
      color: '#3B82F6'
    },
    {
      icon: <Paintbrush />,
      title: 'Designers',
      description: "Creative minds who shape the look, feel, and user experience of Pod projects.",
      benefits: [
        'Expand your portfolio',
        'Work on diverse projects',
        'Collaborate with developers',
        'Get real user feedback'
      ],
      skills: ['UI/UX Design', 'Visual Design', 'Prototyping', 'User Research'],
      color: '#EC4899'
    },
    {
      icon: <Megaphone />,
      title: 'Marketers',
      description: "Strategic communicators who help Pods reach their target audience effectively.",
      benefits: [
        'Develop marketing campaigns',
        'Build your professional network',
        'Test innovative strategies',
        'Share in launch success'
      ],
      skills: ['Marketing Strategy', 'Content Creation', 'Analytics', 'Growth Hacking'],
      color: '#8B5CF6'
    },
    {
      icon: <MessageSquare />,
      title: 'Content Writers',
      description: "Wordsmiths who craft compelling narratives and content for Pod projects.",
      benefits: [
        'Diverse writing opportunities',
        'Build a strong portfolio',
        'Collaborate with designers',
        'Earn through contributions'
      ],
      skills: ['Copywriting', 'Storytelling', 'Research', 'Editing'],
      color: '#10B981'
    },
    {
      icon: <Shield />,
      title: 'QA Testers',
      description: "Quality assurance specialists who ensure Pod products meet high standards.",
      benefits: [
        'Test innovative products',
        'Provide valuable feedback',
        'Improve user experiences',
        'Build technical expertise'
      ],
      skills: ['Testing', 'Bug Reporting', 'User Perspective', 'Detail Orientation'],
      color: '#F59E0B'
    }
  ];

  // Showcase success stories
  const showcases = [
    {
      title: "MarketMeld",
      category: "Marketing Solution",
      description: "A team of 6 marketers, developers, and designers created a comprehensive marketing analytics platform in just 8 weeks.",
      stats: [
        { label: "Team Size", value: "6" },
        { label: "Development Time", value: "8 weeks" },
        { label: "Revenue Generated", value: "$24K+" },
      ],
      testimonial: {
        quote: "PODNEX let us focus on building rather than worrying about contracts and payment splits. We launched faster than we ever thought possible.",
        author: "Ashwin P., Pod Creator"
      },
      steps: [
        "Initial concept developed by marketing expert with data analysis background",
        "Assembled team across 3 time zones through PODNEX matching",
        "MVP launched in 5 weeks with first paying customers shortly after",
        "Ongoing development with revenue share based on contribution tracking"
      ],
      color: "#3B82F6",
      image: "/api/placeholder/550/300"
    },
    {
      title: "Glimpse",
      category: "Social Platform",
      description: "A micro-social platform connecting creators with fans through 24-hour content windows, built by a distributed team.",
      stats: [
        { label: "Team Size", value: "12" },
        { label: "Development Time", value: "14 weeks" },
        { label: "User Growth", value: "10K+" },
      ],
      testimonial: {
        quote: "Our team was spread across 5 countries. PODNEX made collaboration feel like we were all in the same room, tracking everyone's contributions fairly.",
        author: "Maria L., Designer"
      },
      steps: [
        "Platform concept created by designer/developer duo",
        "Expanded team through PODNEX role matching system",
        "Beta testing through PODNEX community accelerated refinement",
        "Now generating revenue through premium creator subscriptions"
      ],
      color: "#EC4899",
      image: "/api/placeholder/550/300"
    },
    {
      title: "CodeCraft",
      category: "Developer Tool",
      description: "An AI-powered code review and optimization tool created by a group of senior developers who met through PODNEX.",
      stats: [
        { label: "Team Size", value: "4" },
        { label: "Development Time", value: "16 weeks" },
        { label: "Enterprise Clients", value: "3" },
      ],
      testimonial: {
        quote: "We were able to build, test, and launch our product without any of the traditional startup hassles. The Pod structure kept everyone accountable and motivated.",
        author: "Thomas K., Lead Developer"
      },
      steps: [
        "Initial prototype developed by two backend engineers",
        "Frontend developer and AI specialist joined through PODNEX",
        "Beta tested across 15 different dev teams on PODNEX",
        "Secured first enterprise client through PODNEX network connections"
      ],
      color: "#10B981",
      image: "/api/placeholder/550/300"
    }
  ];

  // Effect to auto-advance the process steps
  useEffect(() => {
    if (activeTab === 'process' && processInView) {
      const interval = setInterval(() => {
        if (!isFullscreen) {
          setActiveStep((prev) => (prev + 1) % steps.length);
        }
      }, 6000);
      
      return () => clearInterval(interval);
    }
  }, [activeTab, processInView, steps.length, isFullscreen]);

  // Effect to handle animations based on scroll
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, isInView]);

  // Handle showcase transition
  const handleShowcaseChange = (index) => {
    if (isAnimating || index === activeShowcase) return;
    
    setIsAnimating(true);
    setActiveShowcase(index);
    
    // Reset animation flag after transition completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  // Handle toggle fullscreen for steps
  const toggleFullscreen = (index) => {
    if (isFullscreen && activeStep !== index) {
      setActiveStep(index);
      return;
    }
    
    setIsFullscreen(!isFullscreen);
    setActiveStep(index);
  };

  // Toggle expanded role
  const toggleRoleExpansion = (index) => {
    setExpandedRoleIndex(expandedRoleIndex === index ? null : index);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
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
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
      transition: { duration: 0.3 }
    }
  };

  const showcaseVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      x: -100,
      transition: { duration: 0.3 }
    }
  };

  const fullscreenStepVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.4 }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.3 }
    }
  };

  return (
    <section className={styles.howItWorks} ref={sectionRef}>
      {/* Animated Background */}
      <div className={styles.gridBackground} />
      
      {/* Floating decorative elements */}
      <div className={styles.floatingShapes}>
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
      </div>
      
      {/* Section Header */}
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
          How <span className={styles.highlight}>PODNEX</span> Works
        </h2>
        <p className={styles.sectionSubtitle}>
          An innovative ecosystem where collaboration, transparency, and fair attribution drive successful digital projects
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
          className={`${styles.tabButton} ${activeTab === 'process' ? styles.activeTab : ''}`}
          variants={tabVariants}
          animate={activeTab === 'process' ? 'active' : 'inactive'}
          onClick={() => setActiveTab('process')}
          whileHover={{ y: -3 }}
        >
          <Zap size={18} />
          Process
        </motion.button>
        
        <motion.button 
          className={`${styles.tabButton} ${activeTab === 'roles' ? styles.activeTab : ''}`}
          variants={tabVariants}
          animate={activeTab === 'roles' ? 'active' : 'inactive'}
          onClick={() => setActiveTab('roles')}
          whileHover={{ y: -3 }}
        >
          <UsersIcon size={18} />
          Team Roles
        </motion.button>
        
        <motion.button 
          className={`${styles.tabButton} ${activeTab === 'showcase' ? styles.activeTab : ''}`}
          variants={tabVariants}
          animate={activeTab === 'showcase' ? 'active' : 'inactive'}
          onClick={() => setActiveTab('showcase')}
          whileHover={{ y: -3 }}
        >
          <Award size={18} />
          Success Stories
        </motion.button>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* Process View */}
        {activeTab === 'process' && (
          <motion.div 
            key="process"
            ref={processRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={`${styles.processView} ${isFullscreen ? styles.fullscreenActive : ''}`}
          >
            {/* Process timeline */}
            <motion.div 
  className={styles.processTimeline}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.2 }}
>
  {steps.map((step, index) => (
    <motion.div 
      key={`step-${index}`}
      className={`${styles.timelineStep} ${activeStep === index ? styles.active : ''}`}
      onClick={() => setActiveStep(index)}
      whileHover={{ 
        scale: 1.05, 
        y: -5,
        transition: { type: "spring", stiffness: 300 }
      }}
      style={{ 
        color: activeStep === index ? step.color : ''
      }}
    >
      <motion.div 
        className={styles.stepNumber}
        style={{ 
          borderColor: activeStep === index ? step.color : '',
          backgroundColor: activeStep === index ? `${step.color}20` : ''
        }}
      >
        {index + 1}
      </motion.div>
      <span className={styles.stepLabel}>{step.title}</span>
      {activeStep === index && (
        <motion.div 
          className={styles.activeIndicator}
          layoutId="activeStepIndicator"
          style={{ backgroundColor: step.color }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </motion.div>
  ))}
  <div className={styles.timelineBar}>
    <motion.div 
      className={styles.timelineProgress}
      animate={{ 
        width: `${(activeStep / (steps.length - 1)) * 100}%` 
      }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      style={{ backgroundColor: steps[activeStep].color }}
    />
  </div>
</motion.div>

            {/* Main content area */}
            <div className={styles.processContent}>
              <AnimatePresence mode="wait">
                {isFullscreen ? (
                  /* Fullscreen step view */
                  <motion.div 
                    key={`fullscreen-${activeStep}`}
                    className={styles.fullscreenStep}
                    variants={fullscreenStepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    style={{ borderColor: steps[activeStep].color }}
                  >
                    <motion.button 
                      className={styles.closeFullscreen}
                      onClick={() => setIsFullscreen(false)}
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X size={24} />
                    </motion.button>
                    
                    <div className={styles.fullscreenHeader}>
                      <div 
                        className={styles.fullscreenIconContainer}
                        style={{ backgroundColor: steps[activeStep].color }}
                      >
                        {React.cloneElement(steps[activeStep].icon, { size: 48, color: "#000" })}
                      </div>
                      
                      <div className={styles.fullscreenTitleWrapper}>
                        <div className={styles.fullscreenTag}>
                          {steps[activeStep].tag}
                        </div>
                        <h3 className={styles.fullscreenTitle}>
                          {steps[activeStep].title}
                          <span className={styles.emoji}>{steps[activeStep].emoji}</span>
                        </h3>
                      </div>
                    </div>
                    
                    <p className={styles.fullscreenDescription}>
                      {steps[activeStep].description}
                    </p>
                    
                    <div className={styles.fullscreenDetails}>
                      <h4>Key Activities</h4>
                      <ul>
                        {steps[activeStep].details.map((detail, i) => (
                          <motion.li 
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            style={{ '--bullet-color': steps[activeStep].color }}
                          >
                            <CheckCircle size={18} style={{ color: steps[activeStep].color }} />
                            <span>{detail}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className={styles.fullscreenFooter}>
                      <div className={styles.stepNavigation}>
                        <motion.button 
                          className={styles.navButton}
                          onClick={() => setActiveStep((activeStep - 1 + steps.length) % steps.length)}
                          whileHover={{ x: -5 }}
                          whileTap={{ scale: 0.95 }}
                          style={{ 
                            backgroundColor: `${steps[activeStep].color}20`,
                            color: steps[activeStep].color 
                          }}
                        >
                          <ArrowLeft size={20} />
                          <span>Previous</span>
                        </motion.button>
                        
                        <motion.button 
                          className={styles.navButton}
                          onClick={() => setActiveStep((activeStep + 1) % steps.length)}
                          whileHover={{ x: 5 }}
                          whileTap={{ scale: 0.95 }}
                          style={{ 
                            backgroundColor: `${steps[activeStep].color}20`,
                            color: steps[activeStep].color 
                          }}
                        >
                          <span>Next</span>
                          <ArrowRight size={20} />
                        </motion.button>
                      </div>
                      
                      <motion.button 
                        className={styles.learnMoreButton}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{ 
                          backgroundColor: steps[activeStep].color,
                        }}
                      >
                        <span>Learn More</span>
                        <Play size={16} />
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  /* Compact step cards */
                  <motion.div 
                    key={`steps-grid`}
                    className={styles.stepsGrid}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {steps.map((step, index) => (
                      <motion.div 
                        key={`step-card-${index}`} 
                        className={`${styles.stepCard} ${activeStep === index ? styles.active : ''}`}
                        variants={itemVariants}
                        whileHover={{ y: -8 }}
                        onClick={() => toggleFullscreen(index)}
                        style={
                          activeStep === index 
                            ? { 
                                borderColor: `${step.color}50`, 
                                boxShadow: `0 15px 30px rgba(0,0,0,0.2), 0 0 15px ${step.color}30` 
                              } 
                            : {}
                        }
                      >
                        <div className={styles.stepTag} style={{ backgroundColor: step.color }}>
                          {step.tag}
                        </div>
                        
                        <motion.div 
                          className={styles.iconContainer}
                          style={{ 
                            backgroundColor: activeStep === index ? step.color : 'rgba(255, 255, 255, 0.05)',
                            boxShadow: activeStep === index ? `0 10px 20px ${step.color}30` : 'none'
                          }}
                          whileHover={{ rotate: 5 }}
                        >
                          <motion.div 
                            className={styles.icon}
                            style={{ color: activeStep === index ? '#000' : step.color }}
                          >
                            {React.cloneElement(step.icon, { size: 32 })}
                          </motion.div>
                        </motion.div>
                        
                        <div className={styles.stepContent}>
                          <h3 style={{ color: activeStep === index ? step.color : '' }}>
                            {step.title}
                            <span className={styles.emoji}>{step.emoji}</span>
                          </h3>
                          <p>{step.description}</p>
                        </div>
                        
                        <motion.div 
                          className={styles.expandButton}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          style={{ 
                            backgroundColor: activeStep === index ? `${step.color}30` : 'rgba(255, 255, 255, 0.1)',
                            color: activeStep === index ? step.color : '' 
                          }}
                        >
                          <Sparkles size={16} />
                          <span>View Details</span>
                        </motion.div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Team Roles View */}
        {activeTab === 'roles' && (
          <motion.div 
            key="roles"
            ref={rolesRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={styles.rolesView}
          >
            <motion.p 
              className={styles.rolesIntro}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Each participant in the PODNEX ecosystem contributes unique skills and receives targeted benefits
            </motion.p>
            
            <motion.div 
              className={styles.rolesGrid}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {roles.map((role, index) => (
                <motion.div 
                  key={`role-${index}`}
                  className={`${styles.roleCard} ${expandedRoleIndex === index ? styles.expanded : ''}`}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  onHoverStart={() => setHoverRole(index)}
                  onHoverEnd={() => setHoverRole(null)}
                  onClick={() => toggleRoleExpansion(index)}
                  style={{ 
                    '--role-color': role.color,
                    borderColor: (expandedRoleIndex === index || hoverRole === index) ? `${role.color}50` : 'rgba(255, 255, 255, 0.08)',
                    boxShadow: (expandedRoleIndex === index || hoverRole === index) ? `0 15px 30px rgba(0,0,0,0.2), 0 0 15px ${role.color}30` : ''
                  }}
                >
                  <div className={styles.roleHeader}>
                    <div 
                      className={styles.roleIconContainer}
                      style={{ 
                        backgroundColor: `${role.color}20`, 
                        color: role.color,
                        boxShadow: expandedRoleIndex === index ? `0 10px 25px ${role.color}30` : ''
                      }}
                    >
                      {React.cloneElement(role.icon, { size: 28 })}
                    </div>
                    <h3 className={styles.roleTitle} style={{ color: expandedRoleIndex === index ? role.color : '' }}>
                      {role.title}
                    </h3>
                    
                    <motion.div 
                      className={styles.expandRoleButton}
                      animate={{ rotate: expandedRoleIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown size={20} />
                    </motion.div>
                  </div>
                  
                  <p className={styles.roleDescription}>{role.description}</p>
                  
                  <AnimatePresence>
                    {expandedRoleIndex === index && (
                      <motion.div 
                        className={styles.roleDetails}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className={styles.roleBenefits}>
                          <h4>Key Benefits</h4>
                          <ul>
                            {role.benefits.map((benefit, idx) => (
                              <motion.li 
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 + (idx * 0.1) }}
                                style={{ '--bullet-color': role.color }}
                              >
                                <Star size={16} color={role.color} />
                                {benefit}
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className={styles.roleSkills}>
                          <h4>Core Skills</h4>
                          <div className={styles.skillTags}>
                            {role.skills.map((skill, idx) => (
                              <motion.span 
                                key={idx}
                                className={styles.skillTag}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 + (idx * 0.1) }}
                                style={{ 
                                  backgroundColor: `${role.color}15`,
                                  color: role.color,
                                  borderColor: `${role.color}30`
                                }}
                              >
                                {skill}
                              </motion.span>
                            ))}
                          </div>
                        </div>
                        
                        <motion.button 
                          className={styles.roleCta}
                          whileHover={{ y: -3 }}
                          whileTap={{ scale: 0.95 }}
                          style={{ 
                            backgroundColor: role.color,
                            boxShadow: `0 8px 20px ${role.color}30`
                          }}
                        >
                          <span>Explore Opportunities</span>
                          <ArrowRight size={16} />
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {!expandedRoleIndex && (
                    <div 
                      className={styles.rolePrompt}
                      style={{ color: hoverRole === index ? role.color : '' }}
                    >
                      <ChevronDown size={16} />
                      <span>Click to expand</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
            
            <motion.div 
              className={styles.rolesHighlight}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              style={{ background: `linear-gradient(45deg, rgba(232, 197, 71, 0.05), rgba(0, 0, 0, 0))` }}
            >
              <div className={styles.highlightIcon}>
                <Shield size={24} />
              </div>
              <div className={styles.highlightContent}>
                <h3>Every Role Has a Profile Graph</h3>
                <p>
                  All participants build a visible profile showcasing their contributions, reputation, badges, and earnings history — creating a trusted ecosystem for collaboration.
                </p>
              </div>
              <motion.button 
                className={styles.highlightButton}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Learn More</span>
                <ArrowRight size={18} />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
        
        {/* Success Stories View */}
        {activeTab === 'showcase' && (
          <motion.div 
            key="showcase"
            ref={showcaseRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={styles.showcaseView}
          >
            <div className={styles.showcaseContainer}>
              <div className={styles.showcaseNav}>
                {showcases.map((showcase, index) => (
                  <motion.button
                    key={`nav-${index}`}
                    className={`${styles.showcaseTab} ${activeShowcase === index ? styles.active : ''}`}
                    onClick={() => handleShowcaseChange(index)}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ 
                      borderColor: activeShowcase === index ? showcase.color : 'transparent',
                      color: activeShowcase === index ? showcase.color : ''
                    }}
                  >
                    <span className={styles.showcaseNumber}>{index + 1}</span>
                    <span className={styles.showcaseName}>{showcase.title}</span>
                    {activeShowcase === index && (
                      <motion.div 
                        className={styles.activeTabIndicator}
                        layoutId="activeShowcase"
                        style={{ backgroundColor: showcase.color }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>
              
              <div className={styles.showcaseContent}>
                <AnimatePresence mode="wait">
                  {showcases.map((showcase, index) => (
                    activeShowcase === index && (
                      <motion.div
                        key={`showcase-${index}`}
                        className={styles.showcaseCard}
                        variants={showcaseVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        style={{ '--showcase-color': showcase.color }}
                      >
                        <div className={styles.showcaseInfo}>
                          <div className={styles.showcaseHeader}>
                            <span 
                              className={styles.showcaseCategory} 
                              style={{ 
                                backgroundColor: `${showcase.color}20`, 
                                color: showcase.color,
                                borderColor: `${showcase.color}40`
                              }}
                            >
                              {showcase.category}
                            </span>
                            <h3 className={styles.showcaseTitle}>{showcase.title}</h3>
                          </div>
                          
                          <p className={styles.showcaseDescription}>{showcase.description}</p>
                          
                          <div className={styles.showcaseStats}>
                            {showcase.stats.map((stat, i) => (
                              <motion.div 
                                key={i} 
                                className={styles.statItem}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + (i * 0.1) }}
                              >
                                <span 
                                  className={styles.statValue} 
                                  style={{ color: showcase.color }}
                                >
                                  {stat.value}
                                </span>
                                <span className={styles.statLabel}>{stat.label}</span>
                              </motion.div>
                            ))}
                          </div>
                          
                          <div className={styles.showcaseJourney}>
                            <h4 className={styles.journeyTitle}>
                              <Layers size={18} />
                              <span>Journey Highlights</span>
                            </h4>
                            <div className={styles.journeySteps}>
                              {showcase.steps.map((step, i) => (
                                <motion.div 
                                  key={i} 
                                  className={styles.journeyStep}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.3 + (i * 0.1) }}
                                >
                                  <div 
                                    className={styles.stepIndicator}
                                    style={{ backgroundColor: showcase.color }}
                                  >
                                    {i + 1}
                                  </div>
                                  <div className={styles.stepText}>{step}</div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                          
                          <motion.button 
                            className={styles.showcaseButton}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{ backgroundColor: showcase.color }}
                          >
                            View Case Study
                            <ArrowRight size={16} />
                          </motion.button>
                        </div>
                        
                        <div className={styles.showcaseVisual}>
                          <div className={styles.testimonialWrapper}>
                            <div 
                              className={styles.showcaseTestimonial}
                              style={{ borderColor: `${showcase.color}30` }}
                            >
                              <div 
                                className={styles.quoteIcon} 
                                style={{ color: showcase.color }}
                              >
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M11.3 5.1C6.3 5.1 2.1 9.3 2.1 14.5v4.4h4.4v-4.4c0-2.7 2.2-4.9 4.9-4.9h2.2V5.1h-2.3zm8.8 0v4.4h2.2c2.7 0 4.9 2.2 4.9 4.9v4.4h4.4v-4.4c0-5.1-4.2-9.3-9.3-9.3h-2.2z" />
                                </svg>
                              </div>
                              <blockquote>{showcase.testimonial.quote}</blockquote>
                              <cite>{showcase.testimonial.author}</cite>
                            </div>
                          </div>
                          
                          <div className={styles.imageContainer}>
                            <motion.div 
                              className={styles.imageWrapper}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 }}
                              style={{ boxShadow: `0 20px 40px rgba(0, 0, 0, 0.3), 0 0 30px ${showcase.color}20` }}
                            >
                              <img src={showcase.image} alt={showcase.title} />
                              <div 
                                className={styles.imageBorder} 
                                style={{ borderColor: showcase.color }} 
                              />
                            </motion.div>
                            <div 
                              className={styles.showcaseDecoration} 
                              style={{ backgroundColor: `${showcase.color}20` }} 
                            />
                          </div>
                        </div>
                      </motion.div>
                    )
                  ))}
                </AnimatePresence>
              </div>

              {/* Showcase pagination dots */}
              <div className={styles.showcaseDots}>
                {showcases.map((_, index) => (
                  <motion.button
                    key={`dot-${index}`}
                    className={`${styles.showcaseDot} ${activeShowcase === index ? styles.active : ''}`}
                    onClick={() => handleShowcaseChange(index)}
                    whileHover={{ scale: 1.2 }}
                    style={{ 
                      backgroundColor: activeShowcase === index ? showcases[index].color : '',
                      borderColor: activeShowcase === index ? showcases[index].color : ''
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
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
          <h3>Ready to Join the Ecosystem?</h3>
          <p>Start collaborating with talented individuals and turn your ideas into reality</p>
        </div>
        <motion.button 
          className={styles.ctaButton}
          whileHover={{ scale: 1.05, backgroundColor: "#E8C547" }}
          whileTap={{ scale: 0.95 }}
        >
          Start Building Today
          <ArrowRight size={20} />
        </motion.button>
      </motion.div>
    </section>
  );
};

export default HowItWorksSection;