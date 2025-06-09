import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Star, Users, Layers, Target, Rocket, 
  ChevronRight, Check, ArrowRight, Calendar,
  Briefcase, Code, Paintbrush, Megaphone, PenTool,
  Video, Monitor, Sparkles,Clock
} from 'lucide-react';
import styles from './PodCreationDemo.module.scss';

const PodCreationDemo = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    format: 'project',
    rolesNeeded: [],
    deadline: '',
  });
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Category options
  const categories = [
    { id: 'development', name: 'Development', icon: <Code size={16} /> },
    { id: 'design', name: 'Design', icon: <Paintbrush size={16} /> },
    { id: 'marketing', name: 'Marketing', icon: <Megaphone size={16} /> },
    { id: 'content', name: 'Content', icon: <PenTool size={16} /> },
    { id: 'video', name: 'Video Production', icon: <Video size={16} /> },
  ];
  
  // Role templates
  const roleTemplates = [
    {
      title: 'UI Designer',
      description: 'Design user interfaces and create visual assets',
      requirements: ['Figma expertise', 'Strong portfolio', 'Eye for aesthetics'],
      compensation: 'Equity/Revenue share',
      timeCommitment: '15-20 hours/week'
    },
    {
      title: 'React Developer',
      description: 'Build frontend components and features',
      requirements: ['React.js expert', 'TypeScript', 'API integration'],
      compensation: 'Hourly rate',
      timeCommitment: '20-30 hours/week'
    },
    {
      title: 'Content Writer',
      description: 'Create engaging content and copy',
      requirements: ['SEO knowledge', 'Editorial experience', 'Creative writing'],
      compensation: 'Per article',
      timeCommitment: '10-15 hours/week'
    }
  ];
  
  // Add role to form data
  const handleAddRole = (role) => {
    if (!formData.rolesNeeded.some(r => r.title === role.title)) {
      setFormData(prev => ({
        ...prev,
        rolesNeeded: [...prev.rolesNeeded, role]
      }));
    }
  };
  
  // Remove role from form data
  const handleRemoveRole = (index) => {
    setFormData(prev => ({
      ...prev,
      rolesNeeded: prev.rolesNeeded.filter((_, i) => i !== index)
    }));
  };
  
  // Go to next step
  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };
  
  // Go to previous step
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };
  
  // Launch demo pod (redirect to signup)
  const launchPod = () => {
    window.location.href = '/register?demo=true';
  };
  
  // Calculate progress percentage
  const getProgress = () => {
    return (currentStep / 3) * 100;
  };
  
  return (
    <div className={styles.demoWrapper}>
      {/* Header with close button */}
      <div className={styles.demoHeader}>
        <div className={styles.demoTitle}>
          <Sparkles size={20} className={styles.demoIcon} />
          <h2>Try Creating a Pod</h2>
        </div>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={20} />
        </button>
      </div>
      
      {/* Progress bar */}
      <div className={styles.progressBar}>
        <div 
          className={styles.progressFill} 
          style={{ width: `${getProgress()}%` }}
        />
      </div>
      
      {/* Step indicator */}
      <div className={styles.stepIndicator}>
        <div className={styles.steps}>
          {[1, 2, 3].map(step => (
            <div 
              key={step} 
              className={`${styles.step} ${currentStep >= step ? styles.active : ''}`}
            >
              {currentStep > step ? (
                <Check size={16} />
              ) : (
                <span>{step}</span>
              )}
            </div>
          ))}
        </div>
        <div className={styles.stepLabel}>
          Step {currentStep} of 3: {
            currentStep === 1 ? 'Basic Info' :
            currentStep === 2 ? 'Team Roles' : 'Preview'
          }
        </div>
      </div>
      
      {/* Step content */}
      <div className={styles.demoContent}>
        <AnimatePresence mode="wait">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={styles.stepContent}
            >
              <div className={styles.formGroup}>
                <label>
                  <Star size={16} />
                  Pod Title
                  <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter a compelling title for your pod"
                  className={styles.formInput}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>
                  <Layers size={16} />
                  Description
                  <span className={styles.required}>*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe what your pod will build or create"
                  className={styles.formTextarea}
                  rows={4}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>
                  <Target size={16} />
                  Category
                  <span className={styles.required}>*</span>
                </label>
                <div className={styles.categoryGrid}>
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className={`${styles.categoryCard} ${formData.category === category.id ? styles.selected : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, category: category.id }))}
                    >
                      <div className={styles.categoryIcon}>
                        {category.icon}
                      </div>
                      <span>{category.name}</span>
                      {formData.category === category.id && (
                        <div className={styles.selectedIndicator} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label>
                  <Calendar size={16} />
                  Deadline
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  className={styles.formInput}
                />
              </div>
            </motion.div>
          )}
          
          {/* Step 2: Team Roles */}
          {currentStep === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={styles.stepContent}
            >
              <div className={styles.rolesSection}>
                <h3>Select Roles Needed</h3>
                <p>Choose the roles required for your pod</p>
                
                <div className={styles.roleTemplates}>
                  {roleTemplates.map((role, index) => (
                    <motion.div
                      key={index}
                      className={styles.roleTemplate}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAddRole(role)}
                    >
                      <h4>{role.title}</h4>
                      <p>{role.description}</p>
                      <div className={styles.roleMetaInfo}>
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
                
                <div className={styles.selectedRoles}>
                  <h3>Selected Roles ({formData.rolesNeeded.length})</h3>
                  
                  {formData.rolesNeeded.length === 0 ? (
                    <div className={styles.emptyState}>
                      <Users size={24} />
                      <p>No roles selected yet. Click on a role template above to add it.</p>
                    </div>
                  ) : (
                    <div className={styles.roleList}>
                      {formData.rolesNeeded.map((role, index) => (
                        <motion.div 
                          key={index}
                          className={styles.roleCard}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                        >
                          <div className={styles.roleHeader}>
                            <h4>{role.title}</h4>
                            <button 
                              className={styles.removeButton}
                              onClick={() => handleRemoveRole(index)}
                            >
                              <X size={16} />
                            </button>
                          </div>
                          <p>{role.description}</p>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Step 3: Preview */}
          {currentStep === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={styles.stepContent}
            >
              <div className={styles.previewSection}>
                <h3>Preview Your Pod</h3>
                <p>Here's how your pod will appear to potential collaborators</p>
                
                <div className={styles.podPreview}>
                  <div className={styles.podCard}>
                    <div className={styles.statusBar} />
                    
                    <div className={styles.cardHeader}>
                      <div className={styles.statusBadge}>
                        DRAFT
                      </div>
                    </div>
                    
                    <div className={styles.priorityBadge}>
                      <div className={styles.priorityDot} />
                      <span>Medium Priority</span>
                    </div>
                    
                    <h3 className={styles.podTitle}>
                      {formData.title || 'My Awesome Pod'}
                    </h3>
                    
                    <p className={styles.podDescription}>
                      {formData.description || 'This pod will collaborate on creating something amazing.'}
                    </p>
                    
                    <div className={styles.creatorSection}>
                      <div className={styles.creatorAvatar}>
                        Y
                      </div>
                      <div className={styles.creatorInfo}>
                        <span className={styles.creatorName}>You</span>
                        <span className={styles.creatorRole}>Pod Creator</span>
                      </div>
                    </div>
                    
                    <div className={styles.detailsRow}>
                      <div className={styles.detailItem}>
                        <Calendar size={16} />
                        <span>{formData.deadline ? new Date(formData.deadline).toLocaleDateString() : 'No deadline'}</span>
                      </div>
                      
                      <div className={styles.detailItem}>
                        <Users size={16} />
                        <span>0/{formData.rolesNeeded.length + 1}</span>
                      </div>
                    </div>
                    
                    {formData.rolesNeeded.length > 0 && (
                      <div className={styles.rolesSection}>
                        <h4>Roles Needed</h4>
                        <div className={styles.rolesTags}>
                          {formData.rolesNeeded.map((role, index) => (
                            <span key={index} className={styles.roleTag}>
                              {role.title}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className={styles.cardFooter}>
                      <div className={styles.categoryTag}>
                        {categories.find(c => c.id === formData.category)?.name || 'Category'}
                      </div>
                      
                      <div className={styles.viewDetails}>
                        <span>View Details</span>
                        <ArrowRight size={16} />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className={styles.launchInfo}>
                  <motion.div 
                    className={styles.infoBox}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Sparkles size={24} className={styles.infoIcon} />
                    <div>
                      <h4>Ready to launch your Pod?</h4>
                      <p>Create a free account to launch this pod and find collaborators.</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Navigation buttons */}
      <div className={styles.demoActions}>
        {currentStep > 1 && (
          <button 
            className={styles.backButton} 
            onClick={prevStep}
          >
            Back
          </button>
        )}
        
        {currentStep < 3 ? (
          <button 
            className={styles.nextButton} 
            onClick={nextStep}
            disabled={
              (currentStep === 1 && (!formData.title || !formData.description || !formData.category)) ||
              (currentStep === 2 && formData.rolesNeeded.length === 0)
            }
          >
            Continue
            <ChevronRight size={16} />
          </button>
        ) : (
          <button 
            className={styles.launchButton} 
            onClick={launchPod}
          >
            Launch a Real Pod
            <Rocket size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default PodCreationDemo;