import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, FileText } from 'lucide-react';
import styles from './Modal.module.scss';

const UploadResourceModal = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  
  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setName('');
      setDescription('');
      setTags('');
      setFile(null);
      setError('');
    }
  }, [isOpen]);
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (!name) {
        setName(selectedFile.name);
      }
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    
    setLoading(true);
    
    // Create FormData object to send file
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('tags', tags);
    
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Error uploading resource:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Format file size for display
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // If modal is closed, don't render anything
  if (!isOpen) return null;
  
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Upload Resource</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <div className={styles.modalBody}>
          <form onSubmit={handleSubmit}>
            {error && <div className={styles.errorMessage}>{error}</div>}
            
            <div 
              className={styles.fileUploadArea}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              
              <Upload size={40} className={styles.uploadIcon} />
              <p className={styles.uploadText}>Click to select a file or drag and drop</p>
              <p className={styles.uploadNote}>Max file size: 10MB</p>
            </div>
            
            {file && (
              <div className={styles.selectedFile}>
                <FileText size={24} className={styles.fileIcon} />
                <div className={styles.fileInfo}>
                  <div className={styles.fileName}>{file.name}</div>
                  <div className={styles.fileSize}>{formatFileSize(file.size)}</div>
                </div>
                <button 
                  type="button" 
                  className={styles.removeFileButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            )}
            
            <div className={styles.formGroup}>
              <label htmlFor="name">Resource Name*</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter resource name"
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter resource description"
                rows={3}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="tags">Tags (comma separated)</label>
              <input
                id="tags"
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="design, documentation, research"
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
                {loading ? 'Uploading...' : 'Upload Resource'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadResourceModal;