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
  Linkedin
} from 'lucide-react';

const AboutPage = () => {
  // State for active section and animation visibility
  const [activeSection, setActiveSection] = useState('vision');
  const [isVisible, setIsVisible] = useState(true); // Set to true by default
  const [activeStory, setActiveStory] = useState(0);
  const [expandedValue, setExpandedValue] = useState(null);
  
  // State for particles
  const [particles, setParticles] = useState([]);
  
  // References for the sections
  const aboutRef = useRef(null);
  const visionRef = useRef(null);
  const journeyRef = useRef(null);
  const valuesRef = useRef(null);
  const teamRef = useRef(null);
  
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
      { threshold: 0.5, rootMargin: '-20% 0px -30% 0px' }
    );

    const section = aboutRef.current;
    if (section) observer.observe(section);
    
    // Observe each section
    [visionRef, journeyRef, valuesRef, teamRef].forEach(ref => {
      if (ref.current) sectionObserver.observe(ref.current);
    });

    return () => {
      if (section) observer.unobserve(section);
      [visionRef, journeyRef, valuesRef, teamRef].forEach(ref => {
        if (ref.current) sectionObserver.unobserve(ref.current);
      });
    };
  }, [controls]);

  // Core values data
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
  
  // Journey milestones
  const journeyMilestones = [
    {
      year: "2021",
      title: "The Concept Takes Shape",
      description: "After witnessing the struggles of distributed teams to collaborate effectively and fairly attribute work, Pedro began conceptualizing a platform that would solve these fundamental issues.",
      icon: <Zap size={32} />,
      color: "#E8C547"
    },
    {
      year: "2022",
      title: "Research & Validation",
      description: "Extensive research with creators, developers, and designers revealed common pain points: fair attribution, transparent compensation, and structured collaboration processes.",
      icon: <Target size={32} />,
      color: "#34D399"
    },
    {
      year: "2023",
      title: "Platform Development",
      description: "Development of the PODNEX platform began with a focus on creating a seamless, transparent ecosystem for creator collaboration.",
      icon: <Code size={32} />,
      color: "#818CF8"
    },
    {
      year: "2024",
      title: "Beta Launch",
      description: "PODNEX launched in beta with selected creator teams to test and refine the Pod structure, reputation system, and collaboration tools.",
      icon: <Rocket size={32} />,
      color: "#F59E0B"
    },
    {
      year: "2025",
      title: "The Future",
      description: "Expansion plans include advanced AI tools, specialized Pod templates, and deeper integration with creative and development workflows.",
      icon: <Star size={32} />,
      color: "#EC4899"
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

  // Simply logging to console for debug
  console.log("About page rendering. isVisible:", isVisible);

  return (
    <div className={styles.aboutPage} ref={aboutRef}>
      {/* Debug info */}
      <div style={{ position: 'fixed', top: '200px', right: '20px', zIndex: 9999, background: 'rgba(0,0,0,0.7)', padding: '10px', color: 'white', maxWidth: '300px', fontSize: '12px', display: 'none' }}>
        <p>Debug: isVisible: {String(isVisible)}</p>
        <p>activeSection: {activeSection}</p>
        <p>refs: {Boolean(visionRef.current)} {Boolean(journeyRef.current)} {Boolean(valuesRef.current)} {Boolean(teamRef.current)}</p>
      </div>

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
      
      {/* Navigation Pills - MAKE SURE THIS MATCHES WHAT YOU HAVE IN THE UI */}
      {/* This is optional if you're already using a different navigation */}
      {/*
      <div className={styles.navigationPills}>
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
            <span className={styles.pillText}>Journey</span>
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
        </div>
      </div>
      */}
      
      {/* Vision Section */}
      <div className={styles.section} ref={visionRef} data-section="vision">
        <div className={styles.container}>
          <motion.div 
            className={styles.sectionTitleWrapper}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className={styles.sectionTitle}>PODNEX: The Creator-Driven Ecosystem</h1>
            <div className={styles.titleDecoration} />
          </motion.div>
          
          <motion.div 
            className={styles.sectionTagline}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className={styles.taglineHighlight}>Build Bold. Build Together.</span>
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
          </motion.div>
        </div>
      </div>
      
      {/* Journey Section */}
      <div className={styles.section} ref={journeyRef} data-section="journey">
        <div className={styles.container}>
          <motion.div 
            className={styles.sectionTitleWrapper}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={styles.sectionTitle}>Our Journey</h2>
            <div className={styles.titleDecoration} />
          </motion.div>
          
          <motion.div 
            className={styles.timelineContainer}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className={styles.timelineLine}></div>
            
            {journeyMilestones.map((milestone, index) => (
              <motion.div 
                key={index}
                className={styles.timelineItem}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index + 0.5, duration: 0.6 }}
              >
                <div 
                  className={styles.timelineIconContainer}
                  style={{ backgroundColor: `${milestone.color}20`, borderColor: milestone.color }}
                >
                  <div className={styles.timelineIcon} style={{ color: milestone.color }}>
                    {milestone.icon}
                  </div>
                </div>
                <div className={styles.timelineContent}>
                  <div className={styles.timelineYear} style={{ color: milestone.color }}>
                    {milestone.year}
                  </div>
                  <h3 className={styles.timelineTitle}>{milestone.title}</h3>
                  <p className={styles.timelineDescription}>{milestone.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
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
                    <span>Show Less</span> : 
                    <span>Show More</span>
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
          </div>
          
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