import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  Users, 
  Rocket, 
  Target, 
  Shield, 
  Star, 
  Award, 
  ArrowRight, 
  Code, 
  Paintbrush, 
  MessageSquare, 
  Megaphone,
  ExternalLink,
  Github,
  Linkedin,
  ChevronDown,
  PlayCircle,
  Calendar,
  BookOpen,
  Lightbulb,
  Globe,
  CheckCircle,
  Coffee,
  TrendingUp,
  Eye,
  MousePointer,
  Sparkles,
  ArrowUp,
  Clock,
  DollarSign
} from 'lucide-react';
import styles from './AboutPage.module.scss';

const AboutPage = () => {
  // Enhanced state management
  const [activeSection, setActiveSection] = useState('vision');
  const [activeStory, setActiveStory] = useState(0);
  const [expandedValue, setExpandedValue] = useState(null);
  const [selectedMilestone, setSelectedMilestone] = useState(2); // Current milestone
  const [showVideo, setShowVideo] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredFaq, setHoveredFaq] = useState(null);
  const [animatedStats, setAnimatedStats] = useState({ creators: 0, pods: 0, products: 0 });
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Animation controls and refs
  const controls = useAnimation();
  const aboutRef = useRef(null);
  const visionRef = useRef(null);
  const journeyRef = useRef(null);
  const valuesRef = useRef(null);
  const teamRef = useRef(null);
  const faqRef = useRef(null);
  
  // Scroll progress
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);
  
  // Enhanced stats with animation
  const finalStats = { creators: 247, pods: 89, products: 34 };
  
  // Mouse tracking for parallax effects
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

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animated stats counter
  useEffect(() => {
    const duration = 2000;
    const interval = 50;
    const steps = duration / interval;
    
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setAnimatedStats({
        creators: Math.floor(finalStats.creators * easeOut),
        pods: Math.floor(finalStats.pods * easeOut),
        products: Math.floor(finalStats.products * easeOut)
      });
      
      if (step >= steps) {
        clearInterval(timer);
        setAnimatedStats(finalStats);
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, []);

  // Section observer for navigation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('data-section');
            if (sectionId) {
              setActiveSection(sectionId);
            }
          }
        });
      },
      { threshold: 0.3, rootMargin: '-10% 0px -60% 0px' }
    );

    [visionRef, journeyRef, valuesRef, teamRef, faqRef].forEach(ref => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => {
      [visionRef, journeyRef, valuesRef, teamRef, faqRef].forEach(ref => {
        if (ref.current) observer.unobserve(ref.current);
      });
    };
  }, []);

  // Enhanced Core values data
  const coreValues = [
    {
      id: 'team-sport',
      title: 'Creation is a team sport',
      description: "The best innovations happen through collaboration, not isolation. PODNEX brings together diverse talents to create something greater than the sum of its parts.",
      color: '#E8C547',
      gradient: 'linear-gradient(135deg, #E8C547 0%, #F59E0B 100%)',
      icon: <Users size={28} />,
      expandedContent: "Individual creators have transformed what's possible online, but true breakthroughs often require diverse skills working together. PODNEX exists to facilitate these connections and create a structured environment where collaboration happens naturally.",
      benefits: ['Enhanced creativity', 'Shared knowledge', 'Reduced workload', 'Better outcomes']
    },
    {
      id: 'reputation',
      title: 'Reputation is opportunity',
      description: "Your contributions are tracked, verified, and showcased. On PODNEX, reputation isn't just for show—it unlocks real economic opportunities.",
      color: '#34D399',
      gradient: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)',
      icon: <Award size={28} />,
      expandedContent: "PODNEX changes this with a comprehensive reputation system that tracks every verified contribution, showcases your expertise, and provides tangible economic benefits. Quality work leads to more visibility, higher income, and increased collaboration opportunities.",
      benefits: ['Verified expertise', 'Increased opportunities', 'Higher earnings', 'Professional growth']
    },
    {
      id: 'ecosystems',
      title: 'Ecosystems outperform tools',
      description: "We're building a self-sustaining ecosystem, not just another tool. When all parts work together, the whole becomes exponentially more valuable.",
      color: '#818CF8',
      gradient: 'linear-gradient(135deg, #818CF8 0%, #6366F1 100%)',
      icon: <Target size={28} />,
      expandedContent: "PODNEX takes a holistic approach, creating an interconnected ecosystem where every action strengthens the whole network. Our platform integrates collaboration, reputation building, monetization, and product development into a single cohesive system.",
      benefits: ['Integrated workflow', 'Network effects', 'Compound value', 'Seamless experience']
    },
    {
      id: 'ownership',
      title: 'Ownership is built-in',
      description: "Everyone who contributes deserves visibility, credit, and a fair share of the value they help create. No gatekeepers, just merit.",
      color: '#EC4899',
      gradient: 'linear-gradient(135deg, #EC4899 0%, #BE185D 100%)',
      icon: <Shield size={28} />,
      expandedContent: "PODNEX removes barriers by making contribution the only requirement for ownership. Our platform automatically tracks every verified contribution and ensures creators receive appropriate credit, visibility, and financial rewards for their work.",
      benefits: ['Fair attribution', 'Transparent rewards', 'Equal opportunity', 'Merit-based success']
    },
  ];
  
  // Enhanced Journey milestones with better interactivity
  const journeyMilestones = [
    {
      id: 1,
      year: "2024",
      quarter: "Q4",
      title: "Concept Development",
      description: "The vision for PODNEX emerged from witnessing creators struggle with fair collaboration and attribution.",
      icon: <Lightbulb size={24} />,
      color: "#E8C547",
      status: "completed",
      progress: 100,
      achievements: [
        "Market research & validation",
        "Core platform architecture design",
        "Initial wireframes & user flows"
      ]
    },
    {
      id: 2,
      year: "2025",
      quarter: "Q1",
      title: "Foundation Building",
      description: "Core development began with platform infrastructure and fundamental Pod collaboration features.",
      icon: <Code size={24} />,
      color: "#34D399",
      status: "completed",
      progress: 100,
      achievements: [
        "Team assembly & tech stack selection",
        "Database architecture implementation",
        "User authentication system"
      ]
    },
    {
      id: 3,
      year: "2025",
      quarter: "Q2-Q3",
      title: "Active Development",
      description: "Building core features including reputation system, contribution tracking, and collaborative tools.",
      icon: <Rocket size={24} />,
      color: "#818CF8",
      status: "current",
      progress: 65,
      achievements: [
        "Reputation system development",
        "Pod collaboration workspace",
        "Project management integration"
      ]
    },
    {
      id: 4,
      year: "2025",
      quarter: "Q4",
      title: "Beta Launch",
      description: "Limited release with selected creator teams to test and refine platform functionality.",
      icon: <Users size={24} />,
      color: "#F59E0B",
      status: "upcoming",
      progress: 0,
      achievements: [
        "Creator team onboarding",
        "Real-world testing & feedback",
        "Platform optimization"
      ]
    },
    {
      id: 5,
      year: "2026",
      quarter: "Q1-Q2",
      title: "Public Launch",
      description: "Full platform launch with complete feature set and expanded creator community.",
      icon: <Globe size={24} />,
      color: "#EC4899",
      status: "planned",
      progress: 0,
      achievements: [
        "Public platform availability",
        "Marketing & community growth",
        "Scale infrastructure"
      ]
    }
  ];

  // Enhanced FAQ data
  const faqData = [
    {
      id: 1,
      question: "What exactly is a 'Pod' in PODNEX?",
      answer: "A Pod is a collaborative unit that brings together different skillsets to work on projects. Think of it as a flexible team structure where creators can contribute based on their availability and expertise.",
      icon: <Users size={20} />,
      category: "Platform"
    },
    {
      id: 2,
      question: "How does the reputation system work?",
      answer: "Our reputation system tracks verified contributions across all Pods. Each contribution is categorized, peer-evaluated, and accumulated into your professional profile, creating a comprehensive record of your expertise.",
      icon: <Award size={20} />,
      category: "Reputation"
    },
    {
      id: 3,
      question: "Do I need to be full-time to participate?",
      answer: "Not at all! PODNEX accommodates varying involvement levels. You can contribute to multiple Pods based on your availability, whether you're full-time, part-time, or anywhere in between.",
      icon: <Clock size={20} />,
      category: "Participation"
    },
    {
      id: 4,
      question: "How is compensation handled?",
      answer: "Ownership and compensation are directly tied to verified contributions within each Pod. The platform automatically tracks and assigns value based on pre-agreed terms, with revenue distributed proportionally.",
      icon: <DollarSign size={20} />,
      category: "Compensation"
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.175, 0.885, 0.32, 1.075] }
    }
  };

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className={styles.aboutPage} ref={aboutRef}>
      {/* Enhanced animated background */}
      <motion.div 
        className={styles.backgroundElements}
        style={{ y: backgroundY }}
      >
        <div className={styles.gridPattern} />
        <motion.div
          className={`${styles.floatingShape} ${styles.shape1}`}
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className={`${styles.floatingShape} ${styles.shape2}`}
          animate={{
            x: [0, -25, 0],
            y: [0, 25, 0],
            rotate: [0, -8, 8, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className={`${styles.floatingShape} ${styles.shape3}`}
          animate={{
            x: mousePosition.x * 20,
            y: mousePosition.y * 20,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 15 }}
        />
      </motion.div>

      {/* Enhanced Hero Section */}
      <motion.div className={styles.heroSection} style={{ scale: heroScale }}>
        <div className={styles.container}>
          <motion.div 
            className={styles.heroContent}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className={styles.heroBadge} variants={itemVariants}>
              <Sparkles size={16} />
              <span>The Creator-Driven Future</span>
            </motion.div>
            
            <motion.h1 className={styles.heroTitle} variants={itemVariants}>
              Build Bold.{' '}
              <span className={styles.gradientText}>Build Together.</span>
            </motion.h1>
            
            <motion.p className={styles.heroSubtitle} variants={itemVariants}>
              PODNEX is where creators assemble into collaborative Pods to build real products, 
              earn reputation, and transform ideas into successful ventures.
            </motion.p>
            
            <motion.div className={styles.heroButtons} variants={itemVariants}>
              <Link to="/register" className={styles.btnPrimary}>
                <span>Join PODNEX</span>
                <ArrowRight size={18} />
              </Link>
              <button 
                className={styles.btnSecondary}
                onClick={() => setShowVideo(true)}
              >
                <PlayCircle size={18} />
                <span>Watch Demo</span>
              </button>
            </motion.div>
            
            {/* Enhanced animated stats */}
            <motion.div 
              className={styles.heroStats}
              variants={itemVariants}
            >
              <div className={styles.statItem}>
                <div className={styles.statNumber}>{animatedStats.creators}+</div>
                <div className={styles.statLabel}>Active Creators</div>
                <div className={styles.statTrend}>
                  <TrendingUp size={14} />
                  <span>+24%</span>
                </div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>{animatedStats.pods}</div>
                <div className={styles.statLabel}>Live Pods</div>
                <div className={styles.statTrend}>
                  <TrendingUp size={14} />
                  <span>+18%</span>
                </div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>{animatedStats.products}</div>
                <div className={styles.statLabel}>Products Launched</div>
                <div className={styles.statTrend}>
                  <TrendingUp size={14} />
                  <span>+31%</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          </div>
        
        <motion.div 
          className={styles.scrollIndicator}
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          onClick={() => scrollToSection(visionRef)}
        >
          <ChevronDown size={24} />
        </motion.div>
      </motion.div>

      

      {/* Enhanced Vision Section */}
      <div className={styles.section} ref={visionRef} data-section="vision">
        <div className={styles.container}>
          <motion.div 
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className={styles.sectionTitle}>Our Vision</h2>
            <p className={styles.sectionSubtitle}>
              Transforming how creators collaborate, build, and succeed together
            </p>
          </motion.div>

          <div className={styles.visionContent}>
            <div className={styles.visionMain}>
              <motion.div 
                className={styles.visionStatement}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h3>The Creator Economy, Reimagined</h3>
                <p>
                  PODNEX exists to enable creators to assemble, build, and launch real products 
                  by forming collaborative squads called Pods. We're not a portfolio site or 
                  marketplace—we're a structured creation ecosystem where reputation is earned 
                  and success is shared.
                </p>
              </motion.div>

              <motion.div 
                className={styles.founderStory}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className={styles.storyNav}>
                  {['Problem', 'Insight', 'Solution'].map((title, index) => (
                    <button
                      key={index}
                      className={`${styles.storyTab} ${activeStory === index ? styles.active : ''}`}
                      onClick={() => setActiveStory(index)}
                    >
                      {title}
                    </button>
                  ))}
                </div>
                
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={activeStory}
                    className={styles.storyContent}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {activeStory === 0 && (
                      <p>"Creators struggle with fair compensation, meaningful portfolios, and finding collaborators. The digital economy promised freedom but delivered isolation."</p>
                    )}
                    {activeStory === 1 && (
                      <p>"We needed more than tools—a new ecosystem where contribution is documented, reputation is earned, and collaboration happens naturally."</p>
                    )}
                    {activeStory === 2 && (
                      <p>"PODNEX is that solution—where creators form Pods, build real products, and earn reputation through verified contributions."</p>
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Enhanced Feature Grid */}
            <motion.div 
              className={styles.featureGrid}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {[
                { icon: <Users size={24} />, title: 'Collaborative Pods', desc: 'Dynamic teams with complementary skills' },
                { icon: <Award size={24} />, title: 'Merit-Based Reputation', desc: 'Credibility through verified contributions' },
                { icon: <Shield size={24} />, title: 'Fair Attribution', desc: 'Every contribution tracked and valued' },
                { icon: <Target size={24} />, title: 'Transparent Rewards', desc: 'Compensation tied to impact' }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className={styles.featureCard}
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className={styles.featureIcon}>{feature.icon}</div>
                  <h4>{feature.title}</h4>
                  <p>{feature.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Interactive Roadmap Section */}
      <div className={`${styles.section} ${styles.roadmapSection}`} ref={journeyRef} data-section="journey">
        <div className={styles.container}>
          <motion.div 
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className={styles.sectionTitle}>Development Roadmap</h2>
            <p className={styles.sectionSubtitle}>
              Track our progress as we build the future of collaborative creation
            </p>
          </motion.div>

          <div className={styles.roadmapContainer}>
            {/* Interactive Timeline */}
            <div className={styles.timeline}>
              <div className={styles.timelineLine}>
                <motion.div 
                  className={styles.timelineProgress}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(selectedMilestone / journeyMilestones.length) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </div>
              
              {journeyMilestones.map((milestone, index) => (
                <motion.div
                  key={milestone.id}
                  className={`${styles.timelineMilestone} ${selectedMilestone === milestone.id ? styles.active : ''} ${styles[milestone.status]}`}
                  style={{ '--milestone-color': milestone.color }}
                  onClick={() => setSelectedMilestone(milestone.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <div className={styles.milestoneIcon}>
                    {milestone.icon}
                    {milestone.status === 'current' && (
                      <motion.div 
                        className={styles.pulseRing}
                        animate={{ scale: [1, 1.5], opacity: [0.7, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    )}
                  </div>
                  <div className={styles.milestoneInfo}>
                    <span className={styles.milestoneYear}>{milestone.year}</span>
                    <span className={styles.milestoneTitle}>{milestone.title}</span>
                  </div>
                  {milestone.status === 'current' && (
                    <div className={styles.currentBadge}>Active</div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Enhanced Milestone Details */}
            <AnimatePresence mode="wait">
              {journeyMilestones.map((milestone) => (
                selectedMilestone === milestone.id && (
                  <motion.div
                    key={milestone.id}
                    className={styles.milestoneDetails}
                    style={{ '--milestone-color': milestone.color }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className={styles.milestoneHeader}>
                      <div className={styles.milestoneMeta}>
                        <h3>{milestone.title}</h3>
                        <div className={styles.milestonePeriod}>
                          <Calendar size={16} />
                          <span>{milestone.year} • {milestone.quarter}</span>
                        </div>
                      </div>
                      
                      <div className={styles.progressCircle}>
                        <svg viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="2"
                          />
                          <motion.path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke={milestone.color}
                            strokeWidth="2"
                            strokeDasharray={`${milestone.progress}, 100`}
                            initial={{ strokeDasharray: "0, 100" }}
                            animate={{ strokeDasharray: `${milestone.progress}, 100` }}
                            transition={{ duration: 1, delay: 0.3 }}
                          />
                        </svg>
                        <span>{milestone.progress}%</span>
                      </div>
                    </div>
                    
                    <p className={styles.milestoneDescription}>{milestone.description}</p>
                    
                    <div className={styles.achievementsList}>
                      <h4>Key Achievements</h4>
                      <div className={styles.achievementsGrid}>
                        {milestone.achievements.map((achievement, idx) => (
                          <motion.div
                            key={idx}
                            className={styles.achievementItem}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 + 0.5 }}
                          >
                            <CheckCircle size={16} />
                            <span>{achievement}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Enhanced Values Section */}
      <div className={`${styles.section} ${styles.valuesSection}`} ref={valuesRef} data-section="values">
        <div className={styles.container}>
          <motion.div 
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className={styles.sectionTitle}>Core Philosophy</h2>
            <p className={styles.sectionSubtitle}>
              The principles that guide everything we build at PODNEX
            </p>
          </motion.div>

          <div className={styles.valuesGrid}>
            {coreValues.map((value, index) => (
              <motion.div
                key={value.id}
                className={`${styles.valueCard} ${expandedValue === value.id ? styles.expanded : ''}`}
                style={{ '--value-color': value.color }}
                onClick={() => setExpandedValue(expandedValue === value.id ? null : value.id)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5 }}
              >
                <div className={styles.valueHeader}>
                  <div className={styles.valueIcon} style={{ background: value.gradient }}>
                    {value.icon}
                  </div>
                  <h3>{value.title}</h3>
                </div>
                
                <p className={styles.valueDescription}>{value.description}</p>
                
                <div className={styles.expandTrigger}>
                  <span>{expandedValue === value.id ? 'Show Less' : 'Learn More'}</span>
                  <motion.div
                    animate={{ rotate: expandedValue === value.id ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown size={16} />
                  </motion.div>
                </div>
                
                <AnimatePresence>
                  {expandedValue === value.id && (
                    <motion.div
                      className={styles.expandedContent}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p>{value.expandedContent}</p>
                      <div className={styles.benefitsList}>
                        {value.benefits.map((benefit, idx) => (
                          <div key={idx} className={styles.benefitItem}>
                            <CheckCircle size={14} />
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Team Section */}
      <div className={`${styles.section} ${styles.teamSection}`} ref={teamRef} data-section="team">
        <div className={styles.container}>
          <motion.div 
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className={styles.sectionTitle}>Leadership</h2>
            <p className={styles.sectionSubtitle}>
              Meet the visionaries building the future of collaborative creation
            </p>
          </motion.div>

          <div className={styles.teamContent}>
            <motion.div 
              className={styles.founderProfile}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className={styles.founderImage}>
                <div className={styles.imagePlaceholder}>
                  <span>PP</span>
                </div>
                <div className={styles.imageGlow} />
              </div>
              
              <div className={styles.founderInfo}>
                <div className={styles.founderHeader}>
                  <div className={styles.nameSection}>
                    <h3>Pedro Perez Serapião</h3>
                    <span className={styles.role}>Founder & CEO</span>
                  </div>
                  <div className={styles.socialLinks}>
                    <a href="https://www.linkedin.com/in/pedro-perez-serapi%C3%A3o-379079121/" target="_blank" rel="noopener noreferrer">
                      <Linkedin size={20} />
                    </a>
                    <a href="https://github.com/" target="_blank" rel="noopener noreferrer">
                      <Github size={20} />
                    </a>
                  </div>
                </div>
                
                <p className={styles.founderBio}>
                  Visionary entrepreneur passionate about building innovative platforms that empower creators. 
                  Pedro leads PODNEX with a commitment to transforming collaborative creation online.
                </p>
                
                <div className={styles.expertiseTags}>
                  {[
                    { icon: <Code size={16} />, label: 'Software Development' },
                    { icon: <Rocket size={16} />, label: 'Startup Leadership' },
                    { icon: <Users size={16} />, label: 'Community Building' }
                  ].map((expertise, index) => (
                    <div key={index} className={styles.expertiseTag}>
                      {expertise.icon}
                      <span>{expertise.label}</span>
                    </div>
                  ))}
                </div>
                
                <blockquote className={styles.founderQuote}>
                  "I believe in a future where creators are valued fairly for their contributions, 
                  where collaboration is frictionless, and where great ideas can come to life 
                  without traditional gatekeepers."
                </blockquote>
              </div>
            </motion.div>

            <div className={styles.teamValuesGrid}>
              <motion.div
                className={styles.teamValuesCard}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h3>Our Values</h3>
                <div className={styles.valuesList}>
                  {[
                    { icon: <Zap size={18} />, text: 'Relentless innovation' },
                    { icon: <Shield size={18} />, text: 'Radical transparency' },
                    { icon: <Target size={18} />, text: 'Creator empowerment' },
                    { icon: <Award size={18} />, text: 'Merit-based recognition' }
                  ].map((item, index) => (
                    <div key={index} className={styles.valueItem}>
                      <div className={styles.valueIconSmall}>{item.icon}</div>
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className={styles.joinTeamCard}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <h3>Join Our Mission</h3>
                <p>
                  We're looking for passionate individuals who believe in creating 
                  a more collaborative, transparent digital creator economy.
                </p>
                <Link to="/careers" className={styles.joinLink}>
                  <span>View Opportunities</span>
                  <ArrowRight size={16} />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced FAQ Section */}
      <div className={`${styles.section} ${styles.faqSection}`} ref={faqRef} data-section="faq">
        <div className={styles.container}>
          <motion.div 
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
            <p className={styles.sectionSubtitle}>
              Everything you need to know about PODNEX and how it works
            </p>
          </motion.div>

          <div className={styles.faqContainer}>
            <div className={styles.faqList}>
              {faqData.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  className={`${styles.faqItem} ${hoveredFaq === faq.id ? styles.hovered : ''}`}
                  onMouseEnter={() => setHoveredFaq(faq.id)}
                  onMouseLeave={() => setHoveredFaq(null)}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <div className={styles.faqHeader}>
                    <div className={styles.faqIcon}>{faq.icon}</div>
                    <div className={styles.faqMeta}>
                      <h3>{faq.question}</h3>
                      <span className={styles.faqCategory}>{faq.category}</span>
                    </div>
                  </div>
                  <p className={styles.faqAnswer}>{faq.answer}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              className={styles.faqCta}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h3>Still have questions?</h3>
              <p>We'd love to help answer any questions about PODNEX.</p>
              <Link to="/contact" className={styles.contactLink}>
                <MessageSquare size={18} />
                <span>Contact Us</span>
                <ArrowRight size={16} />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Enhanced CTA Section */}
      <div className={styles.ctaSection}>
        <div className={styles.container}>
          <motion.div 
            className={styles.ctaContent}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className={styles.ctaHeader}>
              <h2>Ready to Transform Your Creative Journey?</h2>
              <p>Join the creator revolution and start building, collaborating, and earning together.</p>
            </div>
            
            <div className={styles.ctaButtons}>
              <Link to="/register" className={`${styles.btnPrimary} ${styles.large}`}>
                <span>Create Account</span>
                <ArrowRight size={20} />
              </Link>
              <Link to="/explore" className={`${styles.btnSecondary} ${styles.large}`}>
                <Eye size={20} />
                <span>Explore Pods</span>
              </Link>
            </div>
            
            <div className={styles.ctaFeatures}>
              {[
                'No setup fees',
                'Start earning immediately',
                'Join active community'
              ].map((feature, index) => (
                <div key={index} className={styles.ctaFeature}>
                  <CheckCircle size={16} />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {showVideo && (
          <motion.div
            className={styles.videoModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowVideo(false)}
          >
            <motion.div
              className={styles.videoContainer}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className={styles.closeButton}
                onClick={() => setShowVideo(false)}
              >
                ×
              </button>
              <div className={styles.videoPlaceholder}>
                <PlayCircle size={48} />
                <h3>PODNEX Platform Demo</h3>
                <p>Coming Soon!</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll to top button */}
      <motion.button
        className={`${styles.scrollTop} ${isScrolled ? styles.visible : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ArrowUp size={20} />
      </motion.button>
    </div>
  );
};

export default AboutPage;