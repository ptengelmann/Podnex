import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import styles from '../PodEnvironment.module.scss'; // Make sure this path is correct

const CreateMilestoneModal = ({ isOpen, onClose, onSubmit }) => {
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
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    
    setLoading(true);
    
    const milestoneData = {
      title,
      description,
      dueDate: dueDate || undefined
    };
    
    try {
      await onSubmit(milestoneData);
      onClose();
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Error creating milestone:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // If modal is closed, don't render anything
  if (!isOpen) return null;
  
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Create New Milestone</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <div className={styles.modalBody}>
          <form onSubmit={handleSubmit}>
            {error && <div className={styles.errorMessage}>{error}</div>}
            
            <div className={styles.formGroup}>
              <label htmlFor="title">Milestone Title*</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter milestone title"
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter milestone description"
                rows={4}
              />
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
                {loading ? 'Creating...' : 'Create Milestone'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateMilestoneModal;