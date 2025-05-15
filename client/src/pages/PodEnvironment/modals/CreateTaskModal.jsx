import React, { useState, useEffect } from 'react';
import styles from './Modal.module.scss';
import { 
  X, 
  CheckCircle, 
  Calendar, 
  Flag, 
  Users, 
  Target,
  AlertTriangle
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
      <div className={styles.modalContainer} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.modalIcon}>
            <CheckCircle size={20} />
          </div>
          <h2>Create New Task</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.modalContent}>
            {validationError && (
              <div className={styles.errorMessage}>
                <AlertTriangle size={16} />
                <span>{validationError}</span>
              </div>
            )}
          
            <div className={styles.formGroup}>
              <label>
                Task Title<span className={styles.required}>*</span>
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
              <label>Description (optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what needs to be done and any relevant details"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Due Date (optional)</label>
              <div className={styles.dateInput}>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Priority</label>
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
              <label>Assignees (optional)</label>
              <div className={styles.assigneeSelection}>
                {podMembers.map(memberData => {
                  const member = memberData.user;
                  const isSelected = selectedAssignees.includes(member._id);
                  
                  return (
                    <div 
                      key={member._id} 
                      className={`${styles.assigneeOption} ${isSelected ? styles.selected : ''}`}
                      onClick={() => toggleAssignee(member._id)}
                    >
                      <div className={styles.assigneeAvatar}>
                        {member.profileImage ? (
                          <img src={member.profileImage} alt={member.name} />
                        ) : (
                          <div className={styles.assigneeInitials}>{getInitials(member.name)}</div>
                        )}
                      </div>
                      <span className={styles.assigneeName}>{member.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Milestone (optional)</label>
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
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={!title || isSubmitting}
            >
              <CheckCircle size={16} />
              <span>{isSubmitting ? 'Creating...' : 'Create Task'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;