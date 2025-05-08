import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence, useAnimation, useInView } from 'framer-motion';
import axios from 'axios';
import { 
  ArrowLeft, 
  Star, 
  Share2, 
  Clock, 
  Users, 
  Target, 
  Layers, 
  DollarSign, 
  Calendar, 
  Activity, 
  Briefcase, 
  Heart,
  MessageSquare,
  BarChart3,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Zap,
  Code,
  Paintbrush,
  PenTool,
  Megaphone,
  Video,
  Monitor,
  Globe,
  Shield,
  Award,
  Bookmark,
  Edit3,
  Send,
  ChevronRight,
  Sparkles,
  Info,
  X
} from 'lucide-react';
import styles from './PodDetailPage.module.scss';

const PodDetailPage = () => {
  const { id } = useParams();
  const sectionRef = useRef(null);
  
  // Data safety util
  const safelyAccessData = (obj, path, fallback = null) => {
    try {
      return path.split('.').reduce((acc, part) => 
        acc && acc[part] !== undefined ? acc[part] : undefined, obj) || fallback;
    } catch (e) {
      return fallback;
    }
  };
  
  const [pod, setPod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [experience, setExperience] = useState('');
  const [motivation, setMotivation] = useState('');
  const [portfolioLink, setPortfolioLink] = useState('');
  const [submissionStatus, setSubmissionStatus] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeRoleHover, setActiveRoleHover] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  
  const controls = useAnimation();
  const isInView = useInView(sectionRef, { once: false, threshold: 0.2 });

  // Enhanced animation variants
  const pageVariants = {
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
      transition: {
        duration: 0.5,
        ease: [0.175, 0.885, 0.32, 1.075]
      }
    }
  };

  // Role icons mapping
  const roleIcons = {
    'Developer': <Code size={20} />,
    'Designer': <Paintbrush size={20} />,
    'Content Writer': <PenTool size={20} />,
    'Marketing Specialist': <Megaphone size={20} />,
    'Video Editor': <Video size={20} />,
    'Host': <Users size={20} />,
    'Producer': <Target size={20} />,
    'Audio Engineer': <Activity size={20} />,
    'Project Manager': <Briefcase size={20} />,
    'UX Researcher': <Monitor size={20} />,
    'Product Manager': <Layers size={20} />,
    'Community Manager': <Heart size={20} />
  };

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

  // Animation control
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  useEffect(() => {
    const fetchPod = async () => {
      try {
        // Simulating a slight delay for loading animation
        setTimeout(async () => {
          const res = await axios.get(`http://localhost:5000/api/pods/${id}`);
          
          // Enhance pod data with additional properties for better display
          const enhancedPod = {
            ...res.data,
            // Add mock properties if they don't exist
            budget: res.data.budget || Math.floor(Math.random() * 50000) + 10000,
            commitment: res.data.commitment || 'Part-time',
            urgency: res.data.urgency || 'high',
            progress: res.data.progress || Math.floor(Math.random() * 70) + 20,
            deadline: res.data.deadline || (() => {
              const date = new Date();
              date.setDate(date.getDate() + Math.floor(Math.random() * 30) + 10);
              return date.toISOString();
            })(),
            teamSize: res.data.members || Math.floor(Math.random() * 8) + 2,
            skills: res.data.skills || ['React', 'UI/UX', 'Marketing', 'Content Creation'],
            updates: res.data.updates || [
              {
                date: new Date().toISOString(),
                title: 'Development Started',
                description: 'We have begun initial development and planning phases.'
              },
              {
                date: new Date(Date.now() - 86400000 * 3).toISOString(),
                title: 'Team Formation',
                description: 'Core team members have been selected and onboarded.'
              }
            ],
            milestones: res.data.milestones || [
              { title: 'Project Kickoff', completed: true, date: new Date(Date.now() - 86400000 * 10).toISOString() },
              { title: 'Design Phase', completed: true, date: new Date(Date.now() - 86400000 * 5).toISOString() },
              { title: 'Development Sprint 1', completed: false, date: new Date(Date.now() + 86400000 * 5).toISOString() },
              { title: 'Beta Launch', completed: false, date: new Date(Date.now() + 86400000 * 20).toISOString() }
            ]
          };
          
          setPod(enhancedPod);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error(err.response?.data?.message || err.message);
        setError('Failed to load pod details. Please try again.');
        setLoading(false);
      }
    };
    
    fetchPod();
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [id]);

  // Toggle bookmark status
  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Here you would typically make an API call to save this preference
  };

  // Share functionality
  const handleShare = () => {
    setShowShareModal(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    // You could add a success notification here
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User not logged in');
      }
  
      const res = await axios.post(
        'http://localhost:5000/api/applications',
        {
          podId: pod._id,
          roleApplied: selectedRole,
          experience,
          motivation,
          portfolioLink,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log(res.data);
      setSubmissionStatus('success');
      
      // Reset form
      setExperience('');
      setMotivation('');
      setPortfolioLink('');
  
      // Auto-close modal after 2 seconds
      setTimeout(() => {
        setApplyModalOpen(false);
        setSubmissionStatus('');
        setSelectedRole('');
      }, 2000);
  
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
      setSubmissionStatus('error');
    }
  };
  
  // Open apply modal with selected role
  const handleApplyClick = (role) => {
    // If role is an object, get the title, otherwise use the role string directly
    const roleTitle = typeof role === 'object' ? role.title : role;
    setSelectedRole(roleTitle);
    setApplyModalOpen(true);
  };
  
  // Close apply modal
  const closeApplyModal = () => {
    setApplyModalOpen(false);
    setSelectedRole('');
    setSubmissionStatus('');
  };

  // Format deadline
  const formatDeadline = (date) => {
    const deadline = new Date(date);
    const now = new Date();
    const diff = deadline - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days < 1) return 'Today';
    if (days === 1) return '1 day left';
    if (days < 7) return `${days} days left`;
    if (days < 30) return `${Math.floor(days / 7)} weeks left`;
    return `${Math.floor(days / 30)} months left`;
  };

  // Get urgency color
  const getUrgencyColor = (urgency) => {
    switch(urgency?.toLowerCase()) {
      case 'high': return '#FF4D4D';
      case 'medium': return '#FBBF24';
      case 'low': return '#34D399';
      default: return '#FFFFFF';
    }
  };

  // Get role color based on role type
  const getRoleColor = (role) => {
    const roleColors = {
      'Developer': '#3B82F6',
      'Designer': '#EC4899',
      'Content Writer': '#10B981',
      'Marketing Specialist': '#F59E0B',
      'Video Editor': '#8B5CF6',
      'Host': '#E8C547',
      'Producer': '#06B6D4',
      'Audio Engineer': '#6366F1',
      'Project Manager': '#EF4444',
      'UX Researcher': '#14B8A6',
      'Product Manager': '#F97316',
      'Community Manager': '#EC4899'
    };
    
    return roleColors[role] || '#E8C547'; // Default to gold if role not found
  };

  // Get status styling
  const getStatusStyling = (status) => {
    const statusLower = status?.toLowerCase() || '';
    switch(statusLower) {
      case 'open':
        return { 
          color: '#34D399', 
          backgroundColor: 'rgba(52, 211, 153, 0.1)', 
          borderColor: 'rgba(52, 211, 153, 0.3)' 
        };
      case 'in progress':
        return { 
          color: '#FBBF24', 
          backgroundColor: 'rgba(251, 191, 36, 0.1)', 
          borderColor: 'rgba(251, 191, 36, 0.3)' 
        };
      case 'live':
        return { 
          color: '#818CF8', 
          backgroundColor: 'rgba(129, 140, 248, 0.1)', 
          borderColor: 'rgba(129, 140, 248, 0.3)' 
        };
      case 'pre-launch':
        return { 
          color: '#E8C547', 
          backgroundColor: 'rgba(232, 197, 71, 0.1)', 
          borderColor: 'rgba(232, 197, 71, 0.3)' 
        };
      case 'draft':
      case 'archived':
        return { 
          color: '#999999', 
          backgroundColor: 'rgba(153, 153, 153, 0.1)', 
          borderColor: 'rgba(153, 153, 153, 0.3)' 
        };
      default:
        return { 
          color: '#FFFFFF', 
          backgroundColor: 'rgba(255, 255, 255, 0.1)', 
          borderColor: 'rgba(255, 255, 255, 0.3)' 
        };
    }
  };

  // Loading state with premium animation
  if (loading) {
    return (
      <div className={styles.podDetailPage}>
        <motion.div 
          className={styles.loadingState}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.loadingAnimation}>
            <motion.div 
              className={styles.loadingCircle}
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
            <motion.div 
              className={styles.loadingCircle}
              animate={{ rotate: -360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Loading pod details...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={styles.podDetailPage}>
        <motion.div 
          className={styles.errorState}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.errorIcon}>
            <AlertCircle size={48} />
          </div>
          <h3>Something went wrong</h3>
          <p>{error}</p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/explore" className={styles.backToExploreBtn}>
              <ArrowLeft size={18} />
              Back to Explore
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={styles.podDetailPage} ref={sectionRef}>
      {/* Animated background */}
      <motion.div 
        className={styles.gridBackground}
        style={{
          transform: `translate(${mousePosition.x * 15}px, ${mousePosition.y * 15}px)`,
        }}
      />
      
      {/* Floating shapes */}
      <motion.div
        className={`${styles.floatingShape} ${styles.shape1}`}
        animate={{
          x: [0, 20, 0],
          y: [0, -20, 0],
          rotate: [0, 8, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className={`${styles.floatingShape} ${styles.shape2}`}
        animate={{
          x: [0, -15, 0],
          y: [0, 15, 0],
          rotate: [0, -8, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div 
        className={styles.container}
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Enhanced Back navigation */}
        <motion.div 
          className={styles.backNavigation}
          variants={itemVariants}
        >
          <Link to="/explore" className={styles.backLink}>
            <ArrowLeft size={18} />
            <span>Back to Explore</span>
          </Link>
          
          <div className={styles.breadcrumbs}>
            <Link to="/">Home</Link>
            <ChevronRight size={14} />
            <Link to="/explore">Explore</Link>
            <ChevronRight size={14} />
            <span>{pod?.title}</span>
          </div>
        </motion.div>
        
        {/* Hero Section */}
        <motion.div 
          className={styles.heroSection}
          variants={itemVariants}
        >
          <div className={styles.heroBackground} />
          
          <div className={styles.heroContent}>
            <div className={styles.heroHeader}>
              <div className={styles.statusBadge} style={{
                '--bg-color': getStatusStyling(pod?.status).backgroundColor,
                '--border-color': getStatusStyling(pod?.status).borderColor,
                '--text-color': getStatusStyling(pod?.status).color
              }}>
                <motion.span 
                  className={styles.statusDot}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                {pod?.status || 'Status Unknown'}
              </div>
              
              <motion.h1 
                className={styles.podTitle}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {pod?.title}
              </motion.h1>
              
              <motion.div 
                className={styles.podMeta}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className={styles.metaItem}>
                  <div className={styles.creatorAvatar}>
                    {pod?.creator?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className={styles.creatorInfo}>
                    <span className={styles.creatorName}>{pod?.creator?.name}</span>
                    <span className={styles.creatorRole}>Pod Creator</span>
                  </div>
                </div>
                
                <div className={styles.divider} />
                
                <div className={styles.metaItem}>
                  <Calendar size={16} />
                  <span>{new Date(pod?.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}</span>
                </div>
                
                <div className={styles.divider} />
                
                <div className={styles.metaItem}>
                  <Users size={16} />
                  <span>{pod?.teamSize || pod?.members || 0} members</span>
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              className={styles.actionButtons}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button 
                className={`${styles.bookmarkBtn} ${isBookmarked ? styles.bookmarked : ''}`}
                onClick={toggleBookmark}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bookmark size={20} fill={isBookmarked ? "currentColor" : "none"} />
                <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
              </motion.button>
              
              <motion.button 
                className={styles.shareBtn}
                onClick={handleShare}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Share2 size={20} />
                <span>Share</span>
              </motion.button>
            </motion.div>
          </div>
          
          {/* Quick stats bar */}
          <div className={styles.quickStats}>
            <div className={styles.statItem}>
              <div className={styles.statIcon} style={{ backgroundColor: getUrgencyColor(pod?.urgency) + '20', color: getUrgencyColor(pod?.urgency) }}>
                <Clock size={20} />
              </div>
              <div className={styles.statContent}>
                <span className={styles.statLabel}>Deadline</span>
                <span className={styles.statValue}>{formatDeadline(pod?.deadline)}</span>
              </div>
            </div>
            
            <div className={styles.statItem}>
              <div className={styles.statIcon} style={{ backgroundColor: '#3B82F620', color: '#3B82F6' }}>
                <Activity size={20} />
              </div>
              <div className={styles.statContent}>
                <span className={styles.statLabel}>Progress</span>
                <span className={styles.statValue}>{pod?.progress}%</span>
              </div>
            </div>
            
            <div className={styles.statItem}>
              <div className={styles.statIcon} style={{ backgroundColor: '#10B98120', color: '#10B981' }}>
                <DollarSign size={20} />
              </div>
              <div className={styles.statContent}>
                <span className={styles.statLabel}>Budget</span>
                <span className={styles.statValue}>${((pod?.budget || 0) / 1000).toFixed(0)}k</span>
              </div>
            </div>
            
            <div className={styles.statItem}>
              <div className={styles.statIcon} style={{ backgroundColor: '#EC489920', color: '#EC4899' }}>
                <Briefcase size={20} />
              </div>
              <div className={styles.statContent}>
                <span className={styles.statLabel}>Commitment</span>
                <span className={styles.statValue}>{pod?.commitment}</span>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Enhanced Tab navigation */}
        <motion.div 
          className={styles.tabNavigation}
          variants={itemVariants}
        >
          {[
            { id: 'overview', label: 'Overview', icon: <Info size={18} /> },
            { id: 'roles', label: 'Roles Needed', icon: <Users size={18} /> },
            { id: 'roadmap', label: 'Roadmap', icon: <Target size={18} /> },
            { id: 'requirements', label: 'Requirements', icon: <CheckCircle size={18} /> },
            { id: 'updates', label: 'Updates', icon: <Activity size={18} /> }
          ].map((tab) => (
            <button 
              key={tab.id}
              className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div 
                  className={styles.activeIndicator} 
                  layoutId="activeTab"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </motion.div>
        
        {/* Content Area */}
        <motion.div 
          className={styles.contentArea}
          variants={itemVariants}
        >
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div 
                key="overview"
                className={styles.overviewSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className={styles.overviewGrid}>
                  <div className={styles.mainContent}>
                    <div className={styles.contentCard}>
                      <h2>
                        <Sparkles size={20} />
                        About this Pod
                      </h2>
                      <p>{pod?.description || 'No description provided.'}</p>
                    </div>
                    
                    <div className={styles.contentCard}>
                      <h2>
                        <Target size={20} />
                        Mission
                      </h2>
                      <p>{pod?.mission || 'Working together to create something amazing.'}</p>
                    </div>
                    
                    <div className={styles.skillsSection}>
                      <h3>Skills Required</h3>
                      <div className={styles.skillsGrid}>
                        {(pod?.skills || []).map((skill, index) => (
                          <motion.div 
                            key={index}
                            className={styles.skillTag}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                          >
                            <Zap size={14} />
                            {skill}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.sideContent}>
                    <div className={styles.detailsCard}>
                      <h3>Pod Details</h3>
                      
                      <div className={styles.detailItem}>
                        <div className={styles.detailIcon}>
                          <Calendar size={16} />
                        </div>
                        <div className={styles.detailInfo}>
                          <span className={styles.detailLabel}>Created</span>
                          <span className={styles.detailValue}>
                            {new Date(pod?.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className={styles.detailItem}>
                        <div className={styles.detailIcon}>
                          <Layers size={16} />
                        </div>
                        <div className={styles.detailInfo}>
                          <span className={styles.detailLabel}>Category</span>
                          <span className={styles.detailValue}>{pod?.category || 'General'}</span>
                        </div>
                      </div>
                      
                      <div className={styles.detailItem}>
                        <div className={styles.detailIcon}>
                          <Globe size={16} />
                        </div>
                        <div className={styles.detailInfo}>
                          <span className={styles.detailLabel}>Type</span>
                          <span className={styles.detailValue}>{pod?.format || 'Project'}</span>
                        </div>
                      </div>
                      
                      <div className={styles.detailItem}>
                        <div className={styles.detailIcon}>
                          <Clock size={16} />
                        </div>
                        <div className={styles.detailInfo}>
                          <span className={styles.detailLabel}>Duration</span>
                          <span className={styles.detailValue}>{pod?.duration || '3 months'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <motion.div 
                      className={styles.actionCard}
                      whileHover={{ y: -5 }}
                    >
                      <h3>Ready to join?</h3>
                      <p>Check out the available roles and apply to contribute to this pod.</p>
                      <motion.button
                        className={styles.viewRolesBtn}
                        onClick={() => setActiveTab('roles')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        View Roles
                        <ChevronRight size={18} />
                      </motion.button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {activeTab === 'roles' && (
  <motion.div 
    key="roles"
    className={styles.rolesSection}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    <div className={styles.sectionHeader}>
      <h2>Open Positions</h2>
      <p>Join our team and help bring this project to life</p>
    </div>
    
    {safelyAccessData(pod, 'rolesNeeded', []).length > 0 ? (
      <div className={styles.rolesGrid}>
        {safelyAccessData(pod, 'rolesNeeded', []).map((role, index) => {
          // Get the role title correctly depending on whether role is an object or string
          const roleTitle = typeof role === 'object' ? role.title : role;
          
          return (
            <motion.div 
              key={index}
              className={styles.roleCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onHoverStart={() => setActiveRoleHover(index)}
              onHoverEnd={() => setActiveRoleHover(null)}
              whileHover={{ y: -8 }}
              style={{
                '--role-color': getRoleColor(roleTitle)
              }}
            >
              <div className={styles.roleHeader}>
                <div className={styles.roleIcon}>
                  {roleIcons[roleTitle] || <Briefcase size={20} />}
                </div>
                <h3>{roleTitle}</h3>
              </div>
              
              <p className={styles.roleDescription}>
                {typeof role === 'object' && role.description ? 
                  role.description : 
                  `Join as a ${roleTitle.toLowerCase()} and contribute your expertise to this amazing project.`
                }
              </p>
              
              <div className={styles.roleRequirements}>
                <h4>Requirements:</h4>
                <ul>
                  {typeof role === 'object' && Array.isArray(role.requirements) && role.requirements.length > 0 ? 
                    role.requirements.map((req, reqIndex) => (
                      <li key={reqIndex}>{req}</li>
                    ))
                    : 
                    <>
                      <li>Experience in {roleTitle.toLowerCase()}</li>
                      <li>Strong collaboration skills</li>
                      <li>Ability to meet deadlines</li>
                    </>
                  }
                </ul>
              </div>
              
              <motion.button 
                className={styles.applyButton}
                onClick={() => handleApplyClick(role)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Zap size={16} />
                Apply Now
              </motion.button>
              
              {activeRoleHover === index && (
                <motion.div 
                  className={styles.roleGlow}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}
            </motion.div>
          );
        })}
      </div>
    ) : (
      <motion.div 
        className={styles.emptyState}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Users size={48} />
        <h3>No open positions</h3>
        <p>All roles have been filled for this pod. Check back later for new opportunities.</p>
      </motion.div>
    )}
  </motion.div>
)}
            
            {activeTab === 'roadmap' && (
              <motion.div 
                key="roadmap"
                className={styles.roadmapSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className={styles.sectionHeader}>
                  <h2>Project Roadmap</h2>
                  <p>Track our progress and upcoming milestones</p>
                </div>
                
                <div className={styles.progressOverview}>
                  <div className={styles.progressBar}>
                    <motion.div 
                      className={styles.progressFill}
                      initial={{ width: 0 }}
                      animate={{ width: `${pod?.progress}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                  <div className={styles.progressInfo}>
                    <span>{pod?.progress}% Complete</span>
                    <span>{formatDeadline(pod?.deadline)}</span>
                  </div>
                </div>
                
                <div className={styles.milestonesTimeline}>
                  {(pod?.milestones || []).map((milestone, index) => (
                    <motion.div 
                      key={index}
                      className={`${styles.milestoneItem} ${milestone.completed ? styles.completed : ''}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className={styles.milestoneDot}>
                        {milestone.completed ? <CheckCircle size={16} /> : <div className={styles.emptyDot} />}
                      </div>
                      
                      <div className={styles.milestoneContent}>
                        <h4>{milestone.title}</h4>
                        <p>{new Date(milestone.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}</p>
                        {milestone.description && <p>{milestone.description}</p>}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
            
            {activeTab === 'requirements' && (
              <motion.div 
                key="requirements"
                className={styles.requirementsSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className={styles.sectionHeader}>
                  <h2>Project Requirements</h2>
                  <p>What we're looking for in team members</p>
                </div>
                
                <div className={styles.requirementsGrid}>
                  <div className={styles.requirementCard}>
                    <div className={styles.requirementIcon}>
                      <Star size={24} />
                    </div>
                    <h3>Experience Level</h3>
                    <p>We're looking for intermediate to senior level contributors with proven track records in their respective fields.</p>
                  </div>
                  
                  <div className={styles.requirementCard}>
                    <div className={styles.requirementIcon}>
                      <Clock size={24} />
                    </div>
                    <h3>Time Commitment</h3>
                    <p>{pod?.commitment} commitment required. Approximately 10-20 hours per week depending on your role.</p>
                  </div>
                  
                  <div className={styles.requirementCard}>
                    <div className={styles.requirementIcon}>
                      <Globe size={24} />
                    </div>
                    <h3>Remote Collaboration</h3>
                    <p>This is a fully remote project. Team members should be comfortable with async communication and online collaboration tools.</p>
                  </div>
                  
                  <div className={styles.requirementCard}>
                    <div className={styles.requirementIcon}>
                      <Shield size={24} />
                    </div>
                    <h3>Professional Standards</h3>
                    <p>We maintain high standards of professionalism, ethics, and quality in all our work.</p>
                  </div>
                </div>
                
                <div className={styles.applicationProcess}>
                  <h3>Application Process</h3>
                  <div className={styles.processSteps}>
                    <div className={styles.processStep}>
                      <div className={styles.stepNumber}>1</div>
                      <h4>Submit Application</h4>
                      <p>Apply for your desired role with your experience and portfolio</p>
                    </div>
                    <div className={styles.processStep}>
                      <div className={styles.stepNumber}>2</div>
                      <h4>Initial Review</h4>
                      <p>We'll review your application within 2-3 business days</p>
                    </div>
                    <div className={styles.processStep}>
                      <div className={styles.stepNumber}>3</div>
                      <h4>Interview</h4>
                      <p>Selected candidates will have a brief interview call</p>
                    </div>
                    <div className={styles.processStep}>
                      <div className={styles.stepNumber}>4</div>
                      <h4>Onboarding</h4>
                      <p>Welcome to the team! Get set up and start contributing</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {activeTab === 'updates' && (
              <motion.div 
                key="updates"
                className={styles.updatesSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className={styles.sectionHeader}>
                  <h2>Latest Updates</h2>
                  <p>Stay informed about our progress</p>
                </div>
                
                {(pod?.updates || []).length > 0 ? (
                  <div className={styles.updatesTimeline}>
                    {pod.updates.map((update, index) => (
                      <motion.div 
                        key={index}
                        className={styles.updateItem}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className={styles.updateDot}>
                          <Activity size={16} />
                        </div>
                        
                        <div className={styles.updateContent}>
                          <div className={styles.updateHeader}>
                            <h3>{update.title}</h3>
                            <span className={styles.updateDate}>
                              {new Date(update.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                          <p>{update.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div 
                    className={styles.emptyState}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Activity size={48} />
                    <h3>No updates yet</h3>
                    <p>Updates will appear here as the project progresses.</p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
      
      {/* Enhanced Apply Modal */}
      <AnimatePresence>
        {applyModalOpen && (
          <motion.div 
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeApplyModal}
          >
            <motion.div 
              className={styles.applyModal}
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              {submissionStatus === 'success' && (
                <motion.div 
                  className={styles.successMessage}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <CheckCircle size={48} />
                  <h3>Application Submitted!</h3>
                  <p>Thank you for applying. We'll review your application and get back to you soon.</p>
                </motion.div>
              )}

              {submissionStatus === 'error' && (
                <motion.div 
                  className={styles.errorMessage}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <AlertCircle size={48} />
                  <h3>Submission Failed</h3>
                  <p>There was an error submitting your application. Please try again.</p>
                </motion.div>
              )}

              {!submissionStatus && (
                <>
                  <div className={styles.modalHeader}>
                    <h2>Apply for {selectedRole}</h2>
                    <button className={styles.closeButton} onClick={closeApplyModal}>
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className={styles.modalContent}>
                    <form className={styles.applyForm} onSubmit={handleApplicationSubmit}>
                      <div className={styles.formField}>
                        <label htmlFor="experience">
                          <Briefcase size={16} />
                          Your experience as a {selectedRole}
                        </label>
                        <textarea 
                          id="experience" 
                          placeholder="Tell us about your relevant experience..."
                          rows="4"
                          value={experience}
                          onChange={(e) => setExperience(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className={styles.formField}>
                        <label htmlFor="motivation">
                          <Heart size={16} />
                          Why are you interested in this pod?
                        </label>
                        <textarea 
                          id="motivation" 
                          placeholder="Share why you're excited about this project..."
                          rows="3"
                          value={motivation}
                          onChange={(e) => setMotivation(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className={styles.formField}>
                        <label htmlFor="portfolio">
                          <Globe size={16} />
                          Portfolio link (optional)
                        </label>
                        <input 
                          type="url" 
                          id="portfolio" 
                          placeholder="https://your-portfolio.com"
                          value={portfolioLink}
                          onChange={(e) => setPortfolioLink(e.target.value)}
                        />
                      </div>
                      
                      <div className={styles.formActions}>
                        <motion.button 
                          type="button" 
                          className={styles.cancelButton}
                          onClick={closeApplyModal}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Cancel
                        </motion.button>
                        <motion.button 
                          type="submit" 
                          className={styles.submitButton}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Send size={16} />
                          Submit Application
                        </motion.button>
                      </div>
                    </form>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div 
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowShareModal(false)}
          >
            <motion.div 
              className={styles.shareModal}
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <h2>Share this Pod</h2>
                <button className={styles.closeButton} onClick={() => setShowShareModal(false)}>
                  <X size={20} />
                </button>
              </div>
              
              <div className={styles.shareContent}>
                <div className={styles.shareOptions}>
                  <motion.button 
                    className={styles.shareOption}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={copyToClipboard}
                  >
                    <Globe size={24} />
                    <span>Copy Link</span>
                  </motion.button>
                  
                  <motion.button 
                    className={styles.shareOption}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <MessageSquare size={24} />
                    <span>Share to Twitter</span>
                  </motion.button>
                  
                  <motion.button 
                    className={styles.shareOption}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Users size={24} />
                    <span>Share to LinkedIn</span>
                  </motion.button>
                </div>
                
                <div className={styles.shareLink}>
                  <input 
                    type="text" 
                    value={window.location.href} 
                    readOnly 
                  />
                  <motion.button
                    onClick={copyToClipboard}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Copy
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PodDetailPage;