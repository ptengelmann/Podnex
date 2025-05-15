import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Modal.module.scss';
import { 
  X, 
  CheckCircle, 
  Calendar, 
  Flag, 
  Users, 
  Target,
  AlertTriangle,
  Star
} from 'lucide-react';

// Helper function to get initials from name
const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

const CreateTaskModal = ({ isOpen, onClose, onSubmit, podId, podMembers, milestones }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [selectedAssignees, setSelectedAssignees] = useState([]);
  const [selectedMilestone, setSelectedMilestone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Mouse parallax effect just like in CreatePodPage
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
      setPriority('medium');
      setSelectedAssignees([]);
      setSelectedMilestone('');
      setIsSubmitting(false);
      setValidationError('');
    }
  }, [isOpen]);

  // If modal is not open, don't render
  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate
    if (!title.trim()) {
      setValidationError('Task title is required');
      return;
    }
    
    setIsSubmitting(true);
    setValidationError('');

    try {
      const taskData = {
        title,
        description,
        podId,
        dueDate: dueDate || undefined,
        priority,
        assignedTo: selectedAssignees.length > 0 ? selectedAssignees : undefined,
        milestoneId: selectedMilestone || undefined
      };

      await onSubmit(taskData);
      onClose();
    } catch (error) {
      console.error('Error creating task:', error);
      setValidationError(error.message || 'Failed to create task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAssignee = (userId) => {
    setSelectedAssignees(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
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
            <CheckCircle size={20} />
          </motion.div>
          <h2>Create New Task</h2>
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
                <Star size={16} />
                Task Title
                <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a clear, specific task title"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>
                <CheckCircle size={16} />
                Description (optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what needs to be done and any relevant details"
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
              />
            </div>

            <div className={styles.formGroup}>
              <label>
                <Flag size={16} />
                Priority
              </label>
              <select 
                value={priority} 
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>
                <Users size={16} />
                Assignees (optional)
              </label>
              <div className={styles.assigneeSelection}>
                {podMembers.map(memberData => {
                  const member = memberData.user;
                  const isSelected = selectedAssignees.includes(member._id);
                  
                  return (
                    <motion.div 
                      key={member._id} 
                      className={`${styles.assigneeOption} ${isSelected ? styles.selected : ''}`}
                      onClick={() => toggleAssignee(member._id)}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={styles.assigneeAvatar}>
                        {member.profileImage ? (
                          <img src={member.profileImage} alt={member.name} />
                        ) : (
                          <div className={styles.assigneeInitials}>{getInitials(member.name)}</div>
                        )}
                      </div>
                      <span className={styles.assigneeName}>{member.name}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>
                <Target size={16} />
                Milestone (optional)
              </label>
              <select
                value={selectedMilestone}
                onChange={(e) => setSelectedMilestone(e.target.value)}
              >
                <option value="">No milestone</option>
                {milestones.map(milestone => (
                  <option key={milestone._id} value={milestone._id}>
                    {milestone.title}
                  </option>
                ))}
              </select>
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
                  <CheckCircle size={16} />
                  <span>Create Task</span>
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateTaskModal;