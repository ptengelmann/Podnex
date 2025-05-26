import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Upload, 
  FileText, 
  Tag,
  AlertTriangle,
  File,
  Trash2,
  Info
} from 'lucide-react';
import styles from './Modal.module.scss';

const ResourceUploadModal = ({ isOpen, onClose, onSubmit, podId }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [file, setFile] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const fileInputRef = useRef(null);
  
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

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setName('');
      setDescription('');
      setTags('');
      setFile(null);
      setValidationError('');
      setIsSubmitting(false);
    }
  }, [isOpen]);
  
  // If modal is not open, don't render
  if (!isOpen) return null;
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setValidationError('File size exceeds 10MB limit');
        return;
      }
      
      setFile(selectedFile);
      if (!name) {
        setName(selectedFile.name);
      }
      setValidationError('');
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
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      // Validate file size (max 10MB)
      if (droppedFile.size > 10 * 1024 * 1024) {
        setValidationError('File size exceeds 10MB limit');
        return;
      }
      
      setFile(droppedFile);
      if (!name) {
        setName(droppedFile.name);
      }
      setValidationError('');
    }
  };
  
  const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!file) {
    setValidationError('Please select a file to upload');
    return;
  }
  
  if (!name.trim()) {
    setValidationError('Resource name is required');
    return;
  }
  
  setIsSubmitting(true);
  setValidationError('');
  
  // Create FormData object to send file
  const formData = new FormData();
  formData.append('file', file);
  formData.append('name', name);
  formData.append('description', description);
  formData.append('tags', tags);
  // Don't append podId - it comes from the URL params in the route
  
  try {
    await onSubmit(formData);
    onClose();
  } catch (error) {
    console.error('Error uploading resource:', error);
    setValidationError(error.response?.data?.message || error.message || 'Failed to upload resource. Please try again.');
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
            <FileText size={20} />
          </motion.div>
          <h2>Upload Resource</h2>
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
            
            <div className={styles.fileUpload}>
              <div 
                className={styles.uploadButton}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <Upload size={30} />
                <span>
                  {file ? 'Change file' : 'Click or drag to upload a file'}
                </span>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </div>
              
              {file && (
                <motion.div 
                  className={styles.filePreview}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className={styles.fileIcon}>
                    <File size={20} />
                  </div>
                  <div className={styles.fileInfo}>
                    <div className={styles.fileName}>{file.name}</div>
                    <div className={styles.fileSize}>{formatFileSize(file.size)}</div>
                  </div>
                  <motion.button 
                    type="button" 
                    className={styles.removeFile}
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 size={16} />
                  </motion.button>
                </motion.div>
              )}
            </div>
          
            <div className={styles.formGroup}>
              <label>
                <FileText size={16} />
                Resource Name
                <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter a name for this resource"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>
                <Info size={16} />
                Description (optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add details about this resource"
                rows={3}
              />
            </div>

            <div className={styles.formGroup}>
              <label>
                <Tag size={16} />
                Tags (comma-separated, optional)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="design, documentation, research"
              />
            </div>
            
            <div className={styles.info}>
              <Info size={16} />
              <p>Files are limited to 10MB. Supported formats include documents, images, and archives.</p>
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
              disabled={!file || !name.trim() || isSubmitting}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? (
                <span className={styles.loadingSpinner} />
              ) : (
                <>
                  <Upload size={16} />
                  <span>Upload Resource</span>
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ResourceUploadModal;