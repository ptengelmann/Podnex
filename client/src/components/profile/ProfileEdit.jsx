import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    User,
    X,
    Save,
    Plus,
    Trash2,
    Upload,
    AlertCircle,
    Edit,
    CheckCircle,
    Globe,
    Github,
    Twitter,
    Linkedin
  } from 'lucide-react';
import { getCurrentProfile, updateProfile, uploadProfileImage } from '../../services/profileService';
import styles from './ProfileEdit.module.scss';

const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

// Helper function to safely get user data from profile
const getUserData = (profile) => {
  if (profile?.profile?.user) {
    return profile.profile.user;
  } else if (profile?.user) {
    return profile.user;
  } else if (profile) {
    return profile;
  }
  return null;
};

// Helper function to safely get profile data
const getProfileData = (profile) => {
  if (profile?.profile) {
    return profile.profile;
  }
  return profile || {};
};

const skillLevels = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' }
];

const ProfileEdit = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    displayName: '',
    headline: '',
    bio: '',
    skills: [],
    socialLinks: {
      website: '',
      github: '',
      linkedin: '',
      twitter: ''
    },
    visibility: {
      skills: true,
      badges: true,
      stats: true,
      podsHistory: true
    }
  });
  const [newSkill, setNewSkill] = useState({ name: '', level: 'intermediate', yearsExperience: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching profile for edit...');
        const profileData = await getCurrentProfile();
        console.log('Profile data received for edit:', profileData);
        
        setProfile(profileData);
        
        // Get user and profile data safely
        const userData = getUserData(profileData);
        const profileDetails = getProfileData(profileData);
        
        console.log('User data:', userData);
        console.log('Profile details:', profileDetails);
        
        // Initialize form data with profile data using safe access
        setFormData({
          displayName: profileDetails.displayName || userData?.name || '',
          headline: profileDetails.headline || '',
          bio: profileDetails.bio || '',
          skills: profileDetails.skills || [],
          socialLinks: {
            website: profileDetails.socialLinks?.website || '',
            github: profileDetails.socialLinks?.github || '',
            linkedin: profileDetails.socialLinks?.linkedin || '',
            twitter: profileDetails.socialLinks?.twitter || ''
          },
          visibility: {
            skills: profileDetails.visibility?.skills !== undefined ? profileDetails.visibility.skills : true,
            badges: profileDetails.visibility?.badges !== undefined ? profileDetails.visibility.badges : true,
            stats: profileDetails.visibility?.stats !== undefined ? profileDetails.visibility.stats : true,
            podsHistory: profileDetails.visibility?.podsHistory !== undefined ? profileDetails.visibility.podsHistory : true
          }
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load profile');
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    const [parent, child] = name.split('.');
    
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [child]: checked
      }
    }));
  };
  
  const handleSkillChange = (e) => {
    const { name, value } = e.target;
    setNewSkill(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const addSkill = () => {
    if (!newSkill.name.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, { ...newSkill }]
    }));
    
    setNewSkill({ name: '', level: 'intermediate', yearsExperience: 0 });
  };
  
  const removeSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };
  
  const handleImageClick = () => {
    fileInputRef.current.click();
  };
  
  const handleImageChange = async (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const imageFormData = new FormData();
    imageFormData.append('profileImage', file);
    
    try {
      setLoading(true);
      const response = await uploadProfileImage(imageFormData);
      
      // Update the profile state with the new image URL
      setProfile(prev => ({
        ...prev,
        profileImage: response.imageUrl
      }));
      
      setSuccess('Profile image updated successfully');
      setTimeout(() => setSuccess(null), 3000);
      setLoading(false);
    } catch (err) {
      console.error('Error uploading image:', err);
      setError(err.response?.data?.message || 'Failed to upload image');
      setLoading(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      
      await updateProfile(formData);
      
      setSuccess('Profile updated successfully');
      setTimeout(() => {
        setSuccess(null);
        navigate('/profile');
      }, 3000);
      
      setSaving(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
      setSaving(false);
    }
  };
  
  if (loading && !profile) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  // Get safe references for rendering
  const userData = getUserData(profile);
  const profileDetails = getProfileData(profile);
  const displayName = profileDetails.displayName || userData?.name || 'User';
  
  return (
    <div className={styles.profileEditPage}>
      <div className={styles.gridBackground}></div>
      <div className={styles.glowEffect1}></div>
      <div className={styles.glowEffect2}></div>
      
      <motion.div 
        className={styles.editContainer}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className={styles.pageHeader}
          variants={itemVariants}
        >
          <h1>Edit Profile</h1>
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
              disabled={saving}
            >
              {saving ? (
                <div className={styles.buttonSpinner}></div>
              ) : (
                <>
                  <Save size={16} />
                  <span>Save Changes</span>
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
          className={styles.editForm}
          variants={itemVariants}
          onSubmit={handleSubmit}
        >
          {/* Profile Image */}
          <div className={styles.imageSection}>
            <label className={styles.sectionLabel}>Profile Image</label>
            <div className={styles.profileImageEdit}>
              <div 
                className={styles.imageContainer}
                onClick={handleImageClick}
              >
                {profileDetails.profileImage ? (
                  <img 
                    src={profileDetails.profileImage} 
                    alt={displayName} 
                    className={styles.currentImage}
                  />
                ) : (
                  <div className={styles.imageInitials}>
                    {getInitials(displayName)}
                  </div>
                )}
                
                <div className={styles.imageEditOverlay}>
                  <Edit size={20} />
                </div>
              </div>
              
              <input 
                type="file"
                ref={fileInputRef}
                className={styles.hiddenFileInput}
                accept="image/*"
                onChange={handleImageChange}
              />
              
              <div className={styles.imageHelp}>
                <p>Click the image to upload a new profile picture</p>
                <p className={styles.helpText}>Recommended size: 300x300 pixels</p>
              </div>
            </div>
          </div>
          
          {/* Basic Info */}
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Basic Information</h2>
            
            <div className={styles.formGroup}>
              <label htmlFor="displayName">Display Name</label>
              <input 
                type="text"
                id="displayName"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                placeholder="Your name"
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="headline">Professional Headline</label>
              <input 
                type="text"
                id="headline"
                name="headline"
                value={formData.headline}
                onChange={handleChange}
                placeholder="e.g. Frontend Developer | UX Designer | Project Manager"
                maxLength={100}
              />
              <div className={styles.fieldCounter}>
                {formData.headline.length}/100
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="bio">Bio</label>
              <textarea 
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell others about yourself, your experience, and what you're passionate about"
                rows={5}
                maxLength={500}
              ></textarea>
              <div className={styles.fieldCounter}>
                {formData.bio.length}/500
              </div>
            </div>
          </div>
          
          {/* Skills Section */}
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Skills</h2>
            
            <div className={styles.skillsList}>
              {formData.skills.map((skill, index) => (
                <div 
                  key={index}
                  className={styles.skillItem}
                  style={{
                    backgroundColor: skill.level === 'expert' ? 'rgba(232, 197, 71, 0.1)' :
                                    skill.level === 'advanced' ? 'rgba(52, 211, 153, 0.1)' :
                                    skill.level === 'intermediate' ? 'rgba(59, 130, 246, 0.1)' :
                                    'rgba(156, 163, 175, 0.1)',
                    color: skill.level === 'expert' ? '#E8C547' :
                          skill.level === 'advanced' ? '#34D399' :
                          skill.level === 'intermediate' ? '#3B82F6' :
                          '#9CA3AF'
                  }}
                >
                  <span className={styles.skillName}>{skill.name}</span>
                  <span className={styles.skillLevel}>{skill.level}</span>
                  <button 
                    type="button"
                    className={styles.removeSkillButton}
                    onClick={() => removeSkill(index)}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              
              {formData.skills.length === 0 && (
                <div className={styles.emptySkills}>
                  No skills added yet. Add skills to showcase your expertise.
                </div>
              )}
            </div>
            
            <div className={styles.addSkillForm}>
              <div className={styles.skillInputRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="skillName">Skill Name</label>
                  <input 
                    type="text"
                    id="skillName"
                    name="name"
                    value={newSkill.name}
                    onChange={handleSkillChange}
                    placeholder="e.g. React, UI Design, Project Management"
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="skillLevel">Level</label>
                  <select
                    id="skillLevel"
                    name="level"
                    value={newSkill.level}
                    onChange={handleSkillChange}
                  >
                    {skillLevels.map(level => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="yearsExperience">Years Experience</label>
                  <input 
                    type="number"
                    id="yearsExperience"
                    name="yearsExperience"
                    value={newSkill.yearsExperience}
                    onChange={handleSkillChange}
                    min="0"
                    max="50"
                  />
                </div>
              </div>
              
              <button 
                type="button" 
                className={styles.addSkillButton}
                onClick={addSkill}
              >
                <Plus size={16} />
                <span>Add Skill</span>
              </button>
            </div>
          </div>
          
          {/* Social Links */}
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Social Links</h2>
            
            <div className={styles.formGroup}>
              <label htmlFor="website">
                <Globe size={16} />
                <span>Website</span>
              </label>
              <input 
                type="url"
                id="website"
                name="socialLinks.website"
                value={formData.socialLinks.website}
                onChange={handleChange}
                placeholder="https://yourwebsite.com"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="github">
              <Github size={16} />
              <span>GitHub</span>
              </label>
              <input 
                type="url"
                id="github"
                name="socialLinks.github"
                value={formData.socialLinks.github}
                onChange={handleChange}
                placeholder="https://github.com/yourusername"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="linkedin">
              <Linkedin size={16} />
              <span>LinkedIn</span>
              </label>
              <input 
                type="url"
                id="linkedin"
                name="socialLinks.linkedin"
                value={formData.socialLinks.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/yourusername"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="twitter">
                <Twitter size={16} />
                <span>Twitter</span>
              </label>
              <input 
                type="url"
                id="twitter"
                name="socialLinks.twitter"
                value={formData.socialLinks.twitter}
                onChange={handleChange}
                placeholder="https://twitter.com/yourusername"
              />
            </div>
          </div>
          
          {/* Privacy Settings */}
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Privacy Settings</h2>
            <p className={styles.sectionDescription}>
              Control which parts of your profile are visible to other users
            </p>
            
            <div className={styles.privacyOptions}>
              <div className={styles.privacyOption}>
                <label htmlFor="visibility.skills" className={styles.checkboxLabel}>
                  <input 
                    type="checkbox"
                    id="visibility.skills"
                    name="visibility.skills"
                    checked={formData.visibility.skills}
                    onChange={handleCheckboxChange}
                  />
                  <span>Show my skills</span>
                </label>
              </div>
              
              <div className={styles.privacyOption}>
                <label htmlFor="visibility.badges" className={styles.checkboxLabel}>
                  <input 
                    type="checkbox"
                    id="visibility.badges"
                    name="visibility.badges"
                    checked={formData.visibility.badges}
                    onChange={handleCheckboxChange}
                  />
                  <span>Show my badges</span>
                </label>
              </div>
              
              <div className={styles.privacyOption}>
                <label htmlFor="visibility.stats" className={styles.checkboxLabel}>
                  <input 
                    type="checkbox"
                    id="visibility.stats"
                    name="visibility.stats"
                    checked={formData.visibility.stats}
                    onChange={handleCheckboxChange}
                  />
                  <span>Show my stats</span>
                </label>
              </div>
              
              <div className={styles.privacyOption}>
                <label htmlFor="visibility.podsHistory" className={styles.checkboxLabel}>
                  <input 
                    type="checkbox"
                    id="visibility.podsHistory"
                    name="visibility.podsHistory"
                    checked={formData.visibility.podsHistory}
                    onChange={handleCheckboxChange}
                  />
                  <span>Show my pod history</span>
                </label>
              </div>
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
              disabled={saving}
            >
              {saving ? (
                <div className={styles.buttonSpinner}></div>
              ) : (
                <>
                  <Save size={16} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default ProfileEdit;