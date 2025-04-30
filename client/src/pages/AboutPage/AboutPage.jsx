import React, { useState, useEffect, useRef } from 'react';
import styles from './AboutPage.module.scss';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
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
  Coffee
} from 'lucide-react';

const AboutPage = () => {
  // State for active section and animation visibility
  const [activeSection, setActiveSection] = useState('vision');
  const [isVisible, setIsVisible] = useState(true);
  const [activeStory, setActiveStory] = useState(0);
  const [expandedValue, setExpandedValue] = useState(null);
  const [selectedMilestone, setSelectedMilestone] = useState(1);
  const [showVideo, setShowVideo] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const [lastScrollPosition, setLastScrollPosition] = useState(0);
  
  // State for particles
  const [particles, setParticles] = useState([]);
  
  // References for the sections
  const aboutRef = useRef(null);
  const visionRef = useRef(null);
  const journeyRef = useRef(null);
  const valuesRef = useRef(null);
  const teamRef = useRef(null);
  const faqRef = useRef(null);
  
  // Animation controls
  const controls = useAnimation();

  // Start animations immediately
  useEffect(() => {
    controls.start("visible");
  }, [controls]);
  
  // Generate particles for background effect
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 1,
          speed: Math.random() * 0.3 + 0.1,
          opacity: Math.random() * 0.5 + 0.1,
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  // Handle scroll for navbar visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      
      // Make navbar visible when scrolling up or at the top
      if (currentScrollPos < lastScrollPosition || currentScrollPos < 100) {
        setNavVisible(true);
      } else {
        setNavVisible(false);
      }
      
      setLastScrollPosition(currentScrollPos);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollPosition]);

  // Intersection Observer to trigger animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          controls.start("visible");
        }
      },
      { threshold: 0.2 }
    );

    // Section observer to update active section for navigation
    const sectionObserver = new IntersectionObserver(
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
      { threshold: 0.3, rootMargin: '-20% 0px -30% 0px' }
    );

    const section = aboutRef.current;
    if (section) observer.observe(section);
    
    // Observe each section
    [visionRef, journeyRef, valuesRef, teamRef, faqRef].forEach(ref => {
      if (ref.current) sectionObserver.observe(ref.current);
    });

    return () => {
      if (section) observer.unobserve(section);
      [visionRef, journeyRef, valuesRef, teamRef, faqRef].forEach(ref => {
        if (ref.current) sectionObserver.unobserve(ref.current);
      });
    };
  }, [controls]);

  // Updated Core values data
  const coreValues = [
    {
      id: 'team-sport',
      title: 'Creation is a team sport',
      description: "We believe the best innovations happen through collaboration, not isolation. PODNEX brings together diverse talents to create something greater than the sum of its parts.",
      color: '#E8C547', // Gold
      icon: <Users size={36} />,
      expandedContent: "Individual creators have transformed what's possible online, but true breakthroughs often require diverse skills working together. PODNEX exists to facilitate these connections and create a structured environment where collaboration happens naturally. We believe that by bringing designers, developers, writers, and marketers together, we can create products with deeper impact and more comprehensive solutions."
    },
    {
      id: 'reputation',
      title: 'Reputation is opportunity',
      description: "Your contributions and achievements are tracked, verified, and showcased. On PODNEX, reputation isn't just for show—it unlocks real economic opportunities.",
      color: '#34D399', // Green
      icon: <Award size={36} />,
      expandedContent: "In traditional work environments, your reputation is often limited to personal references or a handful of reviews. PODNEX changes this with a comprehensive reputation system that tracks every verified contribution, showcases your expertise, and provides tangible economic benefits. The more value you provide to Pods, the more opportunities become available to you. This creates a virtuous cycle where quality work leads to more visibility, higher income, and increased collaboration opportunities."
    },
    {
      id: 'ecosystems',
      title: 'Ecosystems outperform tools',
      description: "We're building a self-sustaining ecosystem, not just another tool. When all parts work together, the whole becomes exponentially more valuable.",
      color: '#818CF8', // Purple
      icon: <Target size={36} />,
      expandedContent: "Many platforms focus on providing individual tools for creators, but PODNEX takes a holistic approach. We're creating an interconnected ecosystem where every action strengthens the whole network. Our platform integrates collaboration, reputation building, monetization, and product development into a single cohesive system. This integrated approach means creators can focus on building rather than juggling multiple disconnected platforms and services."
    },
    {
      id: 'ownership',
      title: 'Ownership is built-in, not gated',
      description: "We believe in equal opportunity and transparency. Everyone who contributes deserves visibility, credit, and a fair share of the value they help create.",
      color: '#F59E0B', // Yellow
      icon: <Shield size={36} />,
      expandedContent: "Traditional creative industries often gate ownership through hierarchies, credentials, or access to capital. PODNEX removes these barriers by making contribution the only requirement for ownership. Our platform automatically tracks every verified contribution and ensures creators receive appropriate credit, visibility, and financial rewards for their work. This democratizes the creative process and ensures that success is determined by the quality of your work, not your connections or background."
    },
  ];
  
  // Updated Journey milestones
  const journeyMilestones = [
    {
      id: 1,
      year: "2024",
      quarter: "Q4",
      title: "Concept Development",
      description: "After witnessing the struggles of distributed teams to collaborate effectively and fairly attribute work, the concept of PODNEX took shape as a solution for creator-driven ecosystems.",
      icon: <Lightbulb size={32} />,
      color: "#E8C547",
      details: [
        "Researched pain points in distributed collaboration",
        "Conceptualized core platform features and user flows",
        "Created initial wireframes and technical architecture"
      ]
    },
    {
      id: 2,
      year: "2025",
      quarter: "Q1",
      title: "Development Begins",
      description: "Development of the PODNEX platform began with focus on creating the foundational architecture and core Pod structure that would enable transparent collaboration.",
      icon: <Code size={32} />,
      color: "#34D399",
      details: [
        "Assembled development team",
        "Built core database architecture",
        "Developed user authentication and Pod creation functionality"
      ]
    },
    {
      id: 3,
      year: "2025",
      quarter: "Q2-Q3",
      title: "Building & Testing",
      description: "Development continues with implementation of key platform features including reputation system, contribution tracking, and the collaboration tools.",
      icon: <Coffee size={32} />,
      color: "#818CF8",
      current: true,
      details: [
        "Implementing reputation and contribution tracking system",
        "Building collaborative workspace environment",
        "Developing project management tools within Pods"
      ]
    },
    {
      id: 4,
      year: "2025",
      quarter: "Q4",
      title: "MVP Launch",
      description: "Planned launch of Minimum Viable Product with selected creator teams to test and refine the Pod structure, reputation system, and collaboration tools.",
      icon: <Rocket size={32} />,
      color: "#F59E0B",
      details: [
        "Onboarding initial creator teams",
        "Gathering feedback and implementing improvements",
        "Refining user experience based on real-world usage"
      ]
    },
    {
      id: 5,
      year: "2026",
      quarter: "Q2",
      title: "Full Platform Launch",
      description: "Official public launch of PODNEX with complete feature set, expanded Pod templates, and advanced tools for creators of all types.",
      icon: <Globe size={32} />,
      color: "#EC4899",
      details: [
        "Public launch with full feature set",
        "Marketing campaigns to attract diverse creator communities",
        "Scaling infrastructure to support growing user base"
      ]
    }
  ];

  // Founder stories
  const founderStories = [
    {
      title: "The Problem",
      content: "Throughout my career, I've seen talented creators struggle with the same issues: earning fair compensation for their work, building meaningful portfolios, and finding the right collaborators. The digital creator economy promised freedom but delivered isolation and instability for many."
    },
    {
      title: "The Insight",
      content: "I realized we needed more than just better tools—we needed a new ecosystem. One where contribution is documented, reputation is earned through real work, and collaboration happens naturally. The solution wasn't another marketplace or portfolio site, but a structured environment where creation, reputation, and reward are seamlessly integrated."
    },
    {
      title: "The Vision",
      content: "PODNEX is that solution—a platform where creators assemble into Pods to build real products together. Where every contribution is tracked and valued. Where reputation is built on merit, not marketing. Where ownership is proportional to contribution. It's the future of collaborative creation I believe in."
    }
  ];

  // FAQ data
  const faqData = [
    {
      question: "What exactly is a 'Pod' in PODNEX?",
      answer: "A Pod is a collaborative unit that brings together different skillsets to work on projects. Think of it as a flexible team structure where creators can contribute based on their availability and expertise. Each Pod has clear objectives, transparent contribution tracking, and fair distribution of the value created."
    },
    {
      question: "How does the reputation system work?",
      answer: "Our reputation system tracks verified contributions across all Pods you participate in. Each contribution is categorized by skill type, evaluated by peers, and accumulated into your professional profile. This creates a comprehensive, verifiable record of your expertise that unlocks new opportunities within the platform."
    },
    {
      question: "Do I need to be a full-time creator to join?",
      answer: "Not at all! PODNEX is designed to accommodate varying levels of involvement. You can contribute to multiple Pods based on your availability, whether you're a full-time creator, working a day job, or anything in between."
    },
    {
      question: "How is ownership and compensation handled?",
      answer: "Ownership and compensation are directly tied to verified contributions within each Pod. The platform automatically tracks and assigns value based on pre-agreed terms, eliminating payment disputes. When a Pod generates revenue, it's distributed proportionally to contribution value."
    },
    {
      question: "Can I start my own Pod?",
      answer: "Absolutely! Any creator can initiate a new Pod by defining the project scope, required roles, contribution value system, and goals. You can invite specific creators or open positions to the broader PODNEX community."
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };
  
  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.3 }
    }
  };
  
  const scaleUpVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };
  
  return (
    <div className={styles.aboutPage} ref={aboutRef}>
      {/* Particle background */}
      <div className={styles.particleContainer}>
        {particles.map(particle => (
          <div
            key={particle.id}
            className={styles.particle}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              animationDuration: `${20 / particle.speed}s`,
            }}
          />
        ))}
      </div>
      
      {/* Floating decorative shapes */}
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
      
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.container}>
          <motion.div 
            className={styles.heroContent}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className={styles.heroTitle}>
              The Creator-Driven Ecosystem
            </h1>
            <div className={styles.heroTagline}>
              Build Bold. <span className={styles.accentText}>Build Together.</span>
            </div>
            
            <div className={styles.heroButtons}>
              <Link to="/register" className={styles.primaryButton}>
                Join PODNEX
              </Link>
              <button 
                className={styles.videoButton}
                onClick={() => setShowVideo(true)}
              >
                <PlayCircle size={20} />
                <span>Watch Video</span>
              </button>
            </div>
            
            <div className={styles.heroStats}>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>120+</div>
                <div className={styles.statLabel}>Creators</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>45</div>
                <div className={styles.statLabel}>Active Pods</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>12</div>
                <div className={styles.statLabel}>Products Launched</div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Add navigation pills here, right below the hero stats */}
        <motion.div 
          className={styles.navigationPills}
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <div className={styles.pillsContainer}>
            <button 
              className={`${styles.pill} ${activeSection === 'vision' ? styles.activePill : ''}`}
              onClick={() => {
                visionRef.current?.scrollIntoView({ behavior: 'smooth' });
                setActiveSection('vision');
              }}
            >
              <span className={styles.pillDot}></span>
              <span className={styles.pillText}>Vision</span>
            </button>
            
            <button 
              className={`${styles.pill} ${activeSection === 'journey' ? styles.activePill : ''}`}
              onClick={() => {
                journeyRef.current?.scrollIntoView({ behavior: 'smooth' });
                setActiveSection('journey');
              }}
            >
              <span className={styles.pillDot}></span>
              <span className={styles.pillText}>Roadmap</span>
            </button>
            
            <button 
              className={`${styles.pill} ${activeSection === 'values' ? styles.activePill : ''}`}
              onClick={() => {
                valuesRef.current?.scrollIntoView({ behavior: 'smooth' });
                setActiveSection('values');
              }}
            >
              <span className={styles.pillDot}></span>
              <span className={styles.pillText}>Core Values</span>
            </button>
            
            <button 
              className={`${styles.pill} ${activeSection === 'team' ? styles.activePill : ''}`}
              onClick={() => {
                teamRef.current?.scrollIntoView({ behavior: 'smooth' });
                setActiveSection('team');
              }}
            >
              <span className={styles.pillDot}></span>
              <span className={styles.pillText}>Team</span>
            </button>
            
            <button 
              className={`${styles.pill} ${activeSection === 'faq' ? styles.activePill : ''}`}
              onClick={() => {
                faqRef.current?.scrollIntoView({ behavior: 'smooth' });
                setActiveSection('faq');
              }}
            >
              <span className={styles.pillDot}></span>
              <span className={styles.pillText}>FAQ</span>
            </button>
          </div>
        </motion.div>
        
        <motion.div 
          className={styles.scrollIndicator}
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          onClick={() => visionRef.current?.scrollIntoView({ behavior: 'smooth' })}
        >
          <ChevronDown size={24} />
        </motion.div>
      </div>
      
      {/* Video modal */}
      {showVideo && (
        <div className={styles.videoModal}>
          <div className={styles.videoContainer}>
            <button 
              className={styles.closeButton}
              onClick={() => setShowVideo(false)}
            >
              &times;
            </button>
            <div className={styles.videoPlaceholder}>
              <div>PODNEX Introduction Video</div>
              <div className={styles.videoNotice}>Video coming soon!</div>
            </div>
          </div>
          <div 
            className={styles.videoOverlay}
            onClick={() => setShowVideo(false)}
          ></div>
        </div>
      )}
      
      {/* Vision Section */}
      <div className={styles.section} ref={visionRef} data-section="vision">
        <div className={styles.container}>
          <motion.div 
            className={styles.sectionTitleWrapper}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={styles.sectionTitle}>Our Vision</h2>
            <div className={styles.titleDecoration} />
          </motion.div>
          
          <motion.div 
            className={styles.visionContent}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.p 
              className={styles.visionLead}
            >
              PODNEX exists to enable creators to assemble, build, and launch real products, brands, and movements by forming collaborative squads called Pods.
            </motion.p>
            
            <motion.p 
              className={styles.visionText}
            >
              We're not a portfolio site, marketplace, or gig economy clone. PODNEX is a structured creation ecosystem where Pods grow, products are born, and reputations are earned — all transparently.
            </motion.p>
            
            <motion.div 
              className={styles.founderStory}
            >
              <div className={styles.storyNav}>
                {founderStories.map((story, index) => (
                  <button
                    key={index}
                    className={`${styles.storyButton} ${activeStory === index ? styles.activeStory : ''}`}
                    onClick={() => setActiveStory(index)}
                  >
                    {story.title}
                  </button>
                ))}
              </div>
              
              <AnimatePresence mode="wait">
                <motion.div 
                  key={activeStory}
                  className={styles.storyContent}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <p>{founderStories[activeStory].content}</p>
                </motion.div>
              </AnimatePresence>
            </motion.div>
            
            <div className={styles.visionFeatures}>
              <div className={styles.featureColumn}>
                <div className={styles.featureItem}>
                  <div className={styles.featureIcon}>
                    <Users size={22} />
                  </div>
                  <div className={styles.featureText}>
                    <h4>Collaborative Pods</h4>
                    <p>Form dynamic teams with complementary skills to build products together.</p>
                  </div>
                </div>
                <div className={styles.featureItem}>
                  <div className={styles.featureIcon}>
                    <Award size={22} />
                  </div>
                  <div className={styles.featureText}>
                    <h4>Merit-Based Reputation</h4>
                    <p>Build credibility through verified contributions and real work.</p>
                  </div>
                </div>
              </div>
              
              <div className={styles.featureColumn}>
                <div className={styles.featureItem}>
                  <div className={styles.featureIcon}>
                    <Shield size={22} />
                  </div>
                  <div className={styles.featureText}>
                    <h4>Fair Attribution</h4>
                    <p>Every contribution is tracked, credited, and valued appropriately.</p>
                  </div>
                </div>
                <div className={styles.featureItem}>
                  <div className={styles.featureIcon}>
                    <Target size={22} />
                  </div>
                  <div className={styles.featureText}>
                    <h4>Transparent Rewards</h4>
                    <p>Compensation directly tied to your impact and contribution value.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Journey/Roadmap Section */}
      <div className={styles.section} ref={journeyRef} data-section="journey">
        <div className={styles.container}>
          <motion.div 
            className={styles.sectionTitleWrapper}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={styles.sectionTitle}>Our Roadmap</h2>
            <div className={styles.titleDecoration} />
          </motion.div>
          
          <div className={styles.roadmapContent}>
            <div className={styles.roadmapTimeline}>
              {journeyMilestones.map((milestone) => (
                <div 
                  key={milestone.id}
                  className={`${styles.timelinePoint} ${selectedMilestone === milestone.id ? styles.activePoint : ''} ${milestone.current ? styles.currentPoint : ''}`}
                  onClick={() => setSelectedMilestone(milestone.id)}
                >
                  <div 
                    className={styles.timelineIcon} 
                    style={{ backgroundColor: `${milestone.color}20`, borderColor: milestone.color, color: milestone.color }}
                  >
                    {milestone.icon}
                  </div>
                  <div className={styles.timelineLabel}>
                    <span className={styles.timelineYear}>{milestone.year}</span>
                    <span className={styles.timelineTitle}>{milestone.title}</span>
                  </div>
                </div>
              ))}
              
              <div className={styles.timelineProgress}>
                <div 
                  className={styles.timelineProgressBar}
                  style={{
                    width: `${((selectedMilestone - 1) / (journeyMilestones.length - 1)) * 100}%`
                  }}
                ></div>
              </div>
            </div>
            
            <AnimatePresence mode="wait">
              {journeyMilestones.map((milestone) => (
                selectedMilestone === milestone.id && (
                  <motion.div
                    key={milestone.id}
                    className={styles.milestoneDetails}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={styles.milestoneHeader}>
                      <h3>{milestone.title}</h3>
                      <div className={styles.milestonePeriod}>
                        <Calendar size={16} />
                        <span>{milestone.year} • {milestone.quarter}</span>
                      </div>
                    </div>
                    
                    <p className={styles.milestoneDescription}>{milestone.description}</p>
                    
                    <div className={styles.milestoneTaskList}>
                      {milestone.details.map((detail, idx) => (
                        <div key={idx} className={styles.milestoneTask}>
                          <CheckCircle size={16} />
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>
                    
                    {milestone.current && (
                      <div className={styles.currentBadge}>
                        We are here
                      </div>
                    )}
                  </motion.div>
                )
              ))}
            </AnimatePresence>
            
            <div className={styles.timelineControls}>
              <button 
                className={styles.controlButton}
                disabled={selectedMilestone <= 1}
                onClick={() => setSelectedMilestone(prev => Math.max(1, prev - 1))}
              >
                Previous
              </button>
              <button 
                className={styles.controlButton}
                disabled={selectedMilestone >= journeyMilestones.length}
                onClick={() => setSelectedMilestone(prev => Math.min(journeyMilestones.length, prev + 1))}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Core Values Section */}
      <div className={styles.section} ref={valuesRef} data-section="values">
        <div className={styles.container}>
          <motion.div 
            className={styles.sectionTitleWrapper}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={styles.sectionTitle}>Core Philosophy</h2>
            <div className={styles.titleDecoration} />
          </motion.div>
          
          <motion.div 
            className={styles.valuesGrid}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {coreValues.map((value, idx) => (
              <motion.div 
                key={value.id}
                className={`${styles.valueCard} ${expandedValue === value.id ? styles.expanded : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx + 0.5, duration: 0.6 }}
                style={{ '--value-color': value.color }}
                onClick={() => setExpandedValue(expandedValue === value.id ? null : value.id)}
              >
                <div className={styles.valueHeader}>
                  <div className={styles.valueIconContainer} style={{ backgroundColor: `${value.color}20` }}>
                    <div className={styles.valueIcon} style={{ color: value.color }}>
                      {value.icon}
                    </div>
                  </div>
                  <h3>{value.title}</h3>
                </div>
                
                <p className={styles.valueDescription}>{value.description}</p>
                
                <div className={styles.expandControl}>
                  {expandedValue === value.id ? 
                    <span>Show Less <ChevronDown size={16} style={{ transform: 'rotate(180deg)' }} /></span> : 
                    <span>Learn More <ChevronDown size={16} /></span>
                  }
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
      
      {/* Team Section */}
      <div className={styles.section} ref={teamRef} data-section="team">
        <div className={styles.container}>
          <motion.div 
            className={styles.sectionTitleWrapper}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={styles.sectionTitle}>Leadership</h2>
            <div className={styles.titleDecoration} />
          </motion.div>
          
          <div className={styles.teamContent}>
            <motion.div 
              className={styles.teamMember}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className={styles.memberImage}>
                <div className={styles.memberImagePlaceholder}>
                  <span>PP</span>
                </div>
                <div className={styles.imageBorder}></div>
              </div>
              
              <div className={styles.memberInfo}>
                <div className={styles.memberNameWrapper}>
                  <h3>Pedro Perez Serapião</h3>
                  <div className={styles.memberSocials}>
                    <a href="https://www.linkedin.com/in/pedro-perez-serapi%C3%A3o-379079121/" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                      <Linkedin size={18} />
                    </a>
                    <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                      <Github size={18} />
                    </a>
                  </div>
                </div>
                
                <div className={styles.memberRole}>Founder & CEO</div>
                
                <p className={styles.memberBio}>
                  Visionary entrepreneur with a passion for building innovative platforms that empower creators. 
                  Pedro leads PODNEX with a commitment to transforming how collaborative creation happens online.
                </p>
                
                <div className={styles.memberExperience}>
                  <div className={styles.experienceItem}>
                    <div className={styles.experienceIcon}>
                      <Code size={18} />
                    </div>
                    <span>Software Development</span>
                  </div>
                  <div className={styles.experienceItem}>
                    <div className={styles.experienceIcon}>
                      <Rocket size={18} />
                    </div>
                    <span>Startup Leadership</span>
                  </div>
                  <div className={styles.experienceItem}>
                    <div className={styles.experienceIcon}>
                      <Users size={18} />
                    </div>
                    <span>Community Building</span>
                  </div>
                </div>
                
                <blockquote className={styles.memberQuote}>
                  "I believe in a future where creators are valued fairly for their contributions, where collaboration is frictionless, and where great ideas can come to life without traditional gatekeepers."
                </blockquote>
              </div>
            </motion.div>
            
            <div className={styles.teamGrid}>
              <motion.div
                className={styles.teamValues}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <h3>Our Team Values</h3>
                <ul className={styles.valuesList}>
                  <li>
                    <div className={styles.valueIconSmall}>
                      <Zap size={16} />
                    </div>
                    <span>Relentless innovation</span>
                  </li>
                  <li>
                    <div className={styles.valueIconSmall}>
                      <Shield size={16} />
                    </div>
                    <span>Radical transparency</span>
                  </li>
                  <li>
                    <div className={styles.valueIconSmall}>
                      <Target size={16} />
                    </div>
                    <span>Creator empowerment</span>
                  </li>
                  <li>
                    <div className={styles.valueIconSmall}>
                      <Award size={16} />
                    </div>
                    <span>Merit-based recognition</span>
                  </li>
                </ul>
              </motion.div>
              
              <motion.div
                className={styles.joinTeam}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <h3>Join Our Team</h3>
                <p>
                  We're looking for passionate individuals who believe in creating a more collaborative, transparent digital creator economy.
                </p>
                <Link to="/careers" className={styles.joinTeamLink}>
                  <span>View Open Positions</span>
                  <ArrowRight size={16} />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className={styles.section} ref={faqRef} data-section="faq">
        <div className={styles.container}>
          <motion.div 
            className={styles.sectionTitleWrapper}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
            <div className={styles.titleDecoration} />
          </motion.div>
          
          <motion.div 
            className={styles.faqContainer}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className={styles.faqList}>
              {faqData.map((faq, index) => (
                <motion.div 
                  key={index}
                  className={styles.faqItem}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index + 0.4, duration: 0.6 }}
                >
                  <h3 className={styles.faqQuestion}>
                    <BookOpen size={18} />
                    {faq.question}
                  </h3>
                  <p className={styles.faqAnswer}>{faq.answer}</p>
                </motion.div>
              ))}
            </div>
            
            <div className={styles.faqMore}>
              <h3>Still have questions?</h3>
              <p>We'd love to hear from you and help answer any questions about PODNEX.</p>
              <Link to="/contact" className={styles.faqContact}>
                <span>Contact Us</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className={styles.ctaSection}>
        <div className={styles.container}>
          <motion.div 
            className={styles.ctaContent}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2>Ready to join the creator revolution?</h2>
            <p>Start building, collaborating, and launching together on PODNEX.</p>
            <div className={styles.ctaButtons}>
              <Link to="/register" className={styles.primaryButton}>
                Create Account
              </Link>
              <Link to="/explore" className={styles.secondaryButton}>
                Explore Pods
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;