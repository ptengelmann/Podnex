import React, { useState, useEffect, useRef } from 'react';
import styles from './AboutPage.module.scss';
import { motion, useAnimation } from 'framer-motion';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  // State for active section and animation visibility
  const [activeSection, setActiveSection] = useState('vision');
  const [isVisible, setIsVisible] = useState(false);
  
  // State for particles
  const [particles, setParticles] = useState([]);
  
  // References for the sections
  const aboutRef = useRef(null);
  const visionRef = useRef(null);
  const valuesRef = useRef(null);
  const teamRef = useRef(null);
  
  // Animation controls
  const controls = useAnimation();
  
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
    [visionRef, valuesRef, teamRef].forEach(ref => {
      if (ref.current) sectionObserver.observe(ref.current);
    });

    return () => {
      if (section) observer.unobserve(section);
      [visionRef, valuesRef, teamRef].forEach(ref => {
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
    },
    {
      id: 'reputation',
      title: 'Reputation is opportunity',
      description: "Your contributions and achievements are tracked, verified, and showcased. On PODNEX, reputation isn't just for show—it unlocks real economic opportunities.",
      color: '#34D399', // Green
    },
    {
      id: 'ecosystems',
      title: 'Ecosystems outperform tools',
      description: "We're building a self-sustaining ecosystem, not just another tool. When all parts work together, the whole becomes exponentially more valuable.",
      color: '#818CF8', // Purple
    },
    {
      id: 'ownership',
      title: 'Ownership is built-in, not gated',
      description: "We believe in equal opportunity and transparency. Everyone who contributes deserves visibility, credit, and a fair share of the value they help create.",
      color: '#F59E0B', // Yellow
    },
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
      
      {/* Navigation Pills */}
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
      
      {/* Vision Section */}
      <div className={styles.section} ref={visionRef} data-section="vision">
        <div className={styles.container}>
          <motion.div 
            className={styles.sectionTitleWrapper}
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h1 className={styles.sectionTitle}>PODNEX: The Creator-Driven Ecosystem</h1>
            <div className={styles.titleDecoration} />
          </motion.div>
          
          <motion.div 
            className={styles.sectionTagline}
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className={styles.taglineHighlight}>Build Bold. Build Together.</span>
          </motion.div>
          
          <motion.div 
            className={styles.visionContent}
            variants={containerVariants}
            initial="hidden"
            animate={controls}
          >
            <motion.p 
              className={styles.visionLead}
              variants={itemVariants}
            >
              PODNEX exists to enable creators to assemble, build, and launch real products, brands, and movements by forming collaborative squads called Pods.
            </motion.p>
            
            <motion.p 
              className={styles.visionText}
              variants={itemVariants}
            >
              We&apos;re not a portfolio site, marketplace, or gig economy clone. PODNEX is a structured creation ecosystem where Pods grow, products are born, and reputations are earned — all transparently.
            </motion.p>
          </motion.div>
        </div>
      </div>
      
      {/* Core Values Section */}
      <div className={styles.section} ref={valuesRef} data-section="values">
        <div className={styles.container}>
          <motion.div 
            className={styles.sectionTitleWrapper}
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className={styles.sectionTitle}>Core Philosophy</h2>
            <div className={styles.titleDecoration} />
          </motion.div>
          
          <motion.div 
            className={styles.valuesGrid}
            variants={containerVariants}
            initial="hidden"
            animate={controls}
          >
            {coreValues.map((value) => (
              <motion.div 
                key={value.id}
                className={styles.valueCard}
                variants={itemVariants}
                style={{ '--value-color': value.color }}
              >
                <h3>{value.title}</h3>
                <p>{value.description}</p>
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
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className={styles.sectionTitle}>Leadership</h2>
            <div className={styles.titleDecoration} />
          </motion.div>
          
          <div className={styles.teamContent}>
            <motion.div 
              className={styles.teamMember}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className={styles.memberInfo}>
                <h3>Pedro Perez Serapião</h3>
                <div className={styles.memberRole}>Founder & CEO</div>
                <p className={styles.memberBio}>
                  Visionary entrepreneur with a passion for building innovative platforms that empower creators. 
                  Pedro leads PODNEX with a commitment to transforming how collaborative creation happens online.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className={styles.ctaSection}>
        <div className={styles.container}>
          <motion.div 
            className={styles.ctaContent}
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
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