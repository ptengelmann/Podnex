import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Target, 
  Calendar, 
  Info,
  AlertTriangle,
  Flag
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
        title,
        description,
        podId,
        dueDate: dueDate || undefined,
        status: 'not-started',
        progress: 0
      };

      await onSubmit(milestoneData);
      onClose();
    } catch (error) {
      console.error('Error creating milestone:', error);
      setValidationError(error.message || 'Failed to create milestone. Please try again.');
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
      {/* Floating shapes with parallax effect */}
      <motion.div
        className={`${styles.floatingShape} ${styles.shape1}`}
        style={{
          x: mousePosition.x * 30,
          y: mousePosition.y * 30,
        }}
        animate={{
          rotate: [0, 10, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className={`${styles.floatingShape} ${styles.shape2}`}
        style={{
          x: mousePosition.x * -30,
          y: mousePosition.y * -30,
        }}
        animate={{
          rotate: [0, -10, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div 
        className={styles.modalContainer}
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className={styles.modalHeader}>
          <motion.div 
            className={styles.modalIcon}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5, type: "spring" }}
          >
            <Target size={20} />
          </motion.div>
          <h2>Create New Milestone</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.modalContent}>
            {validationError && (
              <motion.div 
                className={styles.errorMessage}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AlertTriangle size={16} />
                <span>{validationError}</span>
              </motion.div>
            )}
          
            <div className={styles.formGroup}>
              <label>
                <Flag size={16} />
                Milestone Title
                <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a clear and specific milestone"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>
                <Target size={16} />
                Description (optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what needs to be accomplished for this milestone"
                rows={4}
              />
            </div>

            <div className={styles.formGroup}>
              <label>
                <Calendar size={16} />
                Due Date (optional)
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                min={today}
              />
            </div>

            <div className={styles.info}>
              <Info size={16} />
              <p>Creating a milestone will help you track progress toward important goals. You'll be able to associate tasks with this milestone after creation.</p>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <motion.button
              type="button" 
              className={styles.cancelButton}
              onClick={onClose}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
            
            <motion.button 
              type="submit" 
              className={styles.submitButton}
              disabled={!title || isSubmitting}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? (
                <span className={styles.loadingSpinner} />
              ) : (
                <>
                  <Target size={16} />
                  <span>Create Milestone</span>
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateMilestoneModal;