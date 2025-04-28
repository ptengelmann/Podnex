import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CreatePodPage.module.scss';
import { motion } from 'framer-motion';
import axios from 'axios';

const CreatePodPage = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    mission: '',
    rolesNeeded: '',
    status: 'draft', // Default status
  });
  
  const [rolesArray, setRolesArray] = useState([]);
  const [currentRole, setCurrentRole] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  
  const { title, mission, rolesNeeded, status } = formData;
  
  // Status options for the dropdown
  const statusOptions = [
    'draft',
    'pre-launch',
    'open',
    'in progress',
    'live',
    'archived'
  ];
  
  const onChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  
  const handleRoleInput = (e) => {
    setCurrentRole(e.target.value);
  };
  
  const addRole = () => {
    if (currentRole.trim() !== '') {
      setRolesArray([...rolesArray, currentRole.trim()]);
      setCurrentRole('');
      
      // Also update the form data with comma-separated roles
      setFormData((prev) => ({
        ...prev,
        rolesNeeded: [...rolesArray, currentRole.trim()].join(','),
      }));
    }
  };
  
  const removeRole = (indexToRemove) => {
    const updatedRoles = rolesArray.filter((_, index) => index !== indexToRemove);
    setRolesArray(updatedRoles);
    
    // Update the form data with updated comma-separated roles
    setFormData((prev) => ({
      ...prev,
      rolesNeeded: updatedRoles.join(','),
    }));
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addRole();
    }
  };
  
  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('You must be logged in to create a Pod.');
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
      console.log('Pod Created:', res.data);
      
      // Success animation before navigating away
      setTimeout(() => {
        navigate('/explore');
      }, 1000);
      
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
      alert(error.response?.data?.message || 'Error creating pod');
      setIsSubmitting(false);
    }
  };
  
  const togglePreview = () => {
    setPreviewMode(!previewMode);
  };
  
  // Map status to appropriate color class (similar to PodCard)
  const getStatusClass = () => {
    switch(status?.toLowerCase()) {
      case 'open':
        return styles.statusOpen;
      case 'in progress':
        return styles.statusInProgress;
      case 'live':
        return styles.statusLive;
      case 'draft':
        return styles.statusDraft;
      case 'pre-launch':
        return styles.statusPreLaunch;
      case 'archived':
        return styles.statusArchived;
      default:
        return '';
    }
  };
  
  // Get the current user's name (replace with your actual auth logic)
  const currentUserName = localStorage.getItem('username') || 'Anonymous';
  
  return (
    <div className={styles.createPodPage}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={styles.pageHeader}
      >
        <h1>Launch a New Pod</h1>
        <p className={styles.subtitle}>Create your pod and start collaborating with others</p>
      </motion.div>
      
      <div className={styles.contentWrapper}>
        {!previewMode ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={styles.formContainer}
          >
            <form onSubmit={onSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Pod Title</label>
                <motion.input
                  whileFocus={{ borderColor: '#FFC107', boxShadow: '0 0 0 2px rgba(255, 193, 7, 0.2)' }}
                  transition={{ duration: 0.2 }}
                  type="text"
                  name="title"
                  placeholder="Enter a compelling title for your pod"
                  value={title}
                  onChange={onChange}
                  required
                  className={styles.formInput}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Mission Statement</label>
                <motion.textarea
                  whileFocus={{ borderColor: '#FFC107', boxShadow: '0 0 0 2px rgba(255, 193, 7, 0.2)' }}
                  transition={{ duration: 0.2 }}
                  name="mission"
                  placeholder="Describe the purpose and goals of your pod"
                  value={mission}
                  onChange={onChange}
                  required
                  className={styles.formTextarea}
                  rows={5}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Pod Status</label>
                <div className={styles.statusSelectWrapper}>
                  <motion.select
                    whileFocus={{ borderColor: '#FFC107', boxShadow: '0 0 0 2px rgba(255, 193, 7, 0.2)' }}
                    transition={{ duration: 0.2 }}
                    name="status"
                    value={status}
                    onChange={onChange}
                    className={styles.formSelect}
                  >
                    {statusOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </motion.select>
                  <div className={`${styles.statusIndicator} ${getStatusClass()}`}>
                    <span className={styles.statusDot}></span>
                  </div>
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Roles Needed</label>
                <div className={styles.rolesInputContainer}>
                  <motion.input
                    whileFocus={{ borderColor: '#FFC107', boxShadow: '0 0 0 2px rgba(255, 193, 7, 0.2)' }}
                    transition={{ duration: 0.2 }}
                    type="text"
                    placeholder="Add a role and press Enter or Add"
                    value={currentRole}
                    onChange={handleRoleInput}
                    onKeyPress={handleKeyPress}
                    className={styles.rolesInput}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={addRole}
                    className={styles.addRoleButton}
                  >
                    Add
                  </motion.button>
                </div>
                
                {rolesArray.length > 0 && (
                  <div className={styles.rolesPreview}>
                    <div className={styles.rolesList}>
                      {rolesArray.map((role, index) => (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          key={index}
                          className={styles.roleTag}
                        >
                          <span>{role}</span>
                          <button
                            type="button"
                            onClick={() => removeRole(index)}
                            className={styles.removeRoleBtn}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className={styles.formActions}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={togglePreview}
                  className={styles.previewButton}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 12C2 12 5.5 5 12 5C18.5 5 22 12 22 12C22 12 18.5 19 12 19C5.5 19 2 12 2 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Preview Pod
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: '#ffca28' }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className={styles.submitButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className={styles.loadingSpinner}></div>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Launch Pod
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        ) : (
          // Preview mode - similar to PodCard
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.previewContainer}
          >
            <div className={styles.previewHeader}>
              <h3>Pod Preview</h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={togglePreview}
                className={styles.backToEditButton}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Back to Edit
              </motion.button>
            </div>
            
            <motion.div 
              className={styles.podCardPreview}
              whileHover={{ 
                y: -5,
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)"
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className={styles.cardHeader}>
                <div className={`${styles.status} ${getStatusClass()}`}>
                  <span className={styles.statusDot}></span>
                  {status}
                </div>
                
                <div className={styles.cardActions}>
                  <motion.button 
                    className={styles.bookmarkBtn}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Bookmark pod"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 13.5L8 10.5L4 13.5V4C4 3.73478 4.10536 3.48043 4.29289 3.29289C4.48043 3.10536 4.73478 3 5 3H11C11.2652 3 11.5196 3.10536 11.7071 3.29289C11.8946 3.48043 12 3.73478 12 4V13.5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </motion.button>
                </div>
              </div>
              
              <h3 className={styles.cardTitle}>{title || 'Your Pod Title'}</h3>
              
              <div className={styles.creatorInfo}>
                <div className={styles.creatorAvatar}>
                  {currentUserName.charAt(0).toUpperCase()}
                </div>
                <p className={styles.creator}>by {currentUserName}</p>
              </div>
              
              {mission && (
                <div className={styles.missionPreview}>
                  <p>{mission.length > 120 ? `${mission.substring(0, 120)}...` : mission}</p>
                </div>
              )}
              
              {rolesArray.length > 0 && (
                <div className={styles.rolesSection}>
                  <div className={styles.rolesSectionHeader}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 20H22V18C22 16.3431 20.6569 15 19 15C18.0444 15 17.1931 15.4468 16.6438 16.1429M17 20H7M17 20V18C17 17.3438 16.8736 16.717 16.6438 16.1429M7 20H2V18C2 16.3431 3.34315 15 5 15C5.95561 15 6.80686 15.4468 7.35625 16.1429M7 20V18C7 17.3438 7.12642 16.717 7.35625 16.1429M7.35625 16.1429C8.0935 14.301 9.89482 13 12 13C14.1052 13 15.9065 14.301 16.6438 16.1429M15 7C15 9.20914 13.2091 11 11 11C8.79086 11 7 9.20914 7 7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7ZM21 8C21 9.65685 19.6569 11 18 11C16.3431 11 15 9.65685 15 8C15 6.34315 16.3431 5 18 5C19.6569 5 21 6.34315 21 8ZM9 8C9 9.65685 7.65685 11 6 11C4.34315 11 3 9.65685 3 8C3 6.34315 4.34315 5 6 5C7.65685 5 9 6.34315 9 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Needed Roles</span>
                  </div>
                  <div className={styles.roles}>
                    {rolesArray.map((role, index) => (
                      <span key={index} className={styles.role}>
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className={styles.cardFooter}>
                <motion.div 
                  className={styles.viewPodIndicator}
                  animate={{ x: [0, 5, 0] }}
                  transition={{ 
                    repeat: Infinity, 
                    repeatType: "reverse", 
                    duration: 1.5,
                    ease: "easeInOut",
                  }}
                >
                  <span>View details</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 8H15M15 8L8 1M15 8L8 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.div>
              </div>
            </motion.div>
            
            <div className={styles.previewActions}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onSubmit}
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className={styles.loadingSpinner}></div>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Launch Pod
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CreatePodPage;