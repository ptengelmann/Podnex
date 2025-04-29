import React, { useState, useRef, useEffect } from 'react';
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
  ArrowRight
} from 'lucide-react';

const HowItWorksSection = () => {
  const [activeStep, setActiveStep] = useState(null);
  const [activeTab, setActiveTab] = useState('process'); // 'process', 'roles', 'showcase'
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeShowcase, setActiveShowcase] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  const sectionRef = useRef(null);
  const showcaseRef = useRef(null);
  const inView = useInView(sectionRef, { once: false, threshold: 0.2 });
  const controls = useAnimation();

  // Process steps data with expanded details
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
      color: '#6B5B95',
      tag: 'Step 01'
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
      color: '#4ECDC4',
      tag: 'Step 02'
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
      color: '#E8C547',
      tag: 'Step 03'
    },
  ];

  // Role categories
  const roles = [
    {
      icon: <Target size={36} />,
      title: 'Pod Creators',
      description: 'Visionaries who initiate Pods with innovative ideas and clear direction.',
      benefits: [
        'Full pod customization',
        'Leadership experience',
        'Higher reputation growth',
        'Portfolio showcasing'
      ],
      color: '#E8C547'
    },
    {
      icon: <Code size={36} />,
      title: 'Developers',
      description: "Technical specialists who bring the Pod's vision to life through code.",
      benefits: [
        'Showcase technical work',
        'Collaborate with designers',
        'Build real-world products',
        'Earn through contributions'
      ],
      color: '#3B82F6'
    },
    {
      icon: <Paintbrush size={36} />,
      title: 'Designers',
      description: "Creative minds who shape the look, feel, and user experience of Pod projects.",
      benefits: [
        'Expand your portfolio',
        'Work on diverse projects',
        'Collaborate with developers',
        'Get real user feedback'
      ],
      color: '#EC4899'
    },
    {
      icon: <Megaphone size={36} />,
      title: 'Marketers',
      description: "Strategic communicators who help Pods reach their target audience effectively.",
      benefits: [
        'Develop marketing campaigns',
        'Build your professional network',
        'Test innovative strategies',
        'Share in launch success'
      ],
      color: '#8B5CF6'
    },
    {
      icon: <MessageSquare size={36} />,
      title: 'Content Writers',
      description: "Wordsmiths who craft compelling narratives and content for Pod projects.",
      benefits: [
        'Diverse writing opportunities',
        'Build a strong portfolio',
        'Collaborate with designers',
        'Earn through contributions'
      ],
      color: '#10B981'
    },
    {
      icon: <Shield size={36} />,
      title: 'QA Testers',
      description: "Quality assurance specialists who ensure Pod products meet high standards.",
      benefits: [
        'Test innovative products',
        'Provide valuable feedback',
        'Improve user experiences',
        'Build technical expertise'
      ],
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
      color: "#10B981",
      image: "/api/placeholder/550/300"
    }
  ];

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

  // Toggle active step
  const toggleStep = (index) => {
    setActiveStep(activeStep === index ? null : index);
  };

  // Automatic showcase rotation
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeTab === 'showcase') {
        setActiveShowcase((prev) => (prev + 1) % showcases.length);
      }
    }, 8000);
    
    return () => clearInterval(interval);
  }, [activeTab, showcases.length]);

  // Scroll to tabs when tab changes
  useEffect(() => {
    if (activeTab === 'showcase' && showcaseRef.current) {
      showcaseRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeTab]);

  return (
    <section className={styles.howItWorks} ref={sectionRef}>
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
        >
          <Zap size={18} />
          Process
        </motion.button>
        
        <motion.button 
          className={`${styles.tabButton} ${activeTab === 'roles' ? styles.activeTab : ''}`}
          variants={tabVariants}
          animate={activeTab === 'roles' ? 'active' : 'inactive'}
          onClick={() => setActiveTab('roles')}
        >
          <UsersIcon size={18} />
          Team Roles
        </motion.button>
        
        <motion.button 
          className={`${styles.tabButton} ${activeTab === 'showcase' ? styles.activeTab : ''}`}
          variants={tabVariants}
          animate={activeTab === 'showcase' ? 'active' : 'inactive'}
          onClick={() => setActiveTab('showcase')}
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className={styles.processView}
          >
            <div className={styles.progressLine}>
              {steps.map((_, index) => (
                <React.Fragment key={`node-${index}`}>
                  <motion.div 
                    className={`${styles.progressNode} ${activeStep === index ? styles.active : ''}`}
                    variants={item}
                    whileHover={{ scale: 1.2 }}
                    style={{ 
                      backgroundColor: activeStep === index ? steps[index].color : '',
                      borderColor: activeStep === index ? steps[index].color : '' 
                    }}
                    onClick={() => toggleStep(index)}
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

            <motion.div 
              className={styles.stepsContainer}
              variants={container}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
            >
              <div className={styles.stepsGrid}>
                {steps.map((step, index) => (
                  <motion.div 
                    key={index} 
                    className={`${styles.stepCard} ${activeStep === index ? styles.active : ''}`}
                    variants={item}
                    whileHover={{ y: -5 }}
                    onClick={() => toggleStep(index)}
                    style={
                      activeStep === index 
                        ? { borderColor: `${step.color}50`, boxShadow: `0 15px 30px rgba(0,0,0,0.2), 0 0 15px ${step.color}30` } 
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
                        {step.icon}
                      </motion.div>
                    </motion.div>
                    
                    <div className={styles.stepContent}>
                      <h3 style={{ color: activeStep === index ? step.color : '' }}>{step.title}</h3>
                      <p>{step.description}</p>
                      
                      <motion.div 
                        className={styles.expandButton}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        style={{ 
                          backgroundColor: activeStep === index ? `${step.color}30` : 'rgba(255, 255, 255, 0.1)',
                          color: activeStep === index ? step.color : '' 
                        }}
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
                                style={{ '--bullet-color': step.color }}
                              >
                                {detail}
                              </motion.li>
                            ))}
                          </ul>
                          
                          <motion.div 
                            className={styles.stepAction}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                          >
                            <button 
                              className={styles.stepActionButton}
                              style={{ 
                                backgroundColor: step.color,
                                boxShadow: `0 5px 15px ${step.color}50`
                              }}
                            >
                              Learn More
                              <ArrowRight size={16} />
                            </button>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Team Roles View */}
        {activeTab === 'roles' && (
          <motion.div 
            key="roles"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
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
              variants={container}
              initial="hidden"
              animate="visible"
            >
              {roles.map((role, index) => (
                <motion.div 
                  key={index}
                  className={styles.roleCard}
                  variants={item}
                  whileHover={{ 
                    y: -8, 
                    boxShadow: `0 20px 30px rgba(0,0,0,0.2), 0 0 15px ${role.color}30`
                  }}
                  style={{ '--role-color': role.color }}
                >
                  <div className={styles.roleHeader}>
                    <div 
                      className={styles.roleIconContainer}
                      style={{ backgroundColor: `${role.color}20`, color: role.color }}
                    >
                      {role.icon}
                    </div>
                    <h3 className={styles.roleTitle}>{role.title}</h3>
                  </div>
                  
                  <p className={styles.roleDescription}>{role.description}</p>
                  
                  <div className={styles.roleBenefits}>
                    <h4>Key Benefits</h4>
                    <ul>
                      {role.benefits.map((benefit, idx) => (
                        <motion.li 
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + (idx * 0.1) }}
                          style={{ '--bullet-color': role.color }}
                        >
                          {benefit}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className={styles.roleCta}>
                    <Star size={16} />
                    <span>Profile Requirements</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            
            <motion.div 
              className={styles.rolesHighlight}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
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
            </motion.div>
          </motion.div>
        )}
        
        {/* Success Stories View */}
        {activeTab === 'showcase' && (
          <motion.div 
            key="showcase"
            ref={showcaseRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className={styles.showcaseView}
          >
            <div className={styles.showcaseContainer}>
              <div className={styles.showcaseNav}>
                {showcases.map((_, index) => (
                  <motion.button
                    key={index}
                    className={`${styles.showcaseDot} ${activeShowcase === index ? styles.active : ''}`}
                    onClick={() => setActiveShowcase(index)}
                    whileHover={{ scale: 1.2 }}
                    style={{ 
                      backgroundColor: activeShowcase === index ? showcases[index].color : '',
                      borderColor: activeShowcase === index ? showcases[index].color : ''
                    }}
                  />
                ))}
              </div>
              
              <div className={styles.showcaseContent}>
                <AnimatePresence mode="wait">
                  {showcases.map((showcase, index) => (
                    activeShowcase === index && (
                      <motion.div
                        key={index}
                        className={styles.showcaseCard}
                        variants={showcaseVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        style={{ '--showcase-color': showcase.color }}
                      >
                        <div className={styles.showcaseInfo}>
                          <div className={styles.showcaseHeader}>
                            <span className={styles.showcaseCategory} style={{ backgroundColor: `${showcase.color}20`, color: showcase.color }}>
                              {showcase.category}
                            </span>
                            <h3 className={styles.showcaseTitle}>{showcase.title}</h3>
                          </div>
                          
                          <p className={styles.showcaseDescription}>{showcase.description}</p>
                          
                          <div className={styles.showcaseStats}>
                            {showcase.stats.map((stat, i) => (
                              <div key={i} className={styles.statItem}>
                                <span className={styles.statValue} style={{ color: showcase.color }}>{stat.value}</span>
                                <span className={styles.statLabel}>{stat.label}</span>
                              </div>
                            ))}
                          </div>
                          
                          <div className={styles.showcaseTestimonial}>
                            <div className={styles.quoteIcon} style={{ color: showcase.color }}>
                              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M11.3 5.1C6.3 5.1 2.1 9.3 2.1 14.5v4.4h4.4v-4.4c0-2.7 2.2-4.9 4.9-4.9h2.2V5.1h-2.3zm8.8 0v4.4h2.2c2.7 0 4.9 2.2 4.9 4.9v4.4h4.4v-4.4c0-5.1-4.2-9.3-9.3-9.3h-2.2z" />
                              </svg>
                            </div>
                            <blockquote>{showcase.testimonial.quote}</blockquote>
                            <cite>{showcase.testimonial.author}</cite>
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
                        
                        <div className={styles.showcaseImage}>
                          <div className={styles.imageContainer}>
                            <motion.div 
                              className={styles.imageWrapper}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 }}
                            >
                              <img src={showcase.image} alt={showcase.title} />
                              <div className={styles.imageBorder} style={{ borderColor: showcase.color }} />
                            </motion.div>
                            <div className={styles.showcaseDecoration} style={{ backgroundColor: `${showcase.color}30` }} />
                          </div>
                        </div>
                      </motion.div>
                    )
                  ))}
                </AnimatePresence>
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