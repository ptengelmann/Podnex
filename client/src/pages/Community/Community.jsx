import React, { useState, useRef, useEffect } from 'react';
import styles from './CommunitySection.module.scss';
import { motion, useInView, useAnimation, AnimatePresence } from 'framer-motion';
import { 
  Users,
  Zap,
  Globe,
  MessageSquare,
  Award,
  TrendingUp,
  Hash,
  Star,
  ArrowRight,
  UserPlus,
  Activity,
  Layers,
  Target,
  Rocket,
  Coffee,
  Code,
  Paintbrush,
  PenTool,
  Megaphone,
  Shield,
  Heart
} from 'lucide-react';

const CommunitySection = () => {
  const [activeTab, setActiveTab] = useState('explore');
  const [hoverSpotlight, setHoverSpotlight] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showTestimonial, setShowTestimonial] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: false, threshold: 0.2 });
  const controls = useAnimation();

  // Community member testimonials
  const testimonials = [
    {
      avatar: `https://randomuser.me/api/portraits/men/32.jpg`,
      image: `https://placehold.co/300x200`,
      name: "Alex Chen",
      role: "Pod Creator",
      quote: "PODNEX gave me the framework to assemble a world-class team and launch my SaaS product in just 8 weeks. The reputation system ensures everyone's contributions are valued.",
      color: "#E8C547",
      specialty: "Product Strategy",
      stats: {
        podsLaunched: 3,
        contributions: 47,
        repScore: 92
      }
    },
    {
      avatar: "/api/placeholder/80/80",
      name: "Mia Rodriguez",
      role: "Developer",
      quote: "As a developer, I've quadrupled my portfolio with real projects through PODNEX. The transparent contribution tracking means my work is always recognized and rewarded fairly.",
      color: "#3B82F6",
      specialty: "Frontend React",
      stats: {
        podsJoined: 5,
        contributions: 83,
        repScore: 89
      }
    },
    {
      avatar: "/api/placeholder/80/80",
      name: "Jamal Washington",
      role: "Designer",
      quote: "PODNEX lets me collaborate with talented developers to bring my designs to life. The platform's reputation system has helped me land high-quality clients outside the platform too.",
      color: "#EC4899",
      specialty: "UI/UX",
      stats: {
        podsJoined: 4,
        contributions: 62,
        repScore: 94
      }
    },
    {
      avatar: "/api/placeholder/80/80",
      name: "Sarah Kim",
      role: "Booster",
      quote: "Even without technical skills, I've become a valued part of the PODNEX ecosystem by providing feedback and promoting Pods. The reward system makes it worthwhile and engaging.",
      color: "#10B981",
      specialty: "Growth Marketing",
      stats: {
        podsSupported: 12,
        feedback: 103,
        repScore: 87
      }
    }
  ];

  // Featured Pod categories
  const categories = [
    { id: 'all', name: 'All Pods', icon: <Layers size={18} /> },
    { id: 'tech', name: 'Tech', icon: <Code size={18} /> },
    { id: 'design', name: 'Design', icon: <Paintbrush size={18} /> },
    { id: 'marketing', name: 'Marketing', icon: <Megaphone size={18} /> },
    { id: 'content', name: 'Content', icon: <PenTool size={18} /> }
  ];

  // Featured Pods data
  const featuredPods = [
    {
      id: 1,
      title: "Decentral",
      category: "tech",
      description: "A decentralized finance dashboard that simplifies crypto portfolio management.",
      members: 8,
      status: "In Progress",
      progress: 74,
      lookingFor: ["Backend Developer", "Designer"],
      color: "#3B82F6",
      creator: {
        name: "Tyler Morgan",
        avatar: "/api/placeholder/40/40",
        reputation: 91
      },
      image: "/api/placeholder/300/200"
    },
    {
      id: 2,
      title: "Chromatic",
      category: "design",
      description: "An AI-powered design system generator with code export functionality.",
      members: 5,
      status: "Pre-Launch",
      progress: 89,
      lookingFor: ["Frontend Developer", "Marketer"],
      color: "#EC4899",
      creator: {
        name: "Emma Liu",
        avatar: "/api/placeholder/40/40",
        reputation: 88
      },
      image: "/api/placeholder/300/200"
    },
    {
      id: 3,
      title: "ContentForge",
      category: "content",
      description: "A collaborative platform for writing, editing, and publishing digital content.",
      members: 6,
      status: "Open",
      progress: 42,
      lookingFor: ["Content Writer", "Developer", "Designer"],
      color: "#10B981",
      creator: {
        name: "Marcus Allen",
        avatar: "/api/placeholder/40/40",
        reputation: 84
      },
      image: "/api/placeholder/300/200"
    },
    {
      id: 4,
      title: "GrowthPulse",
      category: "marketing",
      description: "Marketing analytics platform with AI-powered insights and recommendations.",
      members: 7,
      status: "In Progress",
      progress: 68,
      lookingFor: ["Data Analyst", "Frontend Developer"],
      color: "#F59E0B",
      creator: {
        name: "Sophia Cruz",
        avatar: "/api/placeholder/40/40",
        reputation: 93
      },
      image: "/api/placeholder/300/200"
    },
    {
      id: 5,
      title: "CodeMentor",
      category: "tech",
      description: "Peer-to-peer coding mentorship platform with integrated learning paths.",
      members: 6,
      status: "Open",
      progress: 35,
      lookingFor: ["Backend Developer", "UX Researcher", "Marketer"],
      color: "#8B5CF6",
      creator: {
        name: "David Park",
        avatar: "/api/placeholder/40/40",
        reputation: 89
      },
      image: "/api/placeholder/300/200"
    },
    {
      id: 6,
      title: "Visualist",
      category: "design",
      description: "Data visualization tool for creating interactive reports and dashboards.",
      members: 5,
      status: "In Progress",
      progress: 62,
      lookingFor: ["Data Scientist", "Frontend Developer"],
      color: "#EC4899",
      creator: {
        name: "Jordan Taylor",
        avatar: "/api/placeholder/40/40",
        reputation: 86
      },
      image: "/api/placeholder/300/200"
    },
  ];

  // Community highlights data
  const communityHighlights = [
    {
      icon: <Globe size={32} />,
      title: "Global Community",
      count: "2,500+",
      description: "Members from 60+ countries",
      color: "#E8C547"
    },
    {
      icon: <Layers size={32} />,
      title: "Active Pods",
      count: "430",
      description: "Currently building amazing products",
      color: "#3B82F6"
    },
    {
      icon: <Rocket size={32} />,
      title: "Launched Products",
      count: "125",
      description: "Successfully shipped to market",
      color: "#10B981"
    },
    {
      icon: <Activity size={32} />,
      title: "Weekly Contributions",
      count: "1,800+",
      description: "Tasks completed across all Pods",
      color: "#EC4899"
    }
  ];

  // Events and activities data
  const upcomingEvents = [
    {
      title: "Pod Creator Workshop",
      date: "May 8, 2025",
      time: "1:00 PM EST",
      type: "Workshop",
      description: "Learn how to structure successful Pods and attract top contributors.",
      host: "Alex Chen, Founder of Decentral",
      icon: <Target size={20} />,
      color: "#3B82F6"
    },
    {
      title: "Design Systems Masterclass",
      date: "May 12, 2025",
      time: "11:00 AM EST",
      type: "Masterclass",
      description: "Advanced techniques for creating scalable design systems in collaborative environments.",
      host: "Jamal Washington, Senior Designer",
      icon: <Paintbrush size={20} />,
      color: "#EC4899"
    },
    {
      title: "Community Coffee Hour",
      date: "May 15, 2025",
      time: "9:00 AM EST",
      type: "Networking",
      description: "Casual networking session to meet other PODNEX members and discuss potential collaborations.",
      host: "PODNEX Community Team",
      icon: <Coffee size={20} />,
      color: "#E8C547"
    },
    {
      title: "React for Pod Projects",
      date: "May 18, 2025",
      time: "2:00 PM EST",
      type: "Tutorial",
      description: "Building scalable React applications in a collaborative Pod environment.",
      host: "Mia Rodriguez, Frontend Developer",
      icon: <Code size={20} />,
      color: "#10B981"
    }
  ];

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
      opacity: 0,
      y: 20
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    },
    hover: {
      y: -10,
      transition: {
        duration: 0.3
      }
    }
  };

  const spotlightVariant = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { duration: 0.5 }
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
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

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setShowTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Filter pods by category
  const filteredPods = selectedCategory === 'all' 
    ? featuredPods 
    : featuredPods.filter(pod => pod.category === selectedCategory);

  return (
    <section className={styles.communitySection} ref={sectionRef}>
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
          <span className={styles.badge}>Community</span>
        </div>
        <h2 className={styles.sectionTitle}>
          Join The <span className={styles.highlight}>PODNEX</span> Ecosystem
        </h2>
        <p className={styles.sectionSubtitle}>
          Connect with creators, contributors, and boosters who are building the next generation of products and services
        </p>
      </motion.div>

      {/* Community Highlights */}
      <motion.div 
        className={styles.communityHighlights}
        variants={container}
        initial="hidden"
        animate={controls}
      >
        {communityHighlights.map((highlight, index) => (
          <motion.div 
            key={index}
            className={styles.highlightCard}
            variants={item}
            whileHover={{ y: -10, transition: { duration: 0.3 } }}
          >
            <div 
              className={styles.highlightIcon}
              style={{ color: highlight.color, backgroundColor: `${highlight.color}15` }}
            >
              {highlight.icon}
            </div>
            <h3 className={styles.highlightCount} style={{ color: highlight.color }}>
              {highlight.count}
            </h3>
            <h4 className={styles.highlightTitle}>{highlight.title}</h4>
            <p className={styles.highlightDescription}>{highlight.description}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Tab Selector */}
      <motion.div 
        className={styles.tabSelector}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <motion.button 
          className={`${styles.tabButton} ${activeTab === 'explore' ? styles.activeTab : ''}`}
          variants={tabVariants}
          animate={activeTab === 'explore' ? 'active' : 'inactive'}
          onClick={() => setActiveTab('explore')}
        >
          <Globe size={18} />
          Explore Pods
        </motion.button>
        
        <motion.button 
          className={`${styles.tabButton} ${activeTab === 'members' ? styles.activeTab : ''}`}
          variants={tabVariants}
          animate={activeTab === 'members' ? 'active' : 'inactive'}
          onClick={() => setActiveTab('members')}
        >
          <Users size={18} />
          Member Spotlights
        </motion.button>
        
        <motion.button 
          className={`${styles.tabButton} ${activeTab === 'events' ? styles.activeTab : ''}`}
          variants={tabVariants}
          animate={activeTab === 'events' ? 'active' : 'inactive'}
          onClick={() => setActiveTab('events')}
        >
          <MessageSquare size={18} />
          Events & Activities
        </motion.button>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* Explore Pods View */}
        {activeTab === 'explore' && (
          <motion.div 
            key="explore"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className={styles.exploreView}
          >
            {/* Pod Categories Filter */}
            <motion.div 
              className={styles.categoriesFilter}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  className={`${styles.categoryButton} ${selectedCategory === category.id ? styles.activeCategory : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category.icon}
                  {category.name}
                </motion.button>
              ))}
            </motion.div>
            
            {/* Featured Pods */}
            <motion.div 
              className={styles.podsGrid}
              variants={container}
              initial="hidden"
              animate="visible"
            >
              {filteredPods.map((pod) => (
                <motion.div 
                  key={pod.id}
                  className={styles.podCard}
                  variants={cardVariants}
                  whileHover="hover"
                >
                  <div className={styles.podImageContainer}>
                    <div 
                      className={styles.podStatusBadge}
                      style={{ backgroundColor: pod.color }}
                    >
                      {pod.status}
                    </div>
                    <img src={pod.image} alt={pod.title} className={styles.podImage} />
                    <div className={styles.podProgress}>
                      <div 
                        className={styles.podProgressBar} 
                        style={{ width: `${pod.progress}%`, backgroundColor: pod.color }}
                      />
                    </div>
                  </div>
                  
                  <div className={styles.podContent}>
                    <div className={styles.podHeader}>
                      <h3 className={styles.podTitle}>{pod.title}</h3>
                      <div 
                        className={styles.podCategoryTag}
                        style={{ backgroundColor: `${pod.color}15`, color: pod.color }}
                      >
                        {categories.find(c => c.id === pod.category)?.name || pod.category}
                      </div>
                    </div>
                    
                    <p className={styles.podDescription}>{pod.description}</p>
                    
                    <div className={styles.podMeta}>
                      <div className={styles.podCreator}>
                        <img src={pod.creator.avatar} alt={pod.creator.name} className={styles.creatorAvatar} />
                        <div className={styles.creatorInfo}>
                          <span className={styles.creatorName}>{pod.creator.name}</span>
                          <div className={styles.creatorRep}>
                            <Star size={12} />
                            <span>{pod.creator.reputation}</span>
                          </div>
                        </div>
                      </div>
                      <div className={styles.podStats}>
                        <div className={styles.statItem}>
                          <Users size={14} />
                          <span>{pod.members}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles.podFooter}>
                      <div className={styles.lookingFor}>
                        <h4>Looking for:</h4>
                        <div className={styles.roles}>
                          {pod.lookingFor.map((role, index) => (
                            <span 
                              key={index} 
                              className={styles.roleTag}
                              style={{ backgroundColor: `${pod.color}10`, color: pod.color }}
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <motion.button 
                        className={styles.podButton}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{ backgroundColor: pod.color }}
                      >
                        View Pod
                        <ArrowRight size={16} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            
            <motion.div 
              className={styles.exploreCta}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.button 
                className={styles.viewAllButton}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Globe size={18} />
                View All Pods
              </motion.button>
              <motion.button 
                className={styles.createPodButton}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Zap size={18} />
                Create a Pod
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {/* Member Spotlights View */}
        {activeTab === 'members' && (
          <motion.div 
            key="members"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className={styles.membersView}
          >
            <div className={styles.testimonialSection}>
              <div className={styles.testimonialNav}>
                {testimonials.map((_, index) => (
                  <motion.button
                    key={index}
                    className={`${styles.testimonialDot} ${showTestimonial === index ? styles.active : ''}`}
                    onClick={() => setShowTestimonial(index)}
                    whileHover={{ scale: 1.2 }}
                    style={{ 
                      backgroundColor: showTestimonial === index ? testimonials[index].color : '',
                      borderColor: showTestimonial === index ? testimonials[index].color : ''
                    }}
                  />
                ))}
              </div>
              
              <AnimatePresence mode="wait">
                {testimonials.map((testimonial, index) => (
                  showTestimonial === index && (
                    <motion.div
                      key={index}
                      className={styles.testimonialCard}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.5 }}
                      style={{ '--testimonial-color': testimonial.color }}
                    >
                      <div className={styles.testimonialContent}>
                        <div className={styles.testimonialQuote}>
                          <div className={styles.quoteIcon} style={{ color: testimonial.color }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M11.3 5.1C6.3 5.1 2.1 9.3 2.1 14.5v4.4h4.4v-4.4c0-2.7 2.2-4.9 4.9-4.9h2.2V5.1h-2.3zm8.8 0v4.4h2.2c2.7 0 4.9 2.2 4.9 4.9v4.4h4.4v-4.4c0-5.1-4.2-9.3-9.3-9.3h-2.2z" />
                            </svg>
                          </div>
                          <blockquote>{testimonial.quote}</blockquote>
                        </div>
                        
                        <div className={styles.memberStats}>
                          {Object.entries(testimonial.stats).map(([key, value], i) => (
                            <div key={i} className={styles.memberStat}>
                              <span className={styles.statValue} style={{ color: testimonial.color }}>
                                {value}
                              </span>
                              <span className={styles.statLabel}>
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className={styles.testimonialProfile}>
                        <div className={styles.profileImageWrapper}>
                          <div 
                            className={styles.profileImageBorder} 
                            style={{ borderColor: testimonial.color }}
                          />
                          <img src={testimonial.avatar} alt={testimonial.name} className={styles.profileImage} />
                        </div>
                        
                        <div className={styles.profileInfo}>
                          <h3 className={styles.profileName}>{testimonial.name}</h3>
                          <div 
                            className={styles.profileRole}
                            style={{ backgroundColor: `${testimonial.color}15`, color: testimonial.color }}
                          >
                            {testimonial.role}
                          </div>
                          <div className={styles.profileSpecialty}>
                            <span className={styles.specialtyLabel}>Specialty:</span>
                            <span className={styles.specialtyValue}>{testimonial.specialty}</span>
                          </div>
                          <motion.button 
                            className={styles.viewProfileButton}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{ backgroundColor: testimonial.color }}
                          >
                            View Profile
                            <ArrowRight size={16} />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )
                ))}
              </AnimatePresence>
            </div>
            
            <motion.div 
              className={styles.memberSpotlights}
              variants={container}
              initial="hidden"
              animate="visible"
            >
              <h3 className={styles.spotlightsTitle}>Featured Community Members</h3>
              
              <div className={styles.spotlightsGrid}>
                {[
                  { role: "Pod Creator", icon: <Rocket size={24} />, color: "#E8C547", count: 120 },
                  { role: "Developer", icon: <Code size={24} />, color: "#3B82F6", count: 450 },
                  { role: "Designer", icon: <Paintbrush size={24} />, color: "#EC4899", count: 380 },
                  { role: "Content Writer", icon: <PenTool size={24} />, color: "#10B981", count: 290 },
                  { role: "Marketer", icon: <Megaphone size={24} />, color: "#F59E0B", count: 210 },
                  { role: "QA Tester", icon: <Shield size={24} />, color: "#8B5CF6", count: 180 }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className={styles.roleSpotlight}
                    variants={spotlightVariant}
                    whileHover="hover"
                    onHoverStart={() => setHoverSpotlight(index)}
                    onHoverEnd={() => setHoverSpotlight(null)}
                    style={{
                      '--role-color': item.color,
                      boxShadow: hoverSpotlight === index ? `0 15px 30px rgba(0,0,0,0.2), 0 0 15px ${item.color}30` : 'none',
                      borderColor: hoverSpotlight === index ? `${item.color}50` : 'rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <div 
                      className={styles.roleIcon}
                      style={{ 
                        backgroundColor: `${item.color}20`,
                        color: item.color
                      }}
                    >
                      {item.icon}
                    </div>
                    <h4 className={styles.roleTitle}>{item.role}s</h4>
                    <div className={styles.roleCount}>
                      <span className={styles.number} style={{ color: item.color }}>{item.count}</span>
                      <span className={styles.label}>active members</span>
                    </div>

                    <motion.button 
                      className={styles.viewMembersButton}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{ 
                        backgroundColor: hoverSpotlight === index ? item.color : 'transparent',
                        color: hoverSpotlight === index ? '#000' : item.color,
                        borderColor: item.color
                      }}
                    >
                      View Members
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              className={styles.membersCta}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className={styles.ctaContent}>
                <h3>Build your PODNEX reputation</h3>
                <p>Join our community of creators and contributors from around the world</p>
              </div>
              <motion.button 
                className={styles.joinButton}
                whileHover={{ scale: 1.05, backgroundColor: "#E8C547" }}
                whileTap={{ scale: 0.95 }}
              >
                <UserPlus size={18} />
                Join PODNEX
              </motion.button>
            </motion.div>
          </motion.div>
        )}
        
        {/* Events & Activities View */}
        {activeTab === 'events' && (
          <motion.div 
            key="events"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className={styles.eventsView}
          >
            <motion.div 
              className={styles.eventsIntro}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3>Connect, Learn, and Grow</h3>
              <p>Join online events and activities designed to help you build skills and network with other members</p>
            </motion.div>
            
            <motion.div 
              className={styles.eventsGrid}
              variants={container}
              initial="hidden"
              animate="visible"
            >
              {upcomingEvents.map((event, index) => (
                <motion.div 
                  key={index}
                  className={styles.eventCard}
                  variants={item}
                  whileHover={{ y: -8 }}
                >
                  <div className={styles.eventHeader}>
                    <div 
                      className={styles.eventType}
                      style={{ backgroundColor: `${event.color}15`, color: event.color }}
                    >
                      {event.icon}
                      {event.type}
                    </div>
                    <div className={styles.eventDateTime}>
                      <div className={styles.eventDate}>{event.date}</div>
                      <div className={styles.eventTime}>{event.time}</div>
                    </div>
                  </div>
                  
                  <h3 className={styles.eventTitle}>{event.title}</h3>
                  <p className={styles.eventDescription}>{event.description}</p>
                  
                  <div className={styles.eventHost}>
                    <span className={styles.hostLabel}>Hosted by:</span>
                    <span className={styles.hostName}>{event.host}</span>
                  </div>
                  
                  <motion.button 
                    className={styles.registerButton}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ backgroundColor: event.color }}
                  >
                    Register
                    <ArrowRight size={16} />
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>
            
            <motion.div 
              className={styles.communityForums}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className={styles.forumsHeader}>
                <h3>Community Forums</h3>
                <p>Join discussions on topics relevant to creators and contributors</p>
              </div>
              
              <div className={styles.forumCategories}>
                {[
                  { name: "Pod Development", icon: <Rocket size={18} />, color: "#E8C547", threads: 68, activity: "High" },
                  { name: "Technical Help", icon: <Code size={18} />, color: "#3B82F6", threads: 124, activity: "Very High" },
                  { name: "Design Talk", icon: <Paintbrush size={18} />, color: "#EC4899", threads: 97, activity: "High" },
                  { name: "Marketing Strategy", icon: <TrendingUp size={18} />, color: "#F59E0B", threads: 42, activity: "Medium" },
                  { name: "Contributor Corner", icon: <Users size={18} />, color: "#10B981", threads: 83, activity: "High" },
                  { name: "Success Stories", icon: <Award size={18} />, color: "#8B5CF6", threads: 36, activity: "Medium" }
                ].map((forum, index) => (
                  <motion.div 
                    key={index}
                    className={styles.forumCategory}
                    whileHover={{ y: -5, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                  >
                    <div 
                      className={styles.forumIcon}
                      style={{ backgroundColor: `${forum.color}20`, color: forum.color }}
                    >
                      {forum.icon}
                    </div>
                    <div className={styles.forumInfo}>
                      <h4 className={styles.forumName}>{forum.name}</h4>
                      <div className={styles.forumStats}>
                        <span className={styles.threadCount}>{forum.threads} threads</span>
                        <span 
                          className={styles.activityLevel}
                          style={{ 
                            backgroundColor: forum.activity === 'Very High' ? '#10B981' : 
                                           forum.activity === 'High' ? '#E8C547' : 
                                           '#F59E0B'
                          }}
                        >
                          {forum.activity}
                        </span>
                      </div>
                    </div>
                    <ArrowRight size={16} className={styles.forumArrow} />
                  </motion.div>
                ))}
              </div>
              
              <motion.button 
                className={styles.allForumsButton}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <MessageSquare size={18} />
                View All Forums
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Community Values Section */}
      <motion.div 
        className={styles.valuesSection}
        initial={{ opacity: 0, y: 30 }}
        animate={controls}
        variants={{
          visible: { opacity: 1, y: 0, transition: { delay: 0.6, duration: 0.8 } }
        }}
      >
        <h3 className={styles.valuesTitle}>Our Community Values</h3>
        <div className={styles.valuesGrid}>
          {[
            { 
              title: "Collaboration", 
              description: "Creation is a team sport, not a solo journey", 
              icon: <Users size={24} />, 
              color: "#E8C547" 
            },
            { 
              title: "Transparency", 
              description: "Contributions are tracked and visibly recognized", 
              icon: <Layers size={24} />, 
              color: "#3B82F6" 
            },
            { 
              title: "Ownership", 
              description: "Fair attribution and reward for your work", 
              icon: <Award size={24} />, 
              color: "#EC4899" 
            },
            { 
              title: "Support", 
              description: "A community that helps each other succeed", 
              icon: <Heart size={24} />,
              color: "#10B981" 
            }
          ].map((value, index) => (
            <motion.div 
              key={index}
              className={styles.valueCard}
              variants={item}
              whileHover={{ y: -8 }}
            >
              <div 
                className={styles.valueIcon}
                style={{ backgroundColor: `${value.color}15`, color: value.color }}
              >
                {value.icon}
              </div>
              <h4 className={styles.valueTitle}>{value.title}</h4>
              <p className={styles.valueDescription}>{value.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div 
        className={styles.ctaContainer}
        initial={{ opacity: 0, y: 30 }}
        animate={controls}
        variants={{
          visible: { opacity: 1, y: 0, transition: { delay: 0.8, duration: 0.8 } }
        }}
      >
        <div className={styles.ctaContent}>
          <h3>Ready to Join Our Community?</h3>
          <p>Start collaborating with talented individuals and build something amazing together</p>
        </div>
        <motion.button 
          className={styles.ctaButton}
          whileHover={{ scale: 1.05, backgroundColor: "#E8C547" }}
          whileTap={{ scale: 0.95 }}
        >
          Get Started Today
          <ArrowRight size={20} />
        </motion.button>
      </motion.div>
    </section>
  );
};

export default CommunitySection;