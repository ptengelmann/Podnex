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
  ArrowLeft,
  MousePointer,
  Lock,
  Unlock,
  Eye,
  Maximize,
  Minimize,
  Clock,
  BarChart2,
  PieChart,
  Plus,
  Filter,
  FileText
} from 'lucide-react';

const HowItWorksSection = () => {
  // State management
  const [activeStep, setActiveStep] = useState(0);
  const [activeTab, setActiveTab] = useState('process');
  const [hoverRole, setHoverRole] = useState(null);
  const [activeShowcase, setActiveShowcase] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [expandedRoleIndex, setExpandedRoleIndex] = useState(null);
  const [interactionMode, setInteractionMode] = useState('guided'); // guided, explore, compare
  const [compareItems, setCompareItems] = useState([]);
  const [viewMode, setViewMode] = useState('default'); // default, detailed, stats
  const [filteredRoles, setFilteredRoles] = useState(null);
  const [animateBackground, setAnimateBackground] = useState(true);
  const [highlightedBenefit, setHighlightedBenefit] = useState(null);
  const [showHoverAnimation, setShowHoverAnimation] = useState(true);
  
  // Refs for scroll animations
  const sectionRef = useRef(null);
  const processRef = useRef(null);
  const showcaseRef = useRef(null);
  const rolesRef = useRef(null);
  const timelineRef = useRef(null);
  
  // InView hooks for triggering animations
  const isInView = useInView(sectionRef, { once: false, threshold: 0.1 });
  const processInView = useInView(processRef, { once: false, threshold: 0.3 });
  const showcaseInView = useInView(showcaseRef, { once: false, threshold: 0.3 });
  const rolesInView = useInView(rolesRef, { once: false, threshold: 0.3 });
  const timelineInView = useInView(timelineRef, { once: false, threshold: 0.3 });
  
  const controls = useAnimation();
  const backgroundControls = useAnimation();

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
      stats: {
        'Avg. Pod Size': '4-6 people',
        'Creation Time': '< 10 minutes',
        'Success Rate': '82%'
      },
      video: '/videos/join-pod.mp4',
      interactive: {
        simulation: 'pod-creation',
        options: ['Browse', 'Create', 'Join', 'Invite']
      }
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
      stats: {
        'Contribution Types': '8+',
        'Avg. Review Time': '24 hours',
        'Completion Rate': '73%'
      },
      video: '/videos/collaborate.mp4',
      interactive: {
        simulation: 'contribution-tracking',
        options: ['Code', 'Design', 'Market', 'Review']
      }
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
      stats: {
        'Avg. Launch Time': '12 weeks',
        'Revenue Split': 'Automated',
        'Support Channels': '5+'
      },
      video: '/videos/launch.mp4',
      interactive: {
        simulation: 'product-launch',
        options: ['Publish', 'Market', 'Monetize', 'Scale']
      }
    },
  ];

  // Role categories with enhanced details
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
      color: '#E8C547',
      stats: {
        'Avg. Earnings': '$4,200/mo',
        'Projects Led': '3.2/year',
        'Network Growth': '+46%'
      },
      successRate: 78,
      popularity: 84,
      difficulty: 72
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
      color: '#3B82F6',
      stats: {
        'Avg. Earnings': '$5,800/mo',
        'Projects': '5.7/year',
        'Code Reusability': '67%'
      },
      successRate: 86,
      popularity: 92,
      difficulty: 68
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
      color: '#EC4899',
      stats: {
        'Avg. Earnings': '$4,900/mo',
        'Projects': '4.3/year',
        'Design Adoption': '71%'
      },
      successRate: 81,
      popularity: 87,
      difficulty: 65
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
      color: '#8B5CF6',
      stats: {
        'Avg. Earnings': '$4,600/mo',
        'Campaigns': '7.8/year',
        'Conversion Rate': '3.2%'
      },
      successRate: 74,
      popularity: 79,
      difficulty: 62
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
      color: '#10B981',
      stats: {
        'Avg. Earnings': '$3,800/mo',
        'Word Output': '15k/month',
        'Content Types': '6+'
      },
      successRate: 80,
      popularity: 76,
      difficulty: 58
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
      color: '#F59E0B',
      stats: {
        'Avg. Earnings': '$4,100/mo',
        'Bug Detection': '94%',
        'QA Protocols': '12+'
      },
      successRate: 89,
      popularity: 68,
      difficulty: 70
    }
  ];

  // Enhanced showcase success stories with more detailed metrics
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
      metrics: {
        teamComposition: [
          { role: "Developers", percentage: 40 },
          { role: "Designers", percentage: 20 },
          { role: "Marketers", percentage: 30 },
          { role: "Content", percentage: 10 }
        ],
        timeline: [
          { phase: "Planning", duration: "1 week" },
          { phase: "Development", duration: "5 weeks" },
          { phase: "Testing", duration: "1 week" },
          { phase: "Launch", duration: "1 week" }
        ],
        revenue: [
          { month: "Month 1", amount: 4000 },
          { month: "Month 2", amount: 8000 },
          { month: "Month 3", amount: 12000 },
        ]
      },
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
      image: "/api/placeholder/550/300",
      liveDemo: "https://marketmeld.example.com"
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
      metrics: {
        teamComposition: [
          { role: "Developers", percentage: 35 },
          { role: "Designers", percentage: 25 },
          { role: "Marketers", percentage: 15 },
          { role: "Content", percentage: 25 }
        ],
        timeline: [
          { phase: "Planning", duration: "2 weeks" },
          { phase: "Development", duration: "8 weeks" },
          { phase: "Beta Testing", duration: "3 weeks" },
          { phase: "Launch", duration: "1 week" }
        ],
        userGrowth: [
          { month: "Month 1", users: 2500 },
          { month: "Month 2", users: 5500 },
          { month: "Month 3", users: 10000 },
        ]
      },
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
      image: "/api/placeholder/550/300",
      liveDemo: "https://glimpse.example.com"
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
      metrics: {
        teamComposition: [
          { role: "Backend Devs", percentage: 50 },
          { role: "Frontend Devs", percentage: 25 },
          { role: "AI Specialists", percentage: 25 }
        ],
        timeline: [
          { phase: "Research", duration: "3 weeks" },
          { phase: "Core Engine", duration: "6 weeks" },
          { phase: "UI Development", duration: "4 weeks" },
          { phase: "Testing & Refinement", duration: "3 weeks" }
        ],
        performanceMetrics: [
          { metric: "Code Optimization", improvement: "28%" },
          { metric: "Bug Detection", improvement: "42%" },
          { metric: "Review Speed", improvement: "68%" }
        ]
      },
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
      image: "/api/placeholder/550/300",
      liveDemo: "https://codecraft.example.com"
    }
  ];

  // Effect to auto-advance the process steps when in guided mode
  useEffect(() => {
    if (activeTab === 'process' && processInView && interactionMode === 'guided') {
      const interval = setInterval(() => {
        if (!isFullscreen) {
          setActiveStep((prev) => (prev + 1) % steps.length);
        }
      }, 6000);
      
      return () => clearInterval(interval);
    }
  }, [activeTab, processInView, steps.length, isFullscreen, interactionMode]);

  // Effect to handle background animations based on scroll and active section
  useEffect(() => {
    if (isInView && animateBackground) {
      backgroundControls.start({
        scale: [1, 1.05, 1],
        opacity: [0.5, 0.8, 0.5],
        transition: { 
          duration: 15, 
          ease: "easeInOut", 
          repeat: Infinity,
          repeatType: "mirror" 
        }
      });
    } else {
      backgroundControls.stop();
    }

    if (isInView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, backgroundControls, isInView, animateBackground]);

  // Handle showcase transition with improved animation
  const handleShowcaseChange = (index) => {
    if (isAnimating || index === activeShowcase) return;
    
    setIsAnimating(true);
    setActiveShowcase(index);
    
    // Reset animation flag after transition completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  // Handle toggle fullscreen for steps with enhanced functionality
  const toggleFullscreen = (index) => {
    if (isFullscreen && activeStep !== index) {
      setActiveStep(index);
      return;
    }
    
    setIsFullscreen(!isFullscreen);
    setActiveStep(index);
    
    // Pause background animations when in fullscreen for better performance
    setAnimateBackground(!isFullscreen);
  };

  // Toggle expanded role with optional animation control
  const toggleRoleExpansion = (index, forceState = null) => {
    if (forceState !== null) {
      setExpandedRoleIndex(forceState === true ? index : null);
    } else {
      setExpandedRoleIndex(expandedRoleIndex === index ? null : index);
    }
  };

  // Switch interaction modes with smooth transition
  const changeInteractionMode = (mode) => {
    setInteractionMode(mode);
    
    // Reset state based on mode
    if (mode === 'compare') {
      setCompareItems([]);
    } else if (mode === 'explore') {
      setViewMode('default');
    }
  };

  // Toggle compare mode for roles or steps
  const toggleCompareItem = (item, type) => {
    const exists = compareItems.find(i => i.id === item.id && i.type === type);
    
    if (exists) {
      setCompareItems(compareItems.filter(i => i.id !== item.id || i.type !== type));
    } else if (compareItems.length < 3) {
      setCompareItems([...compareItems, { ...item, type }]);
    }
  };

  // Filter roles based on criteria
  const filterRolesByProperty = (property, threshold) => {
    if (!property) {
      setFilteredRoles(null);
      return;
    }
    
    const filtered = roles.filter(role => role[property] >= threshold);
    setFilteredRoles(filtered);
  };

  // Animation variants with enhanced transitions
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

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.8 }
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

  const slideUpVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section className={styles.howItWorks} ref={sectionRef}>
      {/* Enhanced animated background with reactive behavior */}
      <motion.div 
        className={styles.gridBackground} 
        animate={backgroundControls}
        initial={{ opacity: 0.5, scale: 1 }}
      />
      
      {/* Advanced floating decorative elements with interaction */}
      <div className={styles.floatingShapes}>
        <motion.div
          className={`${styles.floatingShape} ${styles.shape1}`}
          animate={{
            x: [0, 15, 0],
            y: [0, -15, 0],
            rotate: [0, 5, 0],
          }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          style={{ 
            filter: `blur(${activeTab === 'process' ? '40px' : '60px'})`,
            opacity: activeTab === 'process' ? 0.09 : 0.05
          }}
        />
        <motion.div
          className={`${styles.floatingShape} ${styles.shape2}`}
          animate={{
            x: [0, -20, 0],
            y: [0, 20, 0],
            rotate: [0, -10, 0],
          }}
          transition={{ repeat: Infinity, duration: 9, ease: "easeInOut" }}
          style={{ 
            filter: `blur(${activeTab === 'roles' ? '40px' : '60px'})`,
            opacity: activeTab === 'roles' ? 0.09 : 0.05
          }}
        />
        <motion.div
          className={`${styles.floatingShape} ${styles.shape3}`}
          animate={{
            x: [0, 10, 0],
            y: [0, 10, 0],
            rotate: [0, 15, 0],
          }}
          transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1 }}
          style={{ 
            filter: `blur(${activeTab === 'showcase' ? '40px' : '60px'})`,
            opacity: activeTab === 'showcase' ? 0.09 : 0.05
          }}
        />
      </div>
      
      {/* Enhanced Section Header with better animation */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className={styles.sectionHeader}
      >
        <motion.div 
          className={styles.badgeWrapper}
          whileHover={{ y: -3, scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <span className={styles.badge}>The Process</span>
        </motion.div>
        <h2 className={styles.sectionTitle}>
          How <span className={styles.highlight}>PODNEX</span> Works
        </h2>
        <p className={styles.sectionSubtitle}>
          An innovative ecosystem where collaboration, transparency, and fair attribution drive successful digital projects
        </p>
      </motion.div>

      {/* Enhanced Tab Selector with hover effects */}
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

      {/* Interaction Mode Selector - new feature */}
      {activeTab !== 'showcase' && (
        <motion.div 
          className={styles.interactionModes}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <span className={styles.interactionLabel}>Interaction Mode:</span>
          <div className={styles.modeSwitcher}>
            <button 
              className={`${styles.modeButton} ${interactionMode === 'guided' ? styles.activeMode : ''}`}
              onClick={() => changeInteractionMode('guided')}
            >
              <Play size={14} />
              <span>Guided</span>
            </button>
            <button 
              className={`${styles.modeButton} ${interactionMode === 'explore' ? styles.activeMode : ''}`}
              onClick={() => changeInteractionMode('explore')}
            >
              <Eye size={14} />
              <span>Explore</span>
            </button>
            <button 
              className={`${styles.modeButton} ${interactionMode === 'compare' ? styles.activeMode : ''}`}
              onClick={() => changeInteractionMode('compare')}
            >
              <BarChart2 size={14} />
              <span>Compare</span>
            </button>
          </div>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {/* Process View with enhanced interactive timeline */}
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
            {/* Interactive process timeline */}
            <motion.div 
              ref={timelineRef}
              className={styles.processTimeline}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {interactionMode === 'compare' ? (
                <div className={styles.compareSelector}>
                  <h4 className={styles.compareTitle}>
                    <BarChart2 size={16} />
                    <span>Select steps to compare (max 3)</span>
                  </h4>
                  <div className={styles.compareOptions}>
                    {steps.map((step, index) => (
                      <motion.button 
                        key={`compare-${index}`}
                        className={`${styles.compareOption} ${compareItems.find(i => i.title === step.title) ? styles.selected : ''}`}
                        onClick={() => toggleCompareItem(step, 'step')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        style={{ 
                          backgroundColor: compareItems.find(i => i.title === step.title) ? `${step.color}30` : 'rgba(255, 255, 255, 0.05)',
                          borderColor: compareItems.find(i => i.title === step.title) ? step.color : 'rgba(255, 255, 255, 0.1)',
                          color: compareItems.find(i => i.title === step.title) ? step.color : ''
                        }}
                      >
                        <div className={styles.optionIcon}>
                          {React.cloneElement(step.icon, { size: 18 })}
                        </div>
                        <span>{step.title}</span>
                        {compareItems.find(i => i.title === step.title) && (
                          <CheckCircle size={16} className={styles.selectedMark} />
                        )}
                      </motion.button>
                    ))}
                  </div>
                  
                  {compareItems.length > 1 && (
                    <motion.div 
                      className={styles.compareResults}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className={styles.compareTable}>
                        <div className={styles.compareHeader}>
                          <div className={styles.compareCell}>Attribute</div>
                          {compareItems.map((item, idx) => (
                            <div 
                              key={`header-${idx}`} 
                              className={styles.compareCell}
                              style={{ color: item.color }}
                            >
                              {item.title}
                            </div>
                          ))}
                        </div>
                        
                        <div className={styles.compareRow}>
                          <div className={styles.compareCell}>Description</div>
                          {compareItems.map((item, idx) => (
                            <div key={`desc-${idx}`} className={styles.compareCell}>
{item.description}
                            </div>
                          ))}
                        </div>
                        
                        <div className={styles.compareRow}>
                          <div className={styles.compareCell}>Key Activities</div>
                          {compareItems.map((item, idx) => (
                            <div key={`detail-${idx}`} className={styles.compareCell}>
                              <ul className={styles.compareList}>
                                {item.details.map((detail, i) => (
                                  <li key={i}>{detail}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                        
                        <div className={styles.compareRow}>
                          <div className={styles.compareCell}>Stats</div>
                          {compareItems.map((item, idx) => (
                            <div key={`stats-${idx}`} className={styles.compareCell}>
                              {item.stats && (
                                <ul className={styles.statsCompareList}>
                                  {Object.entries(item.stats).map(([key, value], i) => (
                                    <li key={i}>
                                      <span className={styles.statLabel}>{key}:</span> 
                                      <span className={styles.statValue} style={{ color: item.color }}>{value}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <motion.button 
                        className={styles.resetCompare}
                        onClick={() => setCompareItems([])}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <X size={14} />
                        <span>Reset Comparison</span>
                      </motion.button>
                    </motion.div>
                  )}
                </div>
              ) : (
                <>
                  {steps.map((step, index) => (
                    <motion.div 
                      key={`step-${index}`}
                      className={`${styles.timelineStep} ${activeStep === index ? styles.active : ''}`}
                      onClick={() => interactionMode === 'explore' ? toggleFullscreen(index) : setActiveStep(index)}
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
                        whileHover={interactionMode === 'explore' ? { scale: 1.1, rotate: 5 } : {}}
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
                  
                  {/* Timeline markers for better visualization */}
                  <div className={styles.timelineMarkers}>
                    {steps.map((_, index) => (
                      <div 
                        key={`marker-${index}`} 
                        className={styles.timelineMarker}
                        style={{ left: `${(index / (steps.length - 1)) * 100}%` }}
                      />
                    ))}
                  </div>
                </>
              )}
            </motion.div>

            {/* Main content area with interactive elements */}
            <div className={styles.processContent}>
              <AnimatePresence mode="wait">
                {interactionMode === 'compare' && compareItems.length === 0 ? (
                  <motion.div 
                    className={styles.comparePrompt}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className={styles.emptyCompare}>
                      <BarChart2 size={40} className={styles.emptyIcon} />
                      <h3>Compare Steps</h3>
                      <p>Select 2-3 steps above to see a detailed comparison of their features, benefits, and metrics.</p>
                    </div>
                  </motion.div>
                ) : isFullscreen ? (
                  /* Enhanced Fullscreen step view with more interactive elements */
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
                      <motion.div 
                        className={styles.fullscreenIconContainer}
                        style={{ backgroundColor: steps[activeStep].color }}
                        whileHover={{ rotate: [0, -10, 10, -5, 0], transition: { duration: 0.5 } }}
                      >
                        {React.cloneElement(steps[activeStep].icon, { size: 48, color: "#000" })}
                      </motion.div>
                      
                      <div className={styles.fullscreenTitleWrapper}>
                        <div className={styles.fullscreenTag}>
                          {steps[activeStep].tag}
                        </div>
                        <h3 className={styles.fullscreenTitle}>
                          {steps[activeStep].title}
                        </h3>
                      </div>
                      
                      {/* View mode toggle */}
                      <div className={styles.viewModeToggle}>
                        <button 
                          className={`${styles.viewModeButton} ${viewMode === 'default' ? styles.activeViewMode : ''}`}
                          onClick={() => setViewMode('default')}
                        >
                          <FileText size={16} />
                        </button>
                        <button 
                          className={`${styles.viewModeButton} ${viewMode === 'stats' ? styles.activeViewMode : ''}`}
                          onClick={() => setViewMode('stats')}
                        >
                          <PieChart size={16} />
                        </button>
                        <button 
                          className={`${styles.viewModeButton} ${viewMode === 'simulation' ? styles.activeViewMode : ''}`}
                          onClick={() => setViewMode('simulation')}
                        >
                          <Play size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <p className={styles.fullscreenDescription}>
                      {steps[activeStep].description}
                    </p>
                    
                    <AnimatePresence mode="wait">
                      {viewMode === 'default' && (
                        <motion.div 
                          key="default-view"
                          className={styles.fullscreenDetails}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <h4>Key Activities</h4>
                          <ul className={styles.detailedList}>
                            {steps[activeStep].details.map((detail, i) => (
                              <motion.li 
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                style={{ '--bullet-color': steps[activeStep].color }}
                                whileHover={{ x: 5, transition: { duration: 0.2 } }}
                              >
                                <CheckCircle size={18} style={{ color: steps[activeStep].color }} />
                                <span>{detail}</span>
                              </motion.li>
                            ))}
                          </ul>
                          
                          <div className={styles.interactivePrompt}>
                            <div className={styles.promptIcon}>
                              <MousePointer size={16} />
                            </div>
                            <p>Switch to Statistics or Simulation view for more insights</p>
                          </div>
                        </motion.div>
                      )}
                      
                      {viewMode === 'stats' && (
                        <motion.div 
                          key="stats-view"
                          className={styles.statsView}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className={styles.statsHeader}>
                            <h4>Performance Metrics</h4>
                            <div className={styles.statsSubtitle}>
                              Based on real user data from the PODNEX platform
                            </div>
                          </div>
                          
                          <div className={styles.statsGrid}>
                            {steps[activeStep].stats && Object.entries(steps[activeStep].stats).map(([key, value], idx) => (
                              <motion.div 
                                key={idx}
                                className={styles.statCard}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                whileHover={{ 
                                  y: -5, 
                                  boxShadow: `0 10px 25px rgba(0,0,0,0.2), 0 0 15px ${steps[activeStep].color}30`
                                }}
                              >
                                <div className={styles.statLabel}>{key}</div>
                                <div 
                                  className={styles.statValue}
                                  style={{ color: steps[activeStep].color }}
                                >
                                  {value}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                          
                          <div className={styles.statsVisual}>
                            <div className={styles.statChartTitle}>Success Rate by Team Size</div>
                            <div className={styles.mockChart}>
                              <div className={styles.chartBars}>
                                {[65, 78, 92, 85, 75].map((height, idx) => (
                                  <motion.div 
                                    key={idx} 
                                    className={styles.chartBar}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${height}%` }}
                                    transition={{ delay: 0.3 + (idx * 0.1), duration: 0.5 }}
                                    style={{ backgroundColor: steps[activeStep].color }}
                                  />
                                ))}
                              </div>
                              <div className={styles.chartLabels}>
                                {['2', '3-4', '5-6', '7-8', '9+'].map((label, idx) => (
                                  <div key={idx} className={styles.chartLabel}>{label}</div>
                                ))}
                              </div>
                              <div className={styles.chartYAxis}>
                                <div className={styles.chartYLabel}>Success %</div>
                              </div>
                              <div className={styles.chartXAxis}>
                                <div className={styles.chartXLabel}>Team Members</div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                      
                      {viewMode === 'simulation' && (
                        <motion.div 
                          key="simulation-view"
                          className={styles.simulationView}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className={styles.simulationHeader}>
                            <h4>Interactive Simulation</h4>
                            <p>Experience the {steps[activeStep].title.toLowerCase()} process with this interactive demo</p>
                          </div>
                          
                          <div className={styles.simulationContainer}>
                            <div className={styles.simulationControls}>
                              {steps[activeStep].interactive.options.map((option, idx) => (
                                <motion.button 
                                  key={idx}
                                  className={styles.simulationOption}
                                  whileHover={{ 
                                    scale: 1.05, 
                                    backgroundColor: `${steps[activeStep].color}30`,
                                    color: steps[activeStep].color,
                                    borderColor: steps[activeStep].color
                                  }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  {option}
                                </motion.button>
                              ))}
                            </div>
                            
                            <div className={styles.simulationDisplay}>
                              <div className={styles.simulationPlaceholder}>
                                <div className={styles.simulationIcon}>
                                  {React.cloneElement(steps[activeStep].icon, { size: 40 })}
                                </div>
                                <p>Select an option above to begin the interactive {steps[activeStep].interactive.simulation} demo</p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
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
                  /* Enhanced Compact step cards with better interactions */
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
                        whileHover={showHoverAnimation ? { y: -8 } : {}}
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
                          </h3>
                          <p>{step.description}</p>
                          
                          {/* Added preview stats */}
                          {activeStep === index && (
                            <motion.div 
                              className={styles.previewStats}
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              transition={{ delay: 0.2 }}
                            >
                              {Object.entries(step.stats).slice(0, 2).map(([key, value], i) => (
                                <div key={i} className={styles.previewStat}>
                                  <span className={styles.previewStatLabel}>{key}:</span>
                                  <span 
                                    className={styles.previewStatValue}
                                    style={{ color: step.color }}
                                  >
                                    {value}
                                  </span>
                                </div>
                              ))}
                            </motion.div>
                          )}
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

        {/* Enhanced Team Roles View with filtering and comparison features */}
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
            
            {/* Added filter controls for enhanced interaction */}
            {interactionMode === 'explore' && (
              <motion.div 
                className={styles.roleFilters}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className={styles.filterLabel}>
                  <Filter size={16} />
                  <span>Filter by:</span>
                </div>
                
                <div className={styles.filterButtons}>
                  <button 
                    className={`${styles.filterButton} ${filteredRoles === null ? styles.activeFilter : ''}`}
                    onClick={() => setFilteredRoles(null)}
                  >
                    All Roles
                  </button>
                  <button 
                    className={`${styles.filterButton} ${filteredRoles?.some(r => r.successRate >= 80) && filteredRoles?.length !== roles.length ? styles.activeFilter : ''}`}
                    onClick={() => filterRolesByProperty('successRate', 80)}
                  >
                    High Success
                  </button>
                  <button 
                    className={`${styles.filterButton} ${filteredRoles?.some(r => r.popularity >= 80) && filteredRoles?.length !== roles.length ? styles.activeFilter : ''}`}
                    onClick={() => filterRolesByProperty('popularity', 80)}
                  >
                    Most Popular
                  </button>
                  <button 
                    className={`${styles.filterButton} ${filteredRoles?.some(r => r.difficulty <= 65) && filteredRoles?.length !== roles.length ? styles.activeFilter : ''}`}
                    onClick={() => filterRolesByProperty('difficulty', 65)}
                  >
                    Beginner Friendly
                  </button>
                </div>
              </motion.div>
            )}
            
            {interactionMode === 'compare' ? (
              <div className={styles.compareSelector}>
                <h4 className={styles.compareTitle}>
                  <BarChart2 size={16} />
                  <span>Select roles to compare (max 3)</span>
                </h4>
                <div className={styles.compareOptions}>
                  {roles.map((role, index) => (
                    <motion.button 
                      key={`compare-${index}`}
                      className={`${styles.compareOption} ${compareItems.find(i => i.title === role.title) ? styles.selected : ''}`}
                      onClick={() => toggleCompareItem(role, 'role')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      style={{ 
                        backgroundColor: compareItems.find(i => i.title === role.title) ? `${role.color}30` : 'rgba(255, 255, 255, 0.05)',
                        borderColor: compareItems.find(i => i.title === role.title) ? role.color : 'rgba(255, 255, 255, 0.1)',
                        color: compareItems.find(i => i.title === role.title) ? role.color : ''
                      }}
                    >
                      <div className={styles.optionIcon}>
                        {React.cloneElement(role.icon, { size: 18 })}
                      </div>
                      <span>{role.title}</span>
                      {compareItems.find(i => i.title === role.title) && (
                        <CheckCircle size={16} className={styles.selectedMark} />
                      )}
                    </motion.button>
                  ))}
                </div>
                
                {compareItems.length > 1 && (
                  <motion.div 
                    className={styles.compareResults}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className={styles.compareTable}>
                      <div className={styles.compareHeader}>
                        <div className={styles.compareCell}>Attribute</div>
                        {compareItems.map((item, idx) => (
                          <div 
                            key={`header-${idx}`} 
                            className={styles.compareCell}
                            style={{ color: item.color }}
                          >
                            {item.title}
                          </div>
                        ))}
                      </div>
                      
                      <div className={styles.compareRow}>
                        <div className={styles.compareCell}>Description</div>
                        {compareItems.map((item, idx) => (
                          <div key={`desc-${idx}`} className={styles.compareCell}>
                            {item.description}
                          </div>
                        ))}
                      </div>
                      
                      <div className={styles.compareRow}>
                        <div className={styles.compareCell}>Key Benefits</div>
                        {compareItems.map((item, idx) => (
                          <div key={`benefits-${idx}`} className={styles.compareCell}>
                            <ul className={styles.compareList}>
                              {item.benefits.map((benefit, i) => (
                                <li key={i}>{benefit}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                      
                      <div className={styles.compareRow}>
                        <div className={styles.compareCell}>Core Skills</div>
                        {compareItems.map((item, idx) => (
                          <div key={`skills-${idx}`} className={styles.compareCell}>
                            <div className={styles.skillCompareContainer}>
                              {item.skills.map((skill, i) => (
                                <span 
                                  key={i} 
                                  className={styles.skillCompareTag}
                                  style={{ 
                                    backgroundColor: `${item.color}15`,
                                    color: item.color,
                                    borderColor: `${item.color}30`
                                  }}
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className={styles.compareRow}>
                        <div className={styles.compareCell}>Success Rate</div>
                        {compareItems.map((item, idx) => (
                          <div key={`success-${idx}`} className={styles.compareCell}>
                            <div className={styles.progressContainer}>
                              <div 
                                className={styles.progressBar} 
                                style={{ 
                                  width: `${item.successRate}%`,
                                  backgroundColor: item.color 
                                }}
                              />
                              <span className={styles.progressValue}>{item.successRate}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className={styles.compareRow}>
                        <div className={styles.compareCell}>Popularity</div>
                        {compareItems.map((item, idx) => (
                          <div key={`popularity-${idx}`} className={styles.compareCell}>
                            <div className={styles.progressContainer}>
                              <div 
                                className={styles.progressBar} 
                                style={{ 
                                  width: `${item.popularity}%`,
                                  backgroundColor: item.color 
                                }}
                              />
                              <span className={styles.progressValue}>{item.popularity}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className={styles.compareRow}>
                        <div className={styles.compareCell}>Difficulty Level</div>
                        {compareItems.map((item, idx) => (
                          <div key={`difficulty-${idx}`} className={styles.compareCell}>
                            <div className={styles.progressContainer}>
                              <div 
                                className={styles.progressBar} 
                                style={{ 
                                  width: `${item.difficulty}%`,
                                  backgroundColor: item.color 
                                }}
                              />
                              <span className={styles.progressValue}>{item.difficulty}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <motion.button 
                      className={styles.resetCompare}
                      onClick={() => setCompareItems([])}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <X size={14} />
                      <span>Reset Comparison</span>
                    </motion.button>
                  </motion.div>
                )}
              </div>
            ) : (
              <motion.div 
                className={styles.rolesGrid}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {(filteredRoles || roles).map((role, index) => (
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
                    
                    {/* Role metrics indicators */}
                    {interactionMode === 'explore' && !expandedRoleIndex && (
                      <motion.div 
                        className={styles.roleMetrics}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <div className={styles.metricItem}>
                          <span className={styles.metricLabel}>Success</span>
                          <div className={styles.metricBar}>
                            <motion.div 
                              className={styles.metricFill}
                              style={{ backgroundColor: role.color, width: `${role.successRate}%` }}
                              initial={{ width: 0 }}
                              animate={{ width: `${role.successRate}%` }}
                              transition={{ duration: 0.8, delay: 0.3 }}
                            />
                          </div>
                        </div>
                        <div className={styles.metricItem}>
                          <span className={styles.metricLabel}>Demand</span>
                          <div className={styles.metricBar}>
                            <motion.div 
                              className={styles.metricFill}
                              style={{ backgroundColor: role.color, width: `${role.popularity}%` }}
                              initial={{ width: 0 }}
                              animate={{ width: `${role.popularity}%` }}
                              transition={{ duration: 0.8, delay: 0.4 }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                    
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
                                  onMouseEnter={() => setHighlightedBenefit(benefit)}
                                  onMouseLeave={() => setHighlightedBenefit(null)}
                                  className={highlightedBenefit === benefit ? styles.highlightedBenefit : ''}
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
                                  whileHover={{ 
                                    scale: 1.1, 
                                    backgroundColor: `${role.color}25`,
                                  }}
                                >
                                  {skill}
                                </motion.span>
                              ))}
                            </div>
                          </div>
                          
                          {/* Added detailed stats */}
                          <div className={styles.roleDetailedStats}>
                            <h4>Performance Stats</h4>
                            <div className={styles.statsList}>
                              {Object.entries(role.stats).map(([key, value], idx) => (
                                <motion.div 
                                  key={idx}
                                  className={styles.statItem}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.3 + (idx * 0.1) }}
                                >
                                  <div className={styles.statLabel}>{key}</div>
                                  <div 
                                    className={styles.statValue}
                                    style={{ color: role.color }}
                                  >
                                    {value}
                                  </div>
                                </motion.div>
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
            )}
            
            {/* Enhanced highlight section with interaction */}
            <motion.div 
              className={styles.rolesHighlight}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              style={{ background: `linear-gradient(45deg, rgba(232, 197, 71, 0.05), rgba(0, 0, 0, 0))` }}
              whileHover={{ 
                boxShadow: '0 15px 30px rgba(0, 0, 0, 0.2), 0 0 20px rgba(232, 197, 71, 0.2)',
                y: -5
              }}
            >
              <motion.div 
                className={styles.highlightIcon}
                whileHover={{ rotate: [0, -10, 10, -5, 0], transition: { duration: 0.5 } }}
              >
                <Shield size={24} />
              </motion.div>
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
        
        {/* Enhanced Success Stories View with interactive charts */}
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
                                whileHover={{ y: -5, transition: { duration: 0.2 } }}
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
                          
                          {/* View mode toggle for showcases */}
                          <div className={styles.showcaseViewToggle}>
                            <button 
                              className={`${styles.viewToggleButton} ${viewMode === 'default' ? styles.activeView : ''}`}
                              onClick={() => setViewMode('default')}
                            >
                              <FileText size={16} />
                              <span>Story</span>
                            </button>
                            <button 
                              className={`${styles.viewToggleButton} ${viewMode === 'metrics' ? styles.activeView : ''}`}
                              onClick={() => setViewMode('metrics')}
                            >
                              <BarChart2 size={16} />
                              <span>Metrics</span>
                            </button>
                            <button 
                              className={`${styles.viewToggleButton} ${viewMode === 'demo' ? styles.activeView : ''}`}
                              onClick={() => setViewMode('demo')}
                            >
                              <Play size={16} />
                              <span>Demo</span>
                            </button>
                          </div>
                          
                          <AnimatePresence mode="wait">
                            {viewMode === 'default' && (
                              <motion.div 
                                key="default-view"
                                className={styles.showcaseJourney}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                              >
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
                                      whileHover={{ x: 5, transition: { duration: 0.2 } }}
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
                              </motion.div>
                            )}
                            
                            {viewMode === 'metrics' && (
                              <motion.div 
                                key="metrics-view"
                                className={styles.showcaseMetrics}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <h4 className={styles.metricsTitle}>
                                  <PieChart size={18} />
                                  <span>Performance Metrics</span>
                                </h4>
                                
                                <div className={styles.metricsSection}>
                                  <h5>Team Composition</h5>
                                  <div className={styles.pieChartContainer}>
                                    <div className={styles.pieChart}>
                                      {showcase.metrics.teamComposition.map((segment, idx) => {
                                        const prevSegments = showcase.metrics.teamComposition
                                          .slice(0, idx)
                                          .reduce((sum, seg) => sum + seg.percentage, 0);
                                        
                                        return (
                                          <motion.div 
                                            key={idx}
                                            className={styles.pieSegment}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.2 + (idx * 0.1) }}
                                            style={{
                                              backgroundColor: `hsl(${(idx * 40) + 220}, 70%, 50%)`,
                                              clipPath: `conic-gradient(from ${prevSegments * 3.6}deg, currentColor ${segment.percentage * 3.6}deg, transparent 0)`
                                            }}
                                            whileHover={{ scale: 1.05 }}
                                          />
                                        );
                                      })}
                                    </div>
                                    <div className={styles.pieLabels}>
                                      {showcase.metrics.teamComposition.map((segment, idx) => (
                                        <div key={idx} className={styles.pieLabel}>
                                          <div 
                                            className={styles.pieLabelColor}
                                            style={{ backgroundColor: `hsl(${(idx * 40) + 220}, 70%, 50%)` }}
                                          />
                                          <span className={styles.pieLabelText}>{segment.role}</span>
                                          <span className={styles.pieLabelValue}>{segment.percentage}%</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                
                                <div className={styles.metricsSection}>
                                  <h5>Timeline</h5>
                                  <div className={styles.barChartContainer}>
                                    {showcase.metrics.timeline.map((phase, idx) => (
                                      <motion.div 
                                        key={idx}
                                        className={styles.timelineBar}
                                        initial={{ width: 0 }}
                                        animate={{ width: '100%' }}
                                        transition={{ delay: 0.2 + (idx * 0.1), duration: 0.5 }}
                                      >
                                        <div className={styles.timelineBarLabel}>{phase.phase}</div>
                                        <div 
                                          className={styles.timelineBarFill}
                                          style={{ 
                                            backgroundColor: `${showcase.color}${80 - (idx * 15)}`,
                                            width: `${parseInt(phase.duration) / 16 * 100}%`
                                          }}
                                        >
                                          <span className={styles.timelineBarValue}>{phase.duration}</span>
                                        </div>
                                      </motion.div>
                                    ))}
                                  </div>
                                </div>
                                
                                <div className={styles.metricsSection}>
                                  <h5>{showcase.metrics.revenue ? 'Revenue Growth' : showcase.metrics.userGrowth ? 'User Growth' : 'Performance Improvement'}</h5>
                                  <div className={styles.lineChartContainer}>
                                    <div className={styles.lineChart}>
                                      {showcase.metrics.revenue && showcase.metrics.revenue.map((point, idx) => (
                                        <motion.div 
                                          key={idx}
                                          className={styles.chartPoint}
                                          initial={{ opacity: 0, y: 20 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          transition={{ delay: 0.4 + (idx * 0.1) }}
                                          style={{ 
                                            left: `${idx / (showcase.metrics.revenue.length - 1) * 100}%`,
                                            bottom: `${point.amount / 12000 * 100}%`
                                          }}
                                        >
                                          <div 
                                            className={styles.chartPointDot}
                                            style={{ backgroundColor: showcase.color }}
                                          />
                                          <div className={styles.chartPointLabel}>${point.amount}</div>
                                        </motion.div>
                                      ))}
                                      
                                      {showcase.metrics.userGrowth && showcase.metrics.userGrowth.map((point, idx) => (
                                        <motion.div 
                                          key={idx}
                                          className={styles.chartPoint}
                                          initial={{ opacity: 0, y: 20 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          transition={{ delay: 0.4 + (idx * 0.1) }}
                                          style={{ 
                                            left: `${idx / (showcase.metrics.userGrowth.length - 1) * 100}%`,
                                            bottom: `${point.users / 10000 * 100}%`
                                          }}
                                        >
                                          <div 
                                            className={styles.chartPointDot}
                                            style={{ backgroundColor: showcase.color }}
                                          />
                                          <div className={styles.chartPointLabel}>{point.users.toLocaleString()}</div>
                                        </motion.div>
                                      ))}
                                      
                                      {showcase.metrics.performanceMetrics && showcase.metrics.performanceMetrics.map((point, idx) => (
                                        <motion.div 
                                          key={idx}
                                          className={styles.chartPoint}
                                          initial={{ opacity: 0, y: 20 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          transition={{ delay: 0.4 + (idx * 0.1) }}
                                          style={{ 
                                            left: `${idx / (showcase.metrics.performanceMetrics.length - 1) * 100}%`,
                                            bottom: `${parseInt(point.improvement) / 70 * 100}%`
                                          }}
                                        >
                                          <div 
                                            className={styles.chartPointDot}
                                            style={{ backgroundColor: showcase.color }}
                                          />
                                          <div className={styles.chartPointLabel}>{point.improvement}</div>
                                        </motion.div>
                                      ))}
                                    </div>
                                    
                                    <div className={styles.chartAxis}>
                                      {(showcase.metrics.revenue || showcase.metrics.userGrowth).map((point, idx) => (
                                        <div key={idx} className={styles.chartAxisLabel}>
                                          {point.month}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                            
                            {viewMode === 'demo' && (
                              <motion.div 
                                key="demo-view"
                                className={styles.showcaseDemo}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <h4 className={styles.demoTitle}>
                                  <Play size={18} />
                                  <span>Live Demo</span>
                                </h4>
                                
                                <div className={styles.demoContainer}>
                                  <div className={styles.demoPreview}>
                                    <motion.div 
                                      className={styles.demoImageContainer}
                                      whileHover={{ scale: 1.02 }}
                                    >
                                      <img 
                                        src={showcase.image} 
                                        alt={`${showcase.title} demo`}
                                        className={styles.demoImage}
                                      />
                                      <div className={styles.demoOverlay}>
                                        <motion.div 
                                          className={styles.playButton}
                                          whileHover={{ scale: 1.1 }}
                                          whileTap={{ scale: 0.9 }}
                                        >
                                          <Play size={24} />
                                        </motion.div>
                                      </div>
                                    </motion.div>
                                  </div>
                                  
                                  <div className={styles.demoInfo}>
                                    <h5>Experience {showcase.title}</h5>
                                    <p>Try the interactive demo to see how this project works in real-time.</p>
                                    
                                    <motion.a 
                                      href={showcase.liveDemo}
                                      className={styles.demoLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      style={{ backgroundColor: showcase.color }}
                                    >
                                      <span>Visit Live Demo</span>
                                      <ArrowRight size={16} />
                                    </motion.a>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                          
                          {viewMode === 'default' && (
                            <motion.button 
                              className={styles.showcaseButton}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              style={{ backgroundColor: showcase.color }}
                            >
                              View Case Study
                              <ArrowRight size={16} />
                            </motion.button>
                          )}
                        </div>
                        
                        <div className={styles.showcaseVisual}>
                          <div className={styles.testimonialWrapper}>
                            <motion.div 
                              className={styles.showcaseTestimonial}
                              style={{ borderColor: `${showcase.color}30` }}
                              whileHover={{ 
                                rotateY: 0, 
                                translateY: -5,
                                boxShadow: `0 15px 30px rgba(0,0,0,0.2), 0 0 15px ${showcase.color}30`
                              }}
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
                            </motion.div>
                          </div>
                          
                          <div className={styles.imageContainer}>
                            <motion.div 
                              className={styles.imageWrapper}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 }}
                              style={{ boxShadow: `0 20px 40px rgba(0, 0, 0, 0.3), 0 0 30px ${showcase.color}20` }}
                              whileHover={{ scale: 1.03 }}
                            >
                              <img src={showcase.image} alt={showcase.title} />
                              <div 
                                className={styles.imageBorder} 
                                style={{ borderColor: showcase.color }} 
                              />
                              
                              {/* Interactive overlay for image */}
                              <motion.div 
                                className={styles.imageOverlay}
                                initial={{ opacity: 0 }}
                                whileHover={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                              >
                                <motion.button 
                                  className={styles.imageAction}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <Maximize size={20} />
                                </motion.button>
                              </motion.div>
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

              {/* Enhanced showcase pagination with progress indicator */}
              <div className={styles.showcaseNav}>
                <div className={styles.showcaseProgress}>
                  <div className={styles.showcaseProgressTrack}>
                    <motion.div 
                      className={styles.showcaseProgressFill}
                      initial={{ width: 0 }}
                      animate={{ width: `${(activeShowcase / (showcases.length - 1)) * 100}%` }}
                      transition={{ duration: 0.5 }}
                      style={{ backgroundColor: showcases[activeShowcase].color }}
                    />
                  </div>
                </div>
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced CTA Section with animation */}
      <motion.div 
        className={styles.ctaContainer}
        initial={{ opacity: 0, y: 30 }}
        animate={controls}
        variants={{
          visible: { opacity: 1, y: 0, transition: { delay: 0.6, duration: 0.8 } }
        }}
        whileHover={{ 
          y: -10,
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 30px rgba(232, 197, 71, 0.2)',
          transition: { duration: 0.3 }
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