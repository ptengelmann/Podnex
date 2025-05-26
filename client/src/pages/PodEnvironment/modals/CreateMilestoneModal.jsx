import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Target, 
  Calendar, 
  Info,
  AlertTriangle,
  Flag,
  Sparkles,
  Zap
} from 'lucide-react';
import styles from './Modal.module.scss';

const CreateMilestoneModal = ({ isOpen, onClose, onSubmit, podId }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
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

  // Reset form when modal is opened
  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDescription('');
      setDueDate('');
      setIsSubmitting(false);
      setValidationError('');
    }
  }, [isOpen]);

  // If modal is not open, don't render
  if (!isOpen) return null;

  // Calculate min date (today) for the date picker
  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate
    if (!title.trim()) {
      setValidationError('Milestone title is required');
      return;
    }
    
    setIsSubmitting(true);
    setValidationError('');

    try {
      const milestoneData = {
        title: title.trim(),
        description: description.trim(),
        podId,
        dueDate: dueDate || undefined,
        status: 'not-started',
        progress: 0
      };

      await onSubmit(milestoneData);
      onClose();
    } catch (error) {
      console.error('Error creating milestone:', error);
      setValidationError(error.response?.data?.message || error.message || 'Failed to create milestone. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClick = (e) => {
    // Only close if clicking the overlay directly, not its children
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleModalClick}>
      {/* Enhanced floating shapes with PodNex branding */}
      <motion.div
        className={`${styles.floatingShape} ${styles.shape1}`}
        style={{
          x: mousePosition.x * 30,
          y: mousePosition.y * 30,
        }}
        animate={{
          rotate: [0, 15, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className={`${styles.floatingShape} ${styles.shape2}`}
        style={{
          x: mousePosition.x * -25,
          y: mousePosition.y * -25,
        }}
        animate={{
          rotate: [0, -12, 0],
          scale: [1, 0.9, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className={`${styles.floatingShape} ${styles.shape3}`}
        style={{
          x: mousePosition.x * 20,
          y: mousePosition.y * 20,
        }}
        animate={{
          rotate: [0, 8, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div 
        className={styles.modalContainer}
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, y: 50, scale: 0.9, rotateX: 10 }}
        animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
        exit={{ opacity: 0, y: 30, scale: 0.95, rotateX: -5 }}
        transition={{ 
          duration: 0.5, 
          ease: [0.16, 1, 0.3, 1],
          type: "spring",
          damping: 20,
          stiffness: 300
        }}
      >
        <div className={styles.modalHeader}>
          <motion.div 
            className={styles.modalIcon}
            initial={{ scale: 0.5, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, duration: 0.6, type: "spring", damping: 15 }}
          >
            <Target size={22} />
            <motion.div
              className={styles.iconSpark}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <Sparkles size={12} />
            </motion.div>
          </motion.div>
          <div className={styles.modalTitleSection}>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              Create New Milestone
            </motion.h2>
            <motion.p 
              className={styles.modalSubtitle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              Set important goals for your pod's journey
            </motion.p>
          </div>
          <motion.button 
            className={styles.closeButton} 
            onClick={onClose} 
            aria-label="Close"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={20} />
          </motion.button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.modalContent}>
            <AnimatePresence>
              {validationError && (
                <motion.div 
                  className={styles.errorMessage}
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <AlertTriangle size={16} />
                  <span>{validationError}</span>
                </motion.div>
              )}
            </AnimatePresence>
          
            <motion.div 
              className={styles.formGroup}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <label>
                <Flag size={16} />
                Milestone Title
                <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Complete MVP Development, Launch Beta Version"
                required
                maxLength={100}
              />
              <div className={styles.charCount}>
                {title.length}/100
              </div>
            </motion.div>

            <motion.div 
              className={styles.formGroup}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <label>
                <Target size={16} />
                Description (optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what needs to be accomplished for this milestone. Include key deliverables, success criteria, or important notes."
                rows={4}
                maxLength={500}
              />
              <div className={styles.charCount}>
                {description.length}/500
              </div>
            </motion.div>

            <motion.div 
              className={styles.formGroup}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <label>
                <Calendar size={16} />
                Target Date (optional)
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                min={today}
              />
              <div className={styles.dateHelper}>
                Setting a target date helps track progress and keeps the team focused
              </div>
            </motion.div>

            <motion.div 
              className={styles.milestonePreview}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <div className={styles.previewHeader}>
                <Zap size={16} />
                <span>Milestone Preview</span>
              </div>
              <div className={styles.previewContent}>
                <div className={styles.previewTitle}>
                  {title || 'Your milestone title will appear here'}
                </div>
                <div className={styles.previewMeta}>
                  <span className={styles.previewStatus}>Not Started</span>
                  {dueDate && (
                    <span className={styles.previewDate}>
                      Due {new Date(dueDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </span>
                  )}
                </div>
                <div className={styles.previewProgress}>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: '0%' }}></div>
                  </div>
                  <span className={styles.progressText}>0% Complete</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className={styles.info}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <Info size={16} />
              <div>
                <p><strong>Pro Tip:</strong> Break down large goals into smaller milestones for better tracking. You can associate tasks with this milestone after creation to monitor progress automatically.</p>
              </div>
            </motion.div>
          </div>

          <motion.div 
            className={styles.modalFooter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <motion.button
              type="button" 
              className={styles.cancelButton}
              onClick={onClose}
              whileHover={{ scale: 1.02, x: -2 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
            >
              Cancel
            </motion.button>
            
            <motion.button 
              type="submit" 
              className={styles.submitButton}
              disabled={!title.trim() || isSubmitting}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              animate={isSubmitting ? { scale: [1, 1.02, 1] } : {}}
              transition={{ duration: 0.5, repeat: isSubmitting ? Infinity : 0 }}
            >
              {isSubmitting ? (
                <>
                  <span className={styles.loadingSpinner} />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Target size={16} />
                  <span>Create Milestone</span>
                  <motion.div
                    className={styles.buttonSpark}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Sparkles size={14} />
                  </motion.div>
                </>
              )}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateMilestoneModal;