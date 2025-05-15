import React, { useState, useEffect } from 'react';
import { X, Calendar, AlignLeft, Target, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Modal.module.scss';

const CreateMilestoneModal = ({ isOpen, onClose, onSubmit, podId }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDescription('');
      setDueDate('');
      setError('');
    }
  }, [isOpen]);
  
  // Calculate min date (today) for the date picker
  const today = new Date().toISOString().split('T')[0];
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    
    setLoading(true);
    setError('');
    
    const milestoneData = {
      title,
      description: description.trim() || undefined,
      dueDate: dueDate || undefined,
      pod: podId,
      status: 'not-started',
      progress: 0
    };
    
    try {
      await onSubmit(milestoneData);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
      console.error('Error creating milestone:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Modal animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };
  
  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: 'spring', damping: 20, stiffness: 300 }
    },
    exit: { 
      opacity: 0, 
      y: 50, 
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className={styles.modalOverlay}
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={overlayVariants}
          onClick={onClose}
        >
          <motion.div 
            className={styles.modalContent}
            variants={modalVariants}
            onClick={e => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div className={styles.modalHeaderContent}>
                <div className={styles.modalTitleIcon}>
                  <Target size={20} />
                </div>
                <h2>Create New Milestone</h2>
              </div>
              <button className={styles.closeButton} onClick={onClose} aria-label="Close modal">
                <X size={20} />
              </button>
            </div>
            
            <div className={styles.modalBody}>
              {error && (
                <div className={styles.errorMessage}>
                  <X size={16} />
                  <span>{error}</span>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label htmlFor="milestone-title">
                    <span className={styles.labelText}>Milestone Title</span>
                    <span className={styles.requiredIndicator}>*</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      id="milestone-title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter a clear and specific milestone title"
                      required
                      className={!title.trim() && error ? styles.inputError : ''}
                    />
                  </div>
                  {!title.trim() && error && (
                    <span className={styles.fieldErrorMessage}>Title is required</span>
                  )}
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="milestone-description">
                    <span className={styles.labelText}>Description</span>
                    <span className={styles.optionalIndicator}>(optional)</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <AlignLeft size={16} className={styles.inputIcon} />
                    <textarea
                      id="milestone-description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe what needs to be accomplished for this milestone"
                      rows={4}
                    />
                  </div>
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="milestone-dueDate">
                    <span className={styles.labelText}>Due Date</span>
                    <span className={styles.optionalIndicator}>(optional)</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <Calendar size={16} className={styles.inputIcon} />
                    <input
                      id="milestone-dueDate"
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      min={today}
                    />
                  </div>
                </div>
                
                <div className={styles.formInfo}>
                  <p>
                    <strong>Note:</strong> Creating a milestone will help you track progress 
                    toward important goals. You'll be able to associate tasks with this 
                    milestone after creation.
                  </p>
                </div>
                
                <div className={styles.formActions}>
                  <button
                    type="button"
                    className={styles.secondaryButton}
                    onClick={onClose}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={styles.primaryButton}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader size={16} className={styles.spinnerIcon} />
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <Target size={16} />
                        <span>Create Milestone</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateMilestoneModal;