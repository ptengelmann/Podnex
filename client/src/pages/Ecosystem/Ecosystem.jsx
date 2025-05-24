import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useAnimation, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  ChevronRight, 
  Play, 
  Pause, 
  RotateCw, 
  Zap, 
  Target, 
  Users, 
  Briefcase, 
  Star, 
  TrendingUp, 
  Award, 
  DollarSign, 
  Clock, 
  Activity, 
  Globe, 
  ArrowRight, 
  Plus, 
  Eye, 
  Filter, 
  Search,
  Layers,
  Code,
  Paintbrush,
  PenTool,
  Megaphone,
  Video,
  Database,
  Box,
  MessageSquare,
  Settings,
  Calendar,
  Shield,
  Sparkles,
  Info,
  HelpCircle,
  BarChart2,
  Grid,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Maximize2,
  Minimize2
} from 'lucide-react';
import styles from './EcosystemSection.module.scss';

const EcosystemPage = () => {
  const navigate = useNavigate();
  const ecosystemRef = useRef(null);
  const controls = useAnimation();
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  
  // Enhanced state management
  const [activeView, setActiveView] = useState('overview');
  const [activeStage, setActiveStage] = useState('creation');
  const [activeRole, setActiveRole] = useState('creators');
  const [activeState, setActiveState] = useState('open');
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('pods');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredCard, setHoveredCard] = useState(null);
  const [autoplay, setAutoplay] = useState(true);
  const [currentAnimation, setCurrentAnimation] = useState(0);

  // Enhanced ecosystem data with more interactive elements
  const ecosystemStages = [
    {
      id: 'creation',
      title: 'Pod Creation',
      shortTitle: 'Create',
      icon: <Plus size={24} />,
      description: 'Launch a Pod with a mission, needed roles, and visual style.',
      detailedDescription: 'The journey begins with visionary creators who transform ideas into structured opportunities. This phase involves defining the project scope, establishing the visual identity, and outlining the specific roles needed to bring the vision to life.',
      bullets: ['Define mission & scope', 'Set visual brand identity', 'Specify needed roles & skills'],
      color: '#E8C547',
      gradient: 'linear-gradient(135deg, #E8C547 0%, #F59E0B 100%)',
      stats: { active: 342, completed: 1208 },
      duration: '1-3 days',
      difficulty: 'Easy',
      successRate: 95,
      nextStage: 'build'
    },
    {
      id: 'build',
      title: 'Build Phase',
      shortTitle: 'Build',
      icon: <Code size={24} />,
      description: 'Collaborate with contributors to build your vision.',
      detailedDescription: 'The most dynamic phase where magic happens. Contributors with diverse skills come together, tasks are distributed, progress is tracked, and the project takes shape through collaborative effort.',
      bullets: ['Smart task assignment', 'Real-time contribution tracking', 'Automated verification system'],
      color: '#34D399',
      gradient: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)',
      stats: { active: 189, completed: 892 },
      duration: '2-12 weeks',
      difficulty: 'Medium',
      successRate: 78,
      nextStage: 'prelaunch'
    },
    {
      id: 'prelaunch',
      title: 'Pre-Launch',
      shortTitle: 'Test',
      icon: <Target size={24} />,
      description: 'Test, refine, and prepare for market.',
      detailedDescription: 'Quality assurance and market preparation phase. Public testing validates assumptions, final assembly ensures everything works seamlessly, and marketing strategies are refined for maximum impact.',
      bullets: ['Community beta testing', 'Final quality assurance', 'Strategic marketing preparation'],
      color: '#FBBF24',
      gradient: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)',
      stats: { active: 67, completed: 445 },
      duration: '1-4 weeks',
      difficulty: 'Medium',
      successRate: 82,
      nextStage: 'launch'
    },
    {
      id: 'launch',
      title: 'Launch',
      shortTitle: 'Launch',
      icon: <Zap size={24} />,
      description: 'Release your product to the world and earn reputation.',
      detailedDescription: 'The culmination of collaborative effort. Products go live, sales generate revenue, reputation scores increase based on success metrics, and earnings are distributed according to predefined agreements.',
      bullets: ['Product sales & distribution', 'Reputation & credibility earned', 'Automated revenue sharing'],
      color: '#818CF8',
      gradient: 'linear-gradient(135deg, #818CF8 0%, #6366F1 100%)',
      stats: { active: 34, completed: 267 },
      duration: 'Ongoing',
      difficulty: 'Hard',
      successRate: 73,
      nextStage: 'evolution'
    },
    {
      id: 'evolution',
      title: 'Evolution',
      shortTitle: 'Evolve',
      icon: <TrendingUp size={24} />,
      description: 'Archive successful Pods or fork for the next version.',
      detailedDescription: 'The final phase where successful projects either conclude gracefully or evolve into new opportunities. Archived pods become templates for future creators, while forked versions enable continuous innovation.',
      bullets: ['Graceful project archival', 'Fork for version 2.0', 'New opportunity generation'],
      color: '#EC4899',
      gradient: 'linear-gradient(135deg, #EC4899 0%, #BE185D 100%)',
      stats: { active: 0, completed: 156 },
      duration: 'Variable',
      difficulty: 'Easy',
      successRate: 100,
      nextStage: 'creation'
    }
  ];

  const userRoles = [
    {
      id: 'creators',
      title: 'Pod Creators',
      shortTitle: 'Creators',
      icon: <Sparkles size={24} />,
      description: 'Visionaries who initiate Pods with innovative ideas and clear direction.',
      detailedDescription: 'The architects of innovation who see opportunities where others see challenges. They define the vision, set the direction, and create the foundation for collaborative success.',
      color: '#E8C547',
      gradient: 'linear-gradient(135deg, #E8C547 0%, #F59E0B 100%)',
      stats: { total: 1247, active: 342, avgRating: 4.8 },
      skills: ['Vision & Strategy', 'Leadership', 'Project Planning'],
      earnings: { min: '$2,500', max: '$25,000', avg: '$8,750' },
      timeCommitment: '10-20 hrs/week'
    },
    {
      id: 'contributors',
      title: 'Contributors',
      shortTitle: 'Contributors',
      icon: <Users size={24} />,
      description: 'Specialists who power Pods with their expertise - developers, designers, marketers, and writers.',
      detailedDescription: 'The skilled professionals who transform visions into reality. Each brings unique expertise and collaborative spirit to drive projects forward.',
      color: '#34D399',
      gradient: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)',
      stats: { total: 8934, active: 2156, avgRating: 4.7 },
      skills: ['Technical Skills', 'Domain Expertise', 'Collaboration'],
      earnings: { min: '$500', max: '$15,000', avg: '$3,200' },
      timeCommitment: '5-30 hrs/week'
    },
    {
      id: 'boosters',
      title: 'Boosters',
      shortTitle: 'Boosters',
      icon: <TrendingUp size={24} />,
      description: 'Users who amplify Pods via promotion, feedback, and testing to increase visibility and impact.',
      detailedDescription: 'The community champions who amplify success through strategic promotion, valuable feedback, and thorough testing.',
      color: '#FBBF24',
      gradient: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)',
      stats: { total: 3428, active: 891, avgRating: 4.6 },
      skills: ['Marketing', 'Community Building', 'Testing'],
      earnings: { min: '$100', max: '$5,000', avg: '$750' },
      timeCommitment: '2-10 hrs/week'
    },
    {
      id: 'buyers',
      title: 'Buyers',
      shortTitle: 'Buyers',
      icon: <DollarSign size={24} />,
      description: 'Supporters who purchase final products/services and provide valuable market validation.',
      detailedDescription: 'The market validators who provide the ultimate test of value through their purchasing decisions and honest feedback.',
      color: '#818CF8',
      gradient: 'linear-gradient(135deg, #818CF8 0%, #6366F1 100%)',
      stats: { total: 12456, active: 4567, avgRating: 4.5 },
      skills: ['Market Knowledge', 'Quality Assessment', 'Feedback'],
      earnings: { min: 'N/A', max: 'N/A', avg: 'Value Received' },
      timeCommitment: '1-5 hrs/week'
    },
    {
      id: 'backers',
      title: 'Backers',
      shortTitle: 'Backers',
      icon: <Award size={24} />,
      description: 'Investors/sponsors funding Pods or backing top contributors in future platform phases.',
      detailedDescription: 'The financial enablers who see potential before others and provide the resources needed to turn ambitious visions into market realities.',
      color: '#EC4899',
      gradient: 'linear-gradient(135deg, #EC4899 0%, #BE185D 100%)',
      stats: { total: 234, active: 89, avgRating: 4.9 },
      skills: ['Investment Analysis', 'Risk Assessment', 'Mentoring'],
      earnings: { min: 'Investment', max: 'Returns', avg: '15-25% ROI' },
      timeCommitment: '1-3 hrs/week'
    }
  ];

  const podStates = [
    {
      id: 'draft',
      title: 'Draft',
      description: 'Private exploration phase for Pod creators.',
      color: '#6B7280',
      count: 127,
      avgDuration: '2-5 days'
    },
    {
      id: 'open',
      title: 'Open',
      description: 'Public, actively recruiting contributors.',
      color: '#3B82F6',
      count: 289,
      avgDuration: '1-3 weeks'
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      description: 'Active building phase with contributors working.',
      color: '#10B981',
      count: 156,
      avgDuration: '4-12 weeks'
    },
    {
      id: 'pre-launch',
      title: 'Pre-Launch',
      description: 'Final preparation and testing before launch.',
      color: '#F59E0B',
      count: 43,
      avgDuration: '1-4 weeks'
    },
    {
      id: 'live',
      title: 'Live',
      description: 'Actively selling products/services to buyers.',
      color: '#8B5CF6',
      count: 78,
      avgDuration: 'Ongoing'
    },
    {
      id: 'archived',
      title: 'Archived',
      description: 'Concluded project, available for forking.',
      color: '#6B7280',
      count: 234,
      avgDuration: 'Permanent'
    }
  ];

  const metrics = [
    { id: 'pods', label: 'Total Pods', value: '2,847', change: '+12%', icon: <Box size={20} /> },
    { id: 'users', label: 'Active Users', value: '18,394', change: '+8%', icon: <Users size={20} /> },
    { id: 'revenue', label: 'Revenue Generated', value: '$1.2M', change: '+15%', icon: <DollarSign size={20} /> },
    { id: 'success', label: 'Success Rate', value: '78%', change: '+3%', icon: <Target size={20} /> }
  ];

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

  // Auto-animation system
  useEffect(() => {
    if (autoplay && activeView === 'lifecycle') {
      const interval = setInterval(() => {
        setCurrentAnimation(prev => (prev + 1) % ecosystemStages.length);
        setActiveStage(ecosystemStages[currentAnimation].id);
      }, 4000);
      
      return () => clearInterval(interval);
    }
  }, [autoplay, activeView, currentAnimation, ecosystemStages]);

  // View configurations
  const views = [
    { id: 'overview', label: 'Overview', icon: <Grid size={18} /> },
    { id: 'lifecycle', label: 'Pod Lifecycle', icon: <Activity size={18} /> },
    { id: 'roles', label: 'User Roles', icon: <Users size={18} /> },
    { id: 'states', label: 'Pod States', icon: <Layers size={18} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart2 size={18} /> }
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
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.6, ease: [0.175, 0.885, 0.32, 1.075] }
    }
  };

  const cardVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    },
    hover: { 
      scale: 1.02, 
      y: -5,
      transition: { duration: 0.2 }
    }
  };

  const currentStage = ecosystemStages.find(stage => stage.id === activeStage);
  const currentRole = userRoles.find(role => role.id === activeRole);

  return (
    <div className={styles.ecosystemPage}>
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
            rotate: [0, 10, -10, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className={`${styles.floatingShape} ${styles.shape2}`}
          animate={{
            x: [0, -20, 0],
            y: [0, 20, 0],
            rotate: [0, -10, 10, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      <div className={styles.container}>
        {/* Enhanced Header */}
        <motion.div 
          className={styles.header}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className={styles.breadcrumbs}>
            <span onClick={() => navigate('/')}>Home</span>
            <ChevronRight size={16} />
            <span className={styles.current}>Ecosystem</span>
          </div>

          <motion.div className={styles.titleSection} variants={itemVariants}>
            <div className={styles.iconWrapper}>
              <Globe size={48} />
              <motion.div 
                className={styles.iconGlow}
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            
            <h1>PODNEX Ecosystem</h1>
            <p>Discover how collaborative innovation transforms ideas into successful products</p>
          </motion.div>

          {/* Live Metrics Dashboard */}
          <motion.div className={styles.metricsGrid} variants={itemVariants}>
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.id}
                className={`${styles.metricCard} ${selectedMetric === metric.id ? styles.selected : ''}`}
                onClick={() => setSelectedMetric(metric.id)}
                variants={cardVariants}
                whileHover="hover"
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
              >
                <div className={styles.metricIcon}>{metric.icon}</div>
                <div className={styles.metricInfo}>
                  <h3>{metric.value}</h3>
                  <p>{metric.label}</p>
                  <span className={styles.metricChange}>
                    <ArrowUp size={14} />
                    {metric.change}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Enhanced Navigation */}
        <motion.div 
          className={styles.navigation}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <div className={styles.viewTabs}>
            {views.map((view) => (
              <motion.button
                key={view.id}
                className={`${styles.viewTab} ${activeView === view.id ? styles.active : ''}`}
                onClick={() => setActiveView(view.id)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                {view.icon}
                <span>{view.label}</span>
                {activeView === view.id && (
                  <motion.div 
                    className={styles.activeIndicator}
                    layoutId="activeView"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Enhanced Controls */}
          <div className={styles.controls}>
            <div className={styles.searchBox}>
              <Search size={18} />
              <input
                type="text"
                placeholder="Search ecosystem..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {activeView === 'lifecycle' && (
              <div className={styles.playbackControls}>
                <motion.button
                  className={styles.controlButton}
                  onClick={() => setAutoplay(!autoplay)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {autoplay ? <Pause size={16} /> : <Play size={16} />}
                </motion.button>
                <motion.button
                  className={styles.controlButton}
                  onClick={() => setCurrentAnimation(0)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <RotateCw size={16} />
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            className={styles.contentArea}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {/* Overview View */}
            {activeView === 'overview' && (
              <div className={styles.overviewContent}>
                <div className={styles.overviewGrid}>
                  <motion.div 
                    className={styles.overviewCard}
                    variants={cardVariants}
                    whileHover="hover"
                  >
                    <div className={styles.cardHeader}>
                      <Activity size={24} />
                      <h3>How It Works</h3>
                    </div>
                    <p>From idea to market success through collaborative innovation</p>
                    <div className={styles.cardFooter}>
                      <button onClick={() => setActiveView('lifecycle')}>
                        Explore Journey <ArrowRight size={16} />
                      </button>
                    </div>
                  </motion.div>

                  <motion.div 
                    className={styles.overviewCard}
                    variants={cardVariants}
                    whileHover="hover"
                  >
                    <div className={styles.cardHeader}>
                      <Users size={24} />
                      <h3>Community Roles</h3>
                    </div>
                    <p>Discover your place in the collaborative ecosystem</p>
                    <div className={styles.cardFooter}>
                      <button onClick={() => setActiveView('roles')}>
                        Find Your Role <ArrowRight size={16} />
                      </button>
                    </div>
                  </motion.div>

                  <motion.div 
                    className={styles.overviewCard}
                    variants={cardVariants}
                    whileHover="hover"
                  >
                    <div className={styles.cardHeader}>
                      <BarChart2 size={24} />
                      <h3>Success Metrics</h3>
                    </div>
                    <p>Real-time insights into ecosystem performance</p>
                    <div className={styles.cardFooter}>
                      <button onClick={() => setActiveView('analytics')}>
                        View Analytics <ArrowRight size={16} />
                      </button>
                    </div>
                  </motion.div>
                </div>

                {/* Quick Actions */}
                <motion.div className={styles.quickActions} variants={itemVariants}>
                  <h2>Get Started</h2>
                  <div className={styles.actionsGrid}>
                    <motion.button
                      className={styles.actionButton}
                      onClick={() => navigate('/create-pod')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Plus size={20} />
                      Create a Pod
                    </motion.button>
                    
                    <motion.button
                      className={styles.actionButton}
                      onClick={() => navigate('/explore')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Search size={20} />
                      Explore Pods
                    </motion.button>
                    
                    <motion.button
                      className={styles.actionButton}
                      onClick={() => navigate('/profile')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Users size={20} />
                      Join Community
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Lifecycle View - Enhanced Interactive Journey */}
            {activeView === 'lifecycle' && (
              <div className={styles.lifecycleContent}>
                {/* Interactive Stage Navigation */}
                <div className={styles.stageNavigation}>
                  {ecosystemStages.map((stage, index) => (
                    <motion.button
                      key={stage.id}
                      className={`${styles.stageButton} ${activeStage === stage.id ? styles.active : ''}`}
                      onClick={() => {
                        setActiveStage(stage.id);
                        setCurrentAnimation(index);
                      }}
                      variants={itemVariants}
                      whileHover={{ y: -3 }}
                      style={{ '--stage-color': stage.color }}
                    >
                      <div className={styles.stageIconContainer}>
                        {stage.icon}
                        <motion.div 
                          className={styles.stageIconGlow}
                          animate={activeStage === stage.id ? { 
                            scale: [1, 1.2, 1], 
                            opacity: [0.3, 0.6, 0.3] 
                          } : {}}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </div>
                      <span className={styles.stageTitle}>{stage.shortTitle}</span>
                      <div className={styles.stageProgress}>
                        <div className={styles.progressRing}>
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
                              stroke={stage.color}
                              strokeWidth="2"
                              strokeDasharray={`${stage.successRate}, 100`}
                              initial={{ strokeDasharray: "0, 100" }}
                              animate={{ strokeDasharray: `${stage.successRate}, 100` }}
                              transition={{ duration: 1, delay: index * 0.2 }}
                            />
                          </svg>
                          <span>{stage.successRate}%</span>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Enhanced Stage Detail */}
                <motion.div 
                  className={styles.stageDetailCard}
                  key={activeStage}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  style={{ '--stage-color': currentStage.color }}
                >
                  <div className={styles.stageDetailHeader}>
                    <div className={styles.stageIconLarge}>
                      {currentStage.icon}
                    </div>
                    <div className={styles.stageInfo}>
                      <h2>{currentStage.title}</h2>
                      <p>{currentStage.description}</p>
                      <div className={styles.stageMeta}>
                        <span><Clock size={16} /> {currentStage.duration}</span>
                        <span><Target size={16} /> {currentStage.difficulty}</span>
                        <span><TrendingUp size={16} /> {currentStage.successRate}% Success</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.stageDetailBody}>
                    <div className={styles.detailSection}>
                      <h3>Key Activities</h3>
                      <ul className={styles.activityList}>
                        {currentStage.bullets.map((bullet, index) => (
                          <motion.li 
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <CheckCircle size={16} />
                            {bullet}
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    <div className={styles.detailSection}>
                      <h3>Current Statistics</h3>
                      <div className={styles.statsGrid}>
                        <div className={styles.statItem}>
                          <span className={styles.statValue}>{currentStage.stats.active}</span>
                          <span className={styles.statLabel}>Active</span>
                        </div>
                        <div className={styles.statItem}>
                          <span className={styles.statValue}>{currentStage.stats.completed}</span>
                          <span className={styles.statLabel}>Completed</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.stageDetailFooter}>
                    <motion.button 
                      className={styles.actionButton}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Eye size={16} />
                      View {currentStage.title} Pods
                    </motion.button>
                    
                    {currentStage.nextStage && (
                      <motion.button 
                        className={styles.nextButton}
                        onClick={() => setActiveStage(currentStage.nextStage)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Next Stage
                        <ArrowRight size={16} />
                     </motion.button>
                   )}
                 </div>
               </motion.div>

               {/* Interactive Flow Visualization */}
               <motion.div 
                 className={styles.flowVisualization}
                 variants={itemVariants}
               >
                 <div className={styles.flowContainer}>
                   <svg className={styles.flowPath} viewBox="0 0 1000 200">
                     <defs>
                       <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                         {ecosystemStages.map((stage, index) => (
                           <stop 
                             key={stage.id}
                             offset={`${(index / (ecosystemStages.length - 1)) * 100}%`} 
                             stopColor={stage.color} 
                           />
                         ))}
                       </linearGradient>
                     </defs>
                     
                     <motion.path
                       d="M50 100 Q250 50 450 100 T950 100"
                       stroke="url(#flowGradient)"
                       strokeWidth="4"
                       fill="none"
                       initial={{ pathLength: 0 }}
                       animate={{ pathLength: 1 }}
                       transition={{ duration: 2, ease: "easeInOut" }}
                     />
                     
                     {ecosystemStages.map((stage, index) => (
                       <motion.circle
                         key={stage.id}
                         cx={50 + (index * 225)}
                         cy={100}
                         r="8"
                         fill={stage.color}
                         className={styles.flowNode}
                         initial={{ scale: 0 }}
                         animate={{ scale: activeStage === stage.id ? 1.5 : 1 }}
                         transition={{ delay: index * 0.2 }}
                         onClick={() => setActiveStage(stage.id)}
                       />
                     ))}
                   </svg>
                 </div>
               </motion.div>
             </div>
           )}

           {/* Roles View - Enhanced Interactive Profiles */}
           {activeView === 'roles' && (
             <div className={styles.rolesContent}>
               {/* Role Filter */}
               <div className={styles.roleFilters}>
                 <div className={styles.filterTabs}>
                   {userRoles.map((role) => (
                     <motion.button
                       key={role.id}
                       className={`${styles.filterTab} ${activeRole === role.id ? styles.active : ''}`}
                       onClick={() => setActiveRole(role.id)}
                       whileHover={{ y: -2 }}
                       style={{ '--role-color': role.color }}
                     >
                       {role.icon}
                       <span>{role.shortTitle}</span>
                       <div className={styles.roleCount}>{role.stats.total}</div>
                     </motion.button>
                   ))}
                 </div>
               </div>

               {/* Enhanced Role Profile */}
               <motion.div 
                 className={styles.roleProfileCard}
                 key={activeRole}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 style={{ '--role-color': currentRole.color }}
               >
                 <div className={styles.roleProfileHeader}>
                   <div 
                     className={styles.roleAvatar}
                     style={{ background: currentRole.gradient }}
                   >
                     {currentRole.icon}
                   </div>
                   <div className={styles.roleInfo}>
                     <h2>{currentRole.title}</h2>
                     <p>{currentRole.detailedDescription}</p>
                   </div>
                 </div>

                 <div className={styles.roleProfileBody}>
                   <div className={styles.roleStats}>
                     <div className={styles.statCard}>
                       <h3>{currentRole.stats.total.toLocaleString()}</h3>
                       <p>Total Members</p>
                     </div>
                     <div className={styles.statCard}>
                       <h3>{currentRole.stats.active.toLocaleString()}</h3>
                       <p>Currently Active</p>
                     </div>
                     <div className={styles.statCard}>
                       <h3>{currentRole.stats.avgRating}</h3>
                       <p>Average Rating</p>
                     </div>
                   </div>

                   <div className={styles.roleDetails}>
                     <div className={styles.detailSection}>
                       <h3>Core Skills</h3>
                       <div className={styles.skillTags}>
                         {currentRole.skills.map((skill, index) => (
                           <motion.span
                             key={skill}
                             className={styles.skillTag}
                             initial={{ opacity: 0, scale: 0.8 }}
                             animate={{ opacity: 1, scale: 1 }}
                             transition={{ delay: index * 0.1 }}
                           >
                             {skill}
                           </motion.span>
                         ))}
                       </div>
                     </div>

                     <div className={styles.detailSection}>
                       <h3>Earning Potential</h3>
                       <div className={styles.earningsRange}>
                         <div className={styles.earningsStat}>
                           <span className={styles.earningsLabel}>Average</span>
                           <span className={styles.earningsValue}>{currentRole.earnings.avg}</span>
                         </div>
                         <div className={styles.earningsBar}>
                           <div 
                             className={styles.earningsProgress}
                             style={{ 
                               background: currentRole.gradient,
                               width: '65%'
                             }}
                           />
                         </div>
                         <div className={styles.earningsRange}>
                           <span>{currentRole.earnings.min}</span>
                           <span>{currentRole.earnings.max}</span>
                         </div>
                       </div>
                     </div>

                     <div className={styles.detailSection}>
                       <h3>Time Commitment</h3>
                       <div className={styles.commitmentInfo}>
                         <Clock size={20} />
                         <span>{currentRole.timeCommitment}</span>
                       </div>
                     </div>
                   </div>
                 </div>

                 <div className={styles.roleProfileFooter}>
                   <motion.button 
                     className={styles.primaryAction}
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                   >
                     Become a {currentRole.shortTitle}
                   </motion.button>
                   <motion.button 
                     className={styles.secondaryAction}
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                   >
                     View Success Stories
                   </motion.button>
                 </div>
               </motion.div>

               {/* Success Stories Preview */}
               <motion.div 
                 className={styles.successStories}
                 variants={itemVariants}
               >
                 <h3>Recent Success Stories</h3>
                 <div className={styles.storiesGrid}>
                   {[1, 2, 3].map((story, index) => (
                     <motion.div
                       key={story}
                       className={styles.storyCard}
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: index * 0.1 }}
                       whileHover={{ y: -5 }}
                     >
                       <div className={styles.storyHeader}>
                         <div className={styles.storyAvatar}>
                           <Users size={16} />
                         </div>
                         <div className={styles.storyInfo}>
                           <h4>Sarah Chen</h4>
                           <p>{currentRole.shortTitle}</p>
                         </div>
                       </div>
                       <p className={styles.storyText}>
                         "Joined 3 successful pods and earned $12K in 6 months while building amazing products."
                       </p>
                       <div className={styles.storyMeta}>
                         <span><Star size={14} /> 4.9 Rating</span>
                         <span><Award size={14} /> Top Performer</span>
                       </div>
                     </motion.div>
                   ))}
                 </div>
               </motion.div>
             </div>
           )}

           {/* Pod States View */}
           {activeView === 'states' && (
             <div className={styles.statesContent}>
               <div className={styles.statesGrid}>
                 {podStates.map((state, index) => (
                   <motion.div
                     key={state.id}
                     className={`${styles.stateCard} ${activeState === state.id ? styles.active : ''}`}
                     onClick={() => setActiveState(state.id)}
                     variants={cardVariants}
                     whileHover="hover"
                     initial="hidden"
                     animate="visible"
                     transition={{ delay: index * 0.1 }}
                     style={{ '--state-color': state.color }}
                   >
                     <div className={styles.stateHeader}>
                       <div 
                         className={styles.stateIndicator}
                         style={{ backgroundColor: state.color }}
                       />
                       <h3>{state.title}</h3>
                       <span className={styles.stateCount}>{state.count}</span>
                     </div>
                     
                     <p className={styles.stateDescription}>{state.description}</p>
                     
                     <div className={styles.stateMeta}>
                       <span>
                         <Clock size={14} />
                         {state.avgDuration}
                       </span>
                     </div>
                   </motion.div>
                 ))}
               </div>

               {/* State Flow Diagram */}
               <motion.div 
                 className={styles.stateFlow}
                 variants={itemVariants}
               >
                 <h3>State Transition Flow</h3>
                 <div className={styles.flowDiagram}>
                   {podStates.map((state, index) => (
                     <React.Fragment key={state.id}>
                       <motion.div
                         className={`${styles.flowState} ${activeState === state.id ? styles.active : ''}`}
                         onClick={() => setActiveState(state.id)}
                         whileHover={{ scale: 1.05 }}
                         style={{ '--state-color': state.color }}
                       >
                         <div className={styles.flowStateInner}>
                           <span>{state.title}</span>
                           <small>{state.count}</small>
                         </div>
                       </motion.div>
                       
                       {index < podStates.length - 1 && (
                         <div className={styles.flowArrow}>
                           <ArrowRight size={20} />
                         </div>
                       )}
                     </React.Fragment>
                   ))}
                 </div>
               </motion.div>
             </div>
           )}

           {/* Analytics View */}
           {activeView === 'analytics' && (
             <div className={styles.analyticsContent}>
               <div className={styles.analyticsGrid}>
                 {/* Key Metrics */}
                 <motion.div className={styles.analyticsCard} variants={cardVariants}>
                   <h3>Ecosystem Performance</h3>
                   <div className={styles.performanceChart}>
                     <div className={styles.chartContainer}>
                       {ecosystemStages.map((stage, index) => (
                         <div 
                           key={stage.id}
                           className={styles.chartBar}
                           style={{ 
                             height: `${stage.stats.completed / 15}px`,
                             backgroundColor: stage.color,
                             animationDelay: `${index * 0.1}s`
                           }}
                         />
                       ))}
                     </div>
                     <div className={styles.chartLabels}>
                       {ecosystemStages.map((stage) => (
                         <span key={stage.id}>{stage.shortTitle}</span>
                       ))}
                     </div>
                   </div>
                 </motion.div>

                 {/* Growth Trends */}
                 <motion.div className={styles.analyticsCard} variants={cardVariants}>
                   <h3>Growth Trends</h3>
                   <div className={styles.trendMetrics}>
                     <div className={styles.trendItem}>
                       <TrendingUp size={20} />
                       <div>
                         <span className={styles.trendValue}>+24%</span>
                         <span className={styles.trendLabel}>Monthly Growth</span>
                       </div>
                     </div>
                     <div className={styles.trendItem}>
                       <Users size={20} />
                       <div>
                         <span className={styles.trendValue}>+1,247</span>
                         <span className={styles.trendLabel}>New Users</span>
                       </div>
                     </div>
                     <div className={styles.trendItem}>
                       <DollarSign size={20} />
                       <div>
                         <span className={styles.trendValue}>+$127K</span>
                         <span className={styles.trendLabel}>Revenue Generated</span>
                       </div>
                     </div>
                   </div>
                 </motion.div>

                 {/* Success Rates */}
                 <motion.div className={styles.analyticsCard} variants={cardVariants}>
                   <h3>Success Rates by Stage</h3>
                   <div className={styles.successRates}>
                     {ecosystemStages.map((stage) => (
                       <div key={stage.id} className={styles.successRate}>
                         <div className={styles.rateInfo}>
                           <span>{stage.title}</span>
                           <span>{stage.successRate}%</span>
                         </div>
                         <div className={styles.rateBar}>
                           <motion.div
                             className={styles.rateProgress}
                             style={{ backgroundColor: stage.color }}
                             initial={{ width: 0 }}
                             animate={{ width: `${stage.successRate}%` }}
                             transition={{ duration: 1, delay: 0.2 }}
                           />
                         </div>
                       </div>
                     ))}
                   </div>
                 </motion.div>
               </div>

               {/* Detailed Analytics */}
               <motion.div className={styles.detailedAnalytics} variants={itemVariants}>
                 <h3>Ecosystem Insights</h3>
                 <div className={styles.insightsGrid}>
                   <div className={styles.insightCard}>
                     <Shield size={24} />
                     <h4>Quality Score</h4>
                     <span className={styles.insightValue}>94.2%</span>
                     <p>Projects meet quality standards</p>
                   </div>
                   
                   <div className={styles.insightCard}>
                     <Clock size={24} />
                     <h4>Avg. Completion</h4>
                     <span className={styles.insightValue}>6.8 weeks</span>
                     <p>From creation to launch</p>
                   </div>
                   
                   <div className={styles.insightCard}>
                     <Star size={24} />
                     <h4>Satisfaction</h4>
                     <span className={styles.insightValue}>4.7/5</span>
                     <p>Average user rating</p>
                   </div>
                 </div>
               </motion.div>
             </div>
           )}
         </motion.div>
       </AnimatePresence>

       {/* Call-to-Action Section */}
       <motion.div 
         className={styles.ctaSection}
         variants={itemVariants}
         initial="hidden"
         animate="visible"
       >
         <div className={styles.ctaContent}>
           <h2>Ready to Join the Ecosystem?</h2>
           <p>Start your collaborative journey and transform your ideas into successful products</p>
           
           <div className={styles.ctaButtons}>
             <motion.button
               className={styles.primaryCta}
               onClick={() => navigate('/create-pod')}
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
             >
               <Plus size={20} />
               Create Your First Pod
             </motion.button>
             
             <motion.button
               className={styles.secondaryCta}
               onClick={() => navigate('/explore')}
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
             >
               <Search size={20} />
               Explore Opportunities
             </motion.button>
           </div>
         </div>
       </motion.div>

       {/* Help & Resources */}
       <motion.div 
         className={styles.helpSection}
         variants={itemVariants}
       >
         <div className={styles.helpGrid}>
           <div className={styles.helpCard}>
             <HelpCircle size={24} />
             <div className={styles.helpContent}>
               <h3>Getting Started Guide</h3>
               <p>Learn the fundamentals of the PODNEX ecosystem</p>
               <button className={styles.helpButton}>
                 Read Guide <ArrowRight size={16} />
               </button>
             </div>
           </div>
           
           <div className={styles.helpCard}>
             <MessageSquare size={24} />
             <div className={styles.helpContent}>
               <h3>Community Support</h3>
               <p>Get help from experienced community members</p>
               <button className={styles.helpButton}>
                 Join Discord <ArrowRight size={16} />
               </button>
             </div>
           </div>
           
           <div className={styles.helpCard}>
             <BarChart2 size={24} />
             <div className={styles.helpContent}>
               <h3>Success Stories</h3>
               <p>Learn from successful pod creators and contributors</p>
               <button className={styles.helpButton}>
                 View Stories <ArrowRight size={16} />
               </button>
             </div>
           </div>
         </div>
       </motion.div>
     </div>
   </div>
 );
};

export default EcosystemPage;