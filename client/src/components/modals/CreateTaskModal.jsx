import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import styles from '../PodEnvironment.module.scss'; // Make sure this path is correct

const CreateTaskModal = ({ isOpen, onClose, onSubmit, podId, milestones, podMembers }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [selectedMilestone, setSelectedMilestone] = useState('');
  const [assignees, setAssignees] = useState([]);
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setSelectedMilestone('');
      setAssignees([]);
      setDueDate('');
      setError('');
    }
  }, [isOpen]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    
    setLoading(true);
    
    const taskData = {
      title,
      description,
      priority,
      milestone: selectedMilestone || undefined,
      assignedTo: assignees,
      dueDate: dueDate || undefined
    };
    
    try {
      await onSubmit(taskData);
      onClose();
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Error creating task:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAssigneeToggle = (memberId) => {
    setAssignees(prev => {
      if (prev.includes(memberId)) {
        return prev.filter(id => id !== memberId);
      } else {
        return [...prev, memberId];
      }
    });
  };
  
  // If modal is closed, don't render anything
  if (!isOpen) return null;
  
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Create New Task</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <div className={styles.modalBody}>
          <form onSubmit={handleSubmit}>
            {error && <div className={styles.errorMessage}>{error}</div>}
            
            <div className={styles.formGroup}>
              <label htmlFor="title">Task Title*</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter task description"
                rows={4}
              />
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="priority">Priority</label>
                <select
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="milestone">Milestone</label>
                <select
                  id="milestone"
                  value={selectedMilestone}
                  onChange={(e) => setSelectedMilestone(e.target.value)}
                >
                  <option value="">None</option>
                  {milestones.map(milestone => (
                    <option key={milestone._id} value={milestone._id}>
                      {milestone.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="dueDate">Due Date</label>
              <input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Assign To</label>
              <div className={styles.assigneesList}>
                {podMembers.map(member => (
                  <div 
                    key={member.user._id} 
                    className={`${styles.assigneeItem} ${
                      assignees.includes(member.user._id) ? styles.selected : ''
                    }`}
                    onClick={() => handleAssigneeToggle(member.user._id)}
                  >
                    <div className={styles.assigneeAvatar}>
                      {member.user.profileImage ? (
                        <img src={member.user.profileImage} alt={member.user.name} />
                      ) : (
                        <div className={styles.assigneeInitials}>
                          {member.user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                      )}
                    </div>
                    <span>{member.user.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className={styles.formActions}>
              <button 
                type="button" 
                className={styles.secondaryButton}
                onClick={onClose}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className={styles.primaryButton}
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;