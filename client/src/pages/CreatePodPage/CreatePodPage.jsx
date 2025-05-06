import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import axios from 'axios';
import { 
  ArrowRight, 
  Plus, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Sparkles, 
  Layers, 
  Target, 
  Clock, 
  Users, 
  DollarSign, 
  Briefcase, 
  Calendar, 
  Star,
  Zap,
  Code,
  Paintbrush,
  PenTool,
  Megaphone,
  Video,
  Monitor,
  Globe,
  Activity,
  TrendingUp,
  ChevronRight,
  ChevronDown,
  Upload,
  Edit3,
  Eye,
  Save,
  Settings,
  Image,
  Layout,
  Tag,
  RefreshCw,
  Shield,
  Award,
  Filter,
  Sliders,
  Box,
  CheckSquare,
  Info,
  HelpCircle,
  Grid,
  BarChart2,
  Mic,
  Camera,
  Database,
  Folder,
  ArrowLeft,
  User,
  MessageSquare
} from 'lucide-react';
import styles from './CreatePodPage.module.scss';

const CreatePodPage = () => {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const controls = useAnimation();
  
  // Base form state
  const [currentStep, setCurrentStep] = useState(1);
  const [previewMode, setPreviewMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [validationErrors, setValidationErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Pod form data state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mission: '',
    category: '',
    format: '',
    status: 'draft',
    urgency: 'medium',
    budget: '',
    commitment: 'part-time',
    duration: '',
    deadline: '',
    rolesNeeded: [],
    skills: [],
    milestones: [],
    requirements: [],
    tags: [],
    visibility: 'public',
    timezone: '',
    communication: [],
    tools: [],
    maxMembers: 8,
    applicationQuestions: []
  });

  // UI state
  const [activeTab, setActiveTab] = useState('basic');
  const [currentRole, setCurrentRole] = useState({
    title: '',
    description: '',
    requirements: [],
    compensation: '',
    timeCommitment: ''
  });
  const [currentSkill, setCurrentSkill] = useState('');
  const [currentMilestone, setCurrentMilestone] = useState({
    title: '',
    description: '',
    deadline: '',
    deliverables: []
  });
  const [currentRequirement, setCurrentRequirement] = useState('');
  const [currentTag, setCurrentTag] = useState('');
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState('');

  // Category and format options
  const categories = [
    { id: 'development', name: 'Development', icon: <Code size={16} /> },
    { id: 'design', name: 'Design', icon: <Paintbrush size={16} /> },
    { id: 'marketing', name: 'Marketing', icon: <Megaphone size={16} /> },
    { id: 'content', name: 'Content', icon: <PenTool size={16} /> },
    { id: 'video', name: 'Video Production', icon: <Video size={16} /> },
    { id: 'research', name: 'Research', icon: <Database size={16} /> },
    { id: 'product', name: 'Product', icon: <Box size={16} /> },
    { id: 'community', name: 'Community', icon: <Users size={16} /> }
  ];

  const formats = [
    { id: 'project', name: 'Project', description: 'One-time deliverable' },
    { id: 'ongoing', name: 'Ongoing', description: 'Continuous collaboration' },
    { id: 'event', name: 'Event', description: 'Time-bound engagement' },
    { id: 'mentorship', name: 'Mentorship', description: 'Knowledge sharing' }
  ];

  // Role templates
  const roleTemplates = {
    'UI Designer': {
      description: 'Design user interfaces and create visual assets',
      requirements: ['Figma expertise', 'Strong portfolio', 'Eye for aesthetics'],
      compensation: 'Equity/Revenue share',
      timeCommitment: '15-20 hours/week'
    },
    'React Developer': {
      description: 'Build frontend components and features',
      requirements: ['React.js expert', 'TypeScript', 'API integration'],
      compensation: 'Hourly rate',
      timeCommitment: '20-30 hours/week'
    },
    'Content Writer': {
      description: 'Create engaging content and copy',
      requirements: ['SEO knowledge', 'Editorial experience', 'Creative writing'],
      compensation: 'Per article',
      timeCommitment: '10-15 hours/week'
    }
  };

  // Skill suggestions
  const skillSuggestions = [
    'React', 'Node.js', 'UI/UX', 'Figma', 'TypeScript', 'Marketing', 
    'Content Strategy', 'Video Editing', 'Data Analysis', 'Project Management',
    'Brand Strategy', 'SEO', 'Social Media', 'DevOps', 'Mobile Development'
  ];

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

  // Form change handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear validation error when user types
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Role management
  const handleAddRole = () => {
    if (currentRole.title && currentRole.description) {
      setFormData(prev => ({
        ...prev,
        rolesNeeded: [...prev.rolesNeeded, currentRole]
      }));
      setCurrentRole({
        title: '',
        description: '',
        requirements: [],
        compensation: '',
        timeCommitment: ''
      });
    }
  };

  const handleRemoveRole = (index) => {
    setFormData(prev => ({
      ...prev,
      rolesNeeded: prev.rolesNeeded.filter((_, i) => i !== index)
    }));
  };

  // Skill management
  const handleAddSkill = () => {
    if (currentSkill && !formData.skills.includes(currentSkill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, currentSkill]
      }));
      setCurrentSkill('');
    }
  };

  const handleRemoveSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  // Milestone management
  const handleAddMilestone = () => {
    if (currentMilestone.title && currentMilestone.deadline) {
      setFormData(prev => ({
        ...prev,
        milestones: [...prev.milestones, currentMilestone]
      }));
      setCurrentMilestone({
        title: '',
        description: '',
        deadline: '',
        deliverables: []
      });
    }
  };

  const handleRemoveMilestone = (index) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index)
    }));
  };

  // Requirement management
  const handleAddRequirement = () => {
    if (currentRequirement) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, currentRequirement]
      }));
      setCurrentRequirement('');
    }
  };

  const handleRemoveRequirement = (index) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  // Tag management
  const handleAddTag = () => {
    if (currentTag && !formData.tags.includes(currentTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag]
      }));
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  // Validation
  const validateForm = () => {
    const errors = {};
    
    if (!formData.title) errors.title = 'Title is required';
    if (!formData.description) errors.description = 'Description is required';
    if (!formData.category) errors.category = 'Category is required';
    if (!formData.format) errors.format = 'Format is required';
    if (formData.rolesNeeded.length === 0) errors.rolesNeeded = 'At least one role is required';
    if (!formData.deadline) errors.deadline = 'Deadline is required';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setActiveTab('basic');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };
      
      const res = await axios.post('http://localhost:5000/api/pods', formData, config);
      
      setShowSuccessModal(true);
      
      setTimeout(() => {
        navigate(`/pods/${res.data._id}`);
      }, 2000);
      
    } catch (error) {
      console.error("Full error object:", error);
      console.error("Response data:", error.response?.data);
      console.error("Status code:", error.response?.status);
      // Display error to user
      setValidationErrors(prev => ({
        ...prev,
        server: error.response?.data?.message || "Server error, please try again"
      }));
      setIsSubmitting(false);
    }
  };

  // Animation variants
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

  // Tab configuration
  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: <Info size={18} /> },
    { id: 'roles', label: 'Roles', icon: <Users size={18} /> },
    { id: 'details', label: 'Details', icon: <Layers size={18} /> },
    { id: 'milestones', label: 'Milestones', icon: <Target size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> }
  ];

  // Progress calculation
  const calculateProgress = () => {
    const requiredFields = ['title', 'description', 'category', 'format', 'deadline'];
    const filledFields = requiredFields.filter(field => formData[field]);
    const baseProgress = (filledFields.length / requiredFields.length) * 50;
    
    const hasRoles = formData.rolesNeeded.length > 0 ? 25 : 0;
    const hasExtras = (formData.skills.length > 0 || formData.milestones.length > 0) ? 25 : 0;
    
    return Math.round(baseProgress + hasRoles + hasExtras);
  };

  return (
    <div className={styles.createPodPage}>
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
          x: [0, 30, 0],
          y: [0, -30, 0],
          rotate: [0, 10, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className={`${styles.floatingShape} ${styles.shape2}`}
        animate={{
          x: [0, -20, 0],
          y: [0, 20, 0],
          rotate: [0, -10, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div 
        className={styles.container}
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.div 
          className={styles.headerSection}
          variants={itemVariants}
        >
          <div className={styles.breadcrumbs}>
            <span onClick={() => navigate('/')}>Home</span>
            <ChevronRight size={16} />
            <span onClick={() => navigate('/explore')}>Explore</span>
            <ChevronRight size={16} />
            <span className={styles.current}>Create Pod</span>
          </div>

          <motion.div className={styles.titleSection}>
            <div className={styles.iconWrapper}>
              <Sparkles size={36} />
              <motion.div 
                className={styles.iconGlow}
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            
            <h1>Launch Your Pod</h1>
            <p>Create a collaborative space and bring your vision to life</p>
          </motion.div>

          {/* Progress bar */}
          <div className={styles.progressSection}>
            <div className={styles.progressHeader}>
              <span>Completion</span>
              <span>{calculateProgress()}%</span>
            </div>
            <div className={styles.progressBar}>
              <motion.div 
                className={styles.progressFill}
                initial={{ width: 0 }}
                animate={{ width: `${calculateProgress()}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.div>

        {/* Main content area */}
        <div className={styles.contentArea}>
          {!previewMode ? (
            <motion.div 
              className={styles.formSection}
              variants={itemVariants}
            >
              {/* Tab navigation */}
              <div className={styles.tabNavigation}>
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
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
                  </motion.button>
                ))}
              </div>

              {/* Form content */}
              <form onSubmit={handleSubmit} ref={formRef}>
                <AnimatePresence mode="wait">
                  {activeTab === 'basic' && (
                    <motion.div
                      key="basic"
                      className={styles.tabContent}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Title field */}
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>
                          <Star size={16} />
                          Pod Title
                          <span className={styles.required}>*</span>
                        </label>
                        <div className={styles.inputWrapper}>
                          <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Enter a compelling title for your pod"
                            className={`${styles.formInput} ${validationErrors.title ? styles.error : ''}`}
                            maxLength={100}
                          />
                          <span className={styles.charCount}>{formData.title.length}/100</span>
                        </div>
                        {validationErrors.title && (
                          <span className={styles.errorMessage}>{validationErrors.title}</span>
                        )}
                      </div>

                      {/* Description field */}
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>
                          <Edit3 size={16} />
                          Description
                          <span className={styles.required}>*</span>
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Describe your pod in detail. What makes it unique?"
                          className={`${styles.formTextarea} ${validationErrors.description ? styles.error : ''}`}
                          rows={5}
                          maxLength={1000}
                        />
                        <span className={styles.charCount}>{formData.description.length}/1000</span>
                        {validationErrors.description && (
                          <span className={styles.errorMessage}>{validationErrors.description}</span>
                        )}
                      </div>

                      {/* Category selection */}
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>
                          <Grid size={16} />
                          Category
                          <span className={styles.required}>*</span>
                        </label>
                        <div className={styles.categoryGrid}>
                          {categories.map((category) => (
                            <motion.div
                              key={category.id}
                              className={`${styles.categoryCard} ${formData.category === category.id ? styles.selected : ''}`}
                              onClick={() => setFormData(prev => ({ ...prev, category: category.id }))}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className={styles.categoryIcon}>
                                {category.icon}
                              </div>
                              <span>{category.name}</span>
                              {formData.category === category.id && (
                                <motion.div 
                                  className={styles.selectedIndicator}
                                  layoutId="selectedCategory"
                                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                              )}
                            </motion.div>
                          ))}
                        </div>
                        {validationErrors.category && (
                          <span className={styles.errorMessage}>{validationErrors.category}</span>
                        )}
                      </div>

                      {/* Format selection */}
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>
                          <Layout size={16} />
                          Pod Format
                          <span className={styles.required}>*</span>
                        </label>
                        <div className={styles.formatGrid}>
                          {formats.map((format) => (
                            <motion.div
                              key={format.id}
                              className={`${styles.formatCard} ${formData.format === format.id ? styles.selected : ''}`}
                              onClick={() => setFormData(prev => ({ ...prev, format: format.id }))}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <h4>{format.name}</h4>
                              <p>{format.description}</p>
                              {formData.format === format.id && (
                                <CheckCircle className={styles.checkIcon} size={20} />
                              )}
                            </motion.div>
                          ))}
                        </div>
                        {validationErrors.format && (
                          <span className={styles.errorMessage}>{validationErrors.format}</span>
                        )}
                      </div>

                      {/* Mission field */}
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>
                          <Target size={16} />
                          Mission Statement
                        </label>
                        <textarea
                          name="mission"
                          value={formData.mission}
                          onChange={handleInputChange}
                          placeholder="What's the ultimate goal of this pod?"
                          className={styles.formTextarea}
                          rows={3}
                        />
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'roles' && (
                    <motion.div
                      key="roles"
                      className={styles.tabContent}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Role templates quick start */}
                      <div className={styles.quickTemplates}>
                        <h3>Quick Start Templates</h3>
                        <div className={styles.templateGrid}>
                          {Object.entries(roleTemplates).map(([title, template]) => (
                            <motion.div
                              key={title}
                              className={styles.templateCard}
                              onClick={() => setCurrentRole({ title, ...template })}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <h4>{title}</h4>
                              <p>{template.description}</p>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Add role form */}
                      <div className={styles.roleForm}>
                        <h3>Define a Role</h3>
                        
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Role Title</label>
                          <input
                            type="text"
                            value={currentRole.title}
                            onChange={(e) => setCurrentRole(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="e.g., Frontend Developer"
                            className={styles.formInput}
                          />
                        </div>

                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Role Description</label>
                          <textarea
                            value={currentRole.description}
                            onChange={(e) => setCurrentRole(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Describe the responsibilities and expectations"
                            className={styles.formTextarea}
                            rows={3}
                          />
                        </div>

                        <div className={styles.formRow}>
                          <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Compensation</label>
                            <select
                              value={currentRole.compensation}
                              onChange={(e) => setCurrentRole(prev => ({ ...prev, compensation: e.target.value }))}
                              className={styles.formSelect}
                            >
                              <option value="">Select compensation type</option>
                              <option value="hourly">Hourly Rate</option>
                              <option value="fixed">Fixed Price</option>
                              <option value="equity">Equity/Revenue Share</option>
                              <option value="volunteer">Volunteer</option>
                            </select>
                          </div>

                          <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Time Commitment</label>
                            <input
                              type="text"
                              value={currentRole.timeCommitment}
                              onChange={(e) => setCurrentRole(prev => ({ ...prev, timeCommitment: e.target.value }))}
                              placeholder="e.g., 20 hours/week"
                              className={styles.formInput}
                            />
                          </div>
                        </div>

                        <motion.button
                          type="button"
                          className={styles.addButton}
                          onClick={handleAddRole}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Plus size={18} />
                          Add Role
                        </motion.button>
                      </div>

                      {/* Roles list */}
                      <div className={styles.rolesList}>
                        <h3>Roles Added ({formData.rolesNeeded.length})</h3>
                        {formData.rolesNeeded.length === 0 ? (
                          <div className={styles.emptyState}>
                            <Users size={32} />
                            <p>No roles added yet. Add at least one role to continue.</p>
                          </div>
                        ) : (
                          <div className={styles.rolesGrid}>
                            {formData.rolesNeeded.map((role, index) => (
                              <motion.div
                                key={index}
                                className={styles.roleCard}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                              >
                                <div className={styles.roleHeader}>
                                  <h4>{role.title}</h4>
                                  <motion.button
                                    type="button"
                                    className={styles.removeButton}
                                    onClick={() => handleRemoveRole(index)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <X size={16} />
                                  </motion.button>
                                </div>
                                <p>{role.description}</p>
                                <div className={styles.roleMeta}>
                                  <span>
                                    <Briefcase size={14} />
                                    {role.compensation}
                                  </span>
                                  <span>
                                    <Clock size={14} />
                                    {role.timeCommitment}
                                  </span>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'details' && (
                    <motion.div
                      key="details"
                      className={styles.tabContent}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>
                          <Clock size={16} />
                          Application Deadline
                          <span className={styles.required}>*</span>
                        </label>
                        <input
                          type="date"
                          name="deadline"
                          value={formData.deadline}
                          onChange={handleInputChange}
                          className={`${styles.formInput} ${validationErrors.deadline ? styles.error : ''}`}
                        />
                        {validationErrors.deadline && (
                          <span className={styles.errorMessage}>{validationErrors.deadline}</span>
                        )}
                      </div>

                      {/* Skills section */}
                      <div className={styles.skillsSection}>
                        <h3>Required Skills</h3>
                        <div className={styles.skillInputWrapper}>
                          <input
                            type="text"
                            value={currentSkill}
                            onChange={(e) => setCurrentSkill(e.target.value)}
                            placeholder="Add a skill"
                            className={styles.formInput}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                          />
                          <motion.button
                            type="button"
                            className={styles.addButton}
                            onClick={handleAddSkill}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Plus size={18} />
                            Add
                          </motion.button>
                        </div>

                        {/* Skill suggestions */}
                        <div className={styles.skillSuggestions}>
                          <p>Suggested skills:</p>
                          <div className={styles.suggestionTags}>
                            {skillSuggestions.map((skill) => (
                              <motion.button
                                key={skill}
                                type="button"
                                className={styles.suggestionTag}
                                onClick={() => {
                                  if (!formData.skills.includes(skill)) {
                                    setFormData(prev => ({
                                      ...prev,
                                      skills: [...prev.skills, skill]
                                    }));
                                  }
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                {skill}
                              </motion.button>
                            ))}
                          </div>
                        </div>

                        {/* Added skills */}
                        <div className={styles.addedSkills}>
                          {formData.skills.map((skill, index) => (
                            <motion.div
                              key={index}
                              className={styles.skillTag}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                            >
                              <Zap size={14} />
                              {skill}
                              <button
                                type="button"
                                onClick={() => handleRemoveSkill(skill)}
                                className={styles.removeTagButton}
                              >
                                <X size={12} />
                              </button>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Requirements section */}
                      <div className={styles.requirementsSection}>
                        <h3>Project Requirements</h3>
                        <div className={styles.requirementInputWrapper}>
                          <input
                            type="text"
                            value={currentRequirement}
                            onChange={(e) => setCurrentRequirement(e.target.value)}
                            placeholder="Add a requirement"
                            className={styles.formInput}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddRequirement();
                              }
                            }}
                          />
                          <motion.button
                            type="button"
                            className={styles.addButton}
                            onClick={handleAddRequirement}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Plus size={18} />
                            Add
                          </motion.button>
                        </div>

                        <div className={styles.requirementsList}>
                          {formData.requirements.map((req, index) => (
                            <motion.div
                              key={index}
                              className={styles.requirementItem}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                            >
                              <CheckSquare size={16} />
                              <span>{req}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveRequirement(index)}
                                className={styles.removeButton}
                              >
                                <X size={14} />
                              </button>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'milestones' && (
                    <motion.div
                      key="milestones"
                      className={styles.tabContent}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className={styles.milestoneForm}>
                        <h3>Project Milestones</h3>
                        
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Milestone Title</label>
                          <input
                            type="text"
                            value={currentMilestone.title}
                            onChange={(e) => setCurrentMilestone(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="e.g., MVP Launch"
                            className={styles.formInput}
                          />
                        </div>

                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Description</label>
                          <textarea
                            value={currentMilestone.description}
                            onChange={(e) => setCurrentMilestone(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Describe what will be accomplished"
                            className={styles.formTextarea}
                            rows={3}
                          />
                        </div>

                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Target Date</label>
                          <input
                            type="date"
                            value={currentMilestone.deadline}
                            onChange={(e) => setCurrentMilestone(prev => ({ ...prev, deadline: e.target.value }))}
                            className={styles.formInput}
                          />
                        </div>

                        <motion.button
                          type="button"
                          className={styles.addButton}
                          onClick={handleAddMilestone}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Plus size={18} />
                          Add Milestone
                        </motion.button>
                      </div>

                      {/* Milestones timeline */}
                      <div className={styles.milestonesTimeline}>
                        <h3>Project Timeline</h3>
                        {formData.milestones.length === 0 ? (
                          <div className={styles.emptyState}>
                            <Target size={32} />
                            <p>No milestones added yet. Add key milestones to show your project roadmap.</p>
                          </div>
                        ) : (
                          <div className={styles.timeline}>
                            {formData.milestones.map((milestone, index) => (
                              <motion.div
                                key={index}
                                className={styles.timelineItem}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                <div className={styles.timelineDot}>
                                  <Target size={16} />
                                </div>
                                <div className={styles.timelineContent}>
                                  <div className={styles.timelineHeader}>
                                    <h4>{milestone.title}</h4>
                                    <motion.button
                                      type="button"
                                      className={styles.removeButton}
                                      onClick={() => handleRemoveMilestone(index)}
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                    >
                                      <X size={16} />
                                    </motion.button>
                                  </div>
                                  <p>{milestone.description}</p>
                                  <span className={styles.timelineDate}>
                                    <Calendar size={14} />
                                    {new Date(milestone.deadline).toLocaleDateString()}
                                  </span>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'settings' && (
                    <motion.div
                      key="settings"
                      className={styles.tabContent}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className={styles.settingsGrid}>
                        {/* Visibility */}
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>
                            <Eye size={16} />
                            Pod Visibility
                          </label>
                          <select
                            name="visibility"
                            value={formData.visibility}
                            onChange={handleInputChange}
                            className={styles.formSelect}
                          >
                            <option value="public">Public - Anyone can view and apply</option>
                            <option value="private">Private - Invite only</option>
                            <option value="unlisted">Unlisted - Only with link</option>
                          </select>
                        </div>

                        {/* Max members */}
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>
                            <Users size={16} />
                            Maximum Team Size
                          </label>
                          <input
                            type="number"
                            name="maxMembers"
                            value={formData.maxMembers}
                            onChange={handleInputChange}
                            min="2"
                            max="50"
                            className={styles.formInput}
                          />
                        </div>

                        {/* Timezone */}
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>
                            <Globe size={16} />
                            Preferred Timezone
                          </label>
                          <select
                            name="timezone"
                            value={formData.timezone}
                            onChange={handleInputChange}
                            className={styles.formSelect}
                          >
                            <option value="">Any timezone</option>
                            <option value="Americas">Americas (UTC-8 to UTC-3)</option>
                            <option value="Europe">Europe (UTC+0 to UTC+3)</option>
                            <option value="Asia">Asia (UTC+5 to UTC+9)</option>
                            <option value="Pacific">Pacific (UTC+10 to UTC+12)</option>
                          </select>
                        </div>

                        {/* Communication tools */}
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>
                            <MessageSquare size={16} />
                            Communication Tools
                          </label>
                          <div className={styles.checkboxGroup}>
                            {['Slack', 'Discord', 'Zoom', 'Email', 'Telegram'].map((tool) => (
                              <label key={tool} className={styles.checkbox}>
                                <input
                                  type="checkbox"
                                  checked={formData.communication.includes(tool)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setFormData(prev => ({
                                        ...prev,
                                        communication: [...prev.communication, tool]
                                      }));
                                    } else {
                                      setFormData(prev => ({
                                        ...prev,
                                        communication: prev.communication.filter(t => t !== tool)
                                      }));
                                    }
                                  }}
                                />
                                <span>{tool}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Project tools */}
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>
                            <Settings size={16} />
                            Project Management Tools
                          </label>
                          <div className={styles.checkboxGroup}>
                            {['GitHub', 'Trello', 'Notion', 'Figma', 'Jira'].map((tool) => (
                              <label key={tool} className={styles.checkbox}>
                                <input
                                  type="checkbox"
                                  checked={formData.tools.includes(tool)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setFormData(prev => ({
                                        ...prev,
                                        tools: [...prev.tools, tool]
                                      }));
                                    } else {
                                      setFormData(prev => ({
                                        ...prev,
                                        tools: prev.tools.filter(t => t !== tool)
                                      }));
                                    }
                                  }}
                                />
                                <span>{tool}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Tags section */}
                      <div className={styles.tagsSection}>
                        <h3>Tags & Keywords</h3>
                        <div className={styles.tagInputWrapper}>
                          <input
                            type="text"
                            value={currentTag}
                            onChange={(e) => setCurrentTag(e.target.value)}
                            placeholder="Add relevant tags"
                            className={styles.formInput}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddTag();
                              }
                            }}
                          />
                          <motion.button
                            type="button"
                            className={styles.addButton}
                            onClick={handleAddTag}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Plus size={18} />
                            Add
                          </motion.button>
                        </div>

                        <div className={styles.addedTags}>
                          {formData.tags.map((tag, index) => (
                            <motion.div
                              key={index}
                              className={styles.tag}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                            >
                              <Tag size={14} />
                              {tag}
                              <button
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                className={styles.removeTagButton}
                              >
                                <X size={12} />
                              </button>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Form Actions */}
                <div className={styles.formActions}>
                  <motion.button
                    type="button"
                    className={styles.previewButton}
                    onClick={() => setPreviewMode(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Eye size={18} />
                    Preview Pod
                  </motion.button>

                  <motion.button
                    type="submit"
                    className={styles.submitButton}
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isSubmitting ? (
                      <div className={styles.loadingSpinner} />
                    ) : (
                      <>
                        <Sparkles size={18} />
                        Launch Pod
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          ) : (
            // Preview Mode
            <motion.div
              className={styles.previewMode}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className={styles.previewHeader}>
                <h2>Pod Preview</h2>
                <motion.button
                  className={styles.backButton}
                  onClick={() => setPreviewMode(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowLeft size={18} />
                  Back to Edit
                </motion.button>
              </div>

              {/* Preview Card (similar to PodCard styling) */}
              <motion.div 
                className={styles.podPreviewCard}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className={styles.cardHeader}>
                  <div className={`${styles.urgencyIndicator} ${styles[formData.urgency]}`}>
                    <motion.span 
                      className={styles.urgencyDot}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    {formData.urgency.charAt(0).toUpperCase() + formData.urgency.slice(1)} Priority
                  </div>
                  
                  <div className={styles.matchBadge}>
                    <Target size={16} />
                    <span>Perfect Match</span>
                  </div>
                </div>
                
                <div className={styles.podContent}>
                  <h3 className={styles.podTitle}>{formData.title || 'Untitled Pod'}</h3>
                  
                  <div className={styles.podMeta}>
                    <div className={styles.metaItem}>
                      <User size={14} />
                      <span>You</span>
                    </div>
                    <div className={styles.metaItem}>
                      <Users size={14} />
                      <span>{formData.maxMembers} members max</span>
                    </div>
                    <div className={styles.metaItem}>
                      <Clock size={14} />
                      <span>{formData.duration || 'Duration TBD'}</span>
                    </div>
                  </div>

                  <p className={styles.description}>
                    {formData.description || 'No description provided yet.'}
                  </p>

                  {formData.rolesNeeded.length > 0 && (
                    <div className={styles.rolesSection}>
                      <h4>
                        <Briefcase size={14} />
                        Roles Needed
                      </h4>
                      <div className={styles.rolesTags}>
                        {formData.rolesNeeded.map((role, index) => (
                          <motion.span 
                            key={index} 
                            className={styles.roleTag}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            {role.title}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className={styles.extraInfo}>
                    <div className={styles.infoItem}>
                      <Activity size={14} />
                      <span>{formData.commitment}</span>
                    </div>
                    {formData.budget && (
                      <div className={styles.infoItem}>
                        <DollarSign size={14} />
                        <span>{formData.budget}</span>
                      </div>
                    )}
                    <div className={styles.infoItem}>
                      <Calendar size={14} />
                      <span>Deadline: {formData.deadline ? new Date(formData.deadline).toLocaleDateString() : 'Not set'}</span>
                    </div>
                  </div>
                </div>
                
                <div className={styles.cardFooter}>
                  <motion.button 
                    className={styles.viewButton}
                    disabled
                  >
                    <Eye size={16} />
                    View Details
                  </motion.button>
                  <motion.button 
                    className={styles.applyButton}
                    disabled
                  >
                    <Zap size={16} />
                    Apply Now
                    <ArrowRight size={16} />
                  </motion.button>
                </div>
              </motion.div>

              {/* Preview Actions */}
              <div className={styles.previewActions}>
                <motion.button
                  className={styles.editButton}
                  onClick={() => setPreviewMode(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Edit3 size={18} />
                  Continue Editing
                </motion.button>
                
                <motion.button
                  className={styles.publishButton}
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? (
                    <div className={styles.loadingSpinner} />
                  ) : (
                    <>
                      <Sparkles size={18} />
                      Publish Pod
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Help section */}
        <motion.div 
          className={styles.helpSection}
          variants={itemVariants}
        >
          <div className={styles.helpCard}>
            <HelpCircle size={24} />
            <div className={styles.helpContent}>
              <h3>Need Help?</h3>
              <p>Check out our guide on creating successful pods</p>
              <motion.button
                className={styles.helpButton}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Guide
              </motion.button>
            </div>
          </div>
          
          <div className={styles.helpCard}>
            <Shield size={24} />
            <div className={styles.helpContent}>
              <h3>Best Practices</h3>
              <p>Learn how to attract the best talent to your pod</p>
              <motion.button
                className={styles.helpButton}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div 
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className={styles.successModal}
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
            >
              <motion.div 
                className={styles.successIcon}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <CheckCircle size={64} />
              </motion.div>
              <h2>Pod Created Successfully!</h2>
              <p>Your pod is now live and ready for applications</p>
              <motion.div 
                className={styles.celebrationEmojis}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                🎉 🚀 ✨
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreatePodPage;