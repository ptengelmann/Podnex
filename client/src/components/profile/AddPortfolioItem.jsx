import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  X, 
  Save,
  Upload,
  Trash2,
  Link as LinkIcon,
  Star,
  AlertCircle,
  CheckCircle,
  Image
} from 'lucide-react';
import { addPortfolioItem } from '../../services/profileService';
import styles from './AddPortfolioItem.module.scss';

const AddPortfolioItem = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    podId: '',
    images: [],
    link: '',
    featured: false
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const fileInputRef = useRef(null);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleImageClick = () => {
    fileInputRef.current.click();
  };
  
  const handleImageChange = (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const newFiles = Array.from(e.target.files);
    const newPreviews = [];
    
    // Create image previews
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push(e.target.result);
        if (newPreviews.length === newFiles.length) {
          setImagePreview([...imagePreview, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
    
    // Add files to state
    setImageFiles([...imageFiles, ...newFiles]);
  };
  
  const removeImage = (index) => {
    const newFiles = [...imageFiles];
    const newPreviews = [...imagePreview];
    
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setImageFiles(newFiles);
    setImagePreview(newPreviews);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // In a real implementation, you would upload the images and get their URLs
      // For now, we'll just use the preview URLs as placeholders
      const portfolioData = {
        ...formData,
        images: imagePreview
      };
      
      await addPortfolioItem(portfolioData);
      
      setSuccess('Portfolio item added successfully');
      setTimeout(() => {
        setSuccess(null);
        navigate('/profile');
      }, 2000);
      
      setLoading(false);
    } catch (err) {
      console.error('Error adding portfolio item:', err);
      setError(err.response?.data?.message || 'Failed to add portfolio item');
      setLoading(false);
    }
  };
  
  return (
    <div className={styles.addPortfolioPage}>
      <div className={styles.gridBackground}></div>
      <div className={styles.glowEffect1}></div>
      <div className={styles.glowEffect2}></div>
      
      <motion.div 
        className={styles.addPortfolioContainer}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className={styles.pageHeader}
          variants={itemVariants}
        >
          <h1>Add Portfolio Item</h1>
          <div className={styles.headerActions}>
            <button 
              className={styles.cancelButton}
              onClick={() => navigate('/profile')}
            >
              <X size={16} />
              <span>Cancel</span>
            </button>
            
            <button 
              className={styles.saveButton}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <div className={styles.buttonSpinner}></div>
              ) : (
                <>
                  <Save size={16} />
                  <span>Save</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
        
        {error && (
          <motion.div 
            className={styles.errorAlert}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AlertCircle size={18} />
            <span>{error}</span>
            <button 
              className={styles.closeButton}
              onClick={() => setError(null)}
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
        
        {success && (
          <motion.div 
            className={styles.successAlert}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CheckCircle size={18} />
            <span>{success}</span>
            <button 
              className={styles.closeButton}
              onClick={() => setSuccess(null)}
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
        
        <motion.form 
          className={styles.portfolioForm}
          variants={itemVariants}
          onSubmit={handleSubmit}
        >
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Project Details</h2>
            
            <div className={styles.formGroup}>
              <label htmlFor="title">Project Title *</label>
              <input 
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Give your project a name"
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="description">Description</label>
              <textarea 
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe what this project is about"
                rows={4}
              ></textarea>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="link">
                <LinkIcon size={16} />
                <span>Project Link</span>
              </label>
              <input 
                type="url"
                id="link"
                name="link"
                value={formData.link}
                onChange={handleChange}
                placeholder="https://yourproject.com"
              />
              <div className={styles.fieldHelper}>
                Add a link to where your project can be viewed online
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input 
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                />
                <Star size={16} />
                <span>Feature this project on your profile</span>
              </label>
            </div>
          </div>
          
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Project Images</h2>
            <p className={styles.sectionDescription}>
              Add images to showcase your project. You can add up to 5 images.
            </p>
            
            <div className={styles.imageUploader}>
              <div className={styles.imageGrid}>
                {imagePreview.map((preview, index) => (
                  <div key={index} className={styles.imageItem}>
                    <img src={preview} alt={`Preview ${index + 1}`} />
                    <button 
                      type="button"
                      className={styles.removeImageButton}
                      onClick={() => removeImage(index)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                
                {imagePreview.length < 5 && (
                  <div 
                    className={styles.addImageButton}
                    onClick={handleImageClick}
                  >
                    <Image size={24} />
                    <span>Add Image</span>
                  </div>
                )}
              </div>
              
              <input 
                type="file"
                ref={fileInputRef}
                className={styles.hiddenFileInput}
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />
            </div>
          </div>
          
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Related Pod</h2>
            <p className={styles.sectionDescription}>
              If this project is related to a pod you've worked on, select it here.
            </p>
            
            <div className={styles.formGroup}>
              <label htmlFor="podId">Select Pod (Optional)</label>
              <select
                id="podId"
                name="podId"
                value={formData.podId}
                onChange={handleChange}
              >
                <option value="">None</option>
                {/* In a real implementation, you would fetch pods and populate this */}
                <option value="pod1">Example Pod 1</option>
                <option value="pod2">Example Pod 2</option>
              </select>
            </div>
          </div>
          
          <div className={styles.formActions}>
            <button 
              type="button"
              className={styles.cancelButton}
              onClick={() => navigate('/profile')}
            >
              <X size={16} />
              <span>Cancel</span>
            </button>
            
            <button 
              type="submit"
              className={styles.saveButton}
              disabled={loading}
            >
              {loading ? (
                <div className={styles.buttonSpinner}></div>
              ) : (
                <>
                  <Save size={16} />
                  <span>Save Portfolio Item</span>
                </>
              )}
            </button>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default AddPortfolioItem;