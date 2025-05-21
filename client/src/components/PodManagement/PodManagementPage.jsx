// src/components/PodManagementPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Settings, 
  Edit3, 
  Trash2, 
  AlertCircle, 
  Globe, 
  Eye, 
  EyeOff, 
  Archive, 
  Shield,
  Save,
  X,
  ChevronRight,
  Calendar,
  Target,
  Briefcase,
  PlusCircle,
  UserPlus,
  UserMinus,
  Clock,
  Star,
  CheckCircle,
  Zap
} from 'lucide-react';
import styles from './PodManagementPage.module.scss';

const PodManagementPage = () => {
  const { podId } = useParams();
  const navigate = useNavigate();
  
  // State
  const [pod, setPod] = useState(null);
  const [members, setMembers] = useState([]);
  const [isCreator, setIsCreator] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Fetch the pod data
  useEffect(() => {
    const fetchPodData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        
        // Fetch pod data
        const podResponse = await axios.get(`http://localhost:5000/api/pods/${podId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setPod(podResponse.data);
        setFormData(podResponse.data);
        
        // Check if current user is creator
        const userData = JSON.parse(localStorage.getItem('user'));
        
        if (podResponse.data.creator && userData) {
          setIsCreator(podResponse.data.creator._id === userData._id);
          
          // If not creator, redirect
          if (podResponse.data.creator._id !== userData._id) {
            setError('You do not have permission to manage this pod');
            setTimeout(() => navigate(`/pods/${podId}`), 3000);
          }
        }
        
        // Fetch pod members
        const membersResponse = await axios.get(`http://localhost:5000/api/pods/${podId}/members`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setMembers(membersResponse.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching pod data:', err);
        setError('Failed to load pod data. Please try again.');
        setLoading(false);
      }
    };
    
    fetchPodData();
  }, [podId, navigate]);
  
  // Save pod changes
  const handleSavePod = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      const response = await axios.put(
        `http://localhost:5000/api/pods/${podId}`, 
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setPod(response.data);
      setEditMode(false);
      setSuccessMessage('Pod updated successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error updating pod:', err);
      setErrorMessage('Failed to update pod. Please try again.');
      
      // Clear error message after 3 seconds
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };
  
  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Change pod visibility
  const handleVisibilityChange = async (visibility) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      const response = await axios.put(
        `http://localhost:5000/api/pods/${podId}`,
        { ...formData, visibility },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setPod(response.data);
      setFormData(response.data);
      setSuccessMessage(`Pod is now ${visibility}`);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error updating visibility:', err);
      setErrorMessage('Failed to update pod visibility. Please try again.');
      
      // Clear error message after 3 seconds
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };
  
  // Handle member removal
  const handleRemoveMember = async (memberId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      await axios.delete(
        `http://localhost:5000/api/pods/${podId}/members/${memberId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local members state
      setMembers(prev => prev.filter(member => member._id !== memberId));
      setSuccessMessage('Member removed successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error removing member:', err);
      setErrorMessage('Failed to remove member. Please try again.');
      
      // Clear error message after 3 seconds
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };
  
  // Archive pod
  const handleArchivePod = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      const response = await axios.put(
        `http://localhost:5000/api/pods/${podId}`,
        { ...pod, status: 'archived' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setPod(response.data);
      setSuccessMessage('Pod has been archived');
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => navigate('/creator-dashboard'), 2000);
    } catch (err) {
      console.error('Error archiving pod:', err);
      setErrorMessage('Failed to archive pod. Please try again.');
      
      // Clear error message after 3 seconds
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };
  
  // Format date string
  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  };
  
  if (loading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.spinner}></div>
        <p>Loading pod management...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={styles.errorState}>
        <AlertCircle size={40} />
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/creator-dashboard')} className={styles.backButton}>
          Back to Dashboard
        </button>
      </div>
    );
  }
  
  if (!isCreator) {
    return (
      <div className={styles.unauthorizedState}>
        <Shield size={40} />
        <h2>Access Denied</h2>
        <p>Only the pod creator can access management functions</p>
        <button onClick={() => navigate(`/pods/${podId}`)} className={styles.backButton}>
          View Pod Details
        </button>
      </div>
    );
  }
  
  return (
    <div className={styles.podManagementPage}>
      {/* Background elements */}
      <div className={styles.gridBackground}></div>
      <div className={styles.glowEffect1}></div>
      <div className={styles.glowEffect2}></div>
      
      <motion.div 
        className={styles.container}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className={styles.header} variants={itemVariants}>
          <div className={styles.breadcrumbs}>
            <Link to="/creator-dashboard">Dashboard</Link>
            <ChevronRight size={16} />
            <Link to={`/pods/${podId}`}>{pod?.title || 'Pod'}</Link>
            <ChevronRight size={16} />
            <span className={styles.currentPage}>Manage</span>
          </div>
          
          <h1 className={styles.pageTitle}>Manage Pod: {pod?.title}</h1>
          
          <div className={styles.headerActions}>
            <Link to={`/pod-environment/${podId}`} className={styles.environmentButton}>
              <Zap size={18} />
              <span>Pod Environment</span>
            </Link>
            
            <Link to={`/pods/${podId}`} className={styles.viewButton}>
              <Eye size={18} />
              <span>View Public Page</span>
            </Link>
          </div>
        </motion.div>
        
        {/* Success/Error messages */}
        <AnimatePresence>
          {successMessage && (
            <motion.div 
              className={styles.successMessage}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <CheckCircle size={18} />
              <span>{successMessage}</span>
            </motion.div>
          )}
          
          {errorMessage && (
            <motion.div 
              className={styles.errorMessage}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <AlertCircle size={18} />
              <span>{errorMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Tab navigation */}
        <motion.div className={styles.tabNavigation} variants={itemVariants}>
          <button 
            className={`${styles.tabButton} ${activeTab === 'general' ? styles.active : ''}`}
            onClick={() => setActiveTab('general')}
          >
            <Settings size={18} />
            <span>General Settings</span>
          </button>
          
          <button 
            className={`${styles.tabButton} ${activeTab === 'members' ? styles.active : ''}`}
            onClick={() => setActiveTab('members')}
          >
            <Users size={18} />
            <span>Members</span>
          </button>
          
          <button 
            className={`${styles.tabButton} ${activeTab === 'roles' ? styles.active : ''}`}
            onClick={() => setActiveTab('roles')}
          >
            <Briefcase size={18} />
            <span>Roles</span>
          </button>
          
          <button 
            className={`${styles.tabButton} ${activeTab === 'advanced' ? styles.active : ''}`}
            onClick={() => setActiveTab('advanced')}
          >
            <Shield size={18} />
            <span>Advanced</span>
          </button>
        </motion.div>
        
        {/* Main content */}
        <motion.div className={styles.contentContainer} variants={itemVariants}>
          {/* General Settings Tab */}
          {activeTab === 'general' && (
            <div className={styles.generalTab}>
              <div className={styles.sectionHeader}>
                <h2>Pod Details</h2>
                <button 
                  className={styles.editButton}
                  onClick={() => setEditMode(!editMode)}
                >
                  {editMode ? (
                    <>
                      <X size={16} />
                      <span>Cancel</span>
                    </>
                  ) : (
                    <>
                      <Edit3 size={16} />
                      <span>Edit Details</span>
                    </>
                  )}
                </button>
              </div>
              
              {editMode ? (
                <form className={styles.editForm}>
                  <div className={styles.formGroup}>
                    <label htmlFor="title">Title</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title || ''}
                      onChange={handleInputChange}
                      placeholder="Pod Title"
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description || ''}
                      onChange={handleInputChange}
                      placeholder="Pod Description"
                      rows={5}
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="mission">Mission Statement</label>
                    <textarea
                      id="mission"
                      name="mission"
                      value={formData.mission || ''}
                      onChange={handleInputChange}
                      placeholder="Pod Mission"
                      rows={3}
                    />
                  </div>
                  
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="category">Category</label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category || ''}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Category</option>
                        <option value="development">Development</option>
                        <option value="design">Design</option>
                        <option value="marketing">Marketing</option>
                        <option value="content">Content</option>
                        <option value="video">Video Production</option>
                        <option value="research">Research</option>
                        <option value="product">Product</option>
                        <option value="community">Community</option>
                      </select>
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label htmlFor="format">Format</label>
                      <select
                        id="format"
                        name="format"
                        value={formData.format || ''}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Format</option>
                        <option value="project">Project</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="event">Event</option>
                        <option value="mentorship">Mentorship</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="status">Status</label>
                      <select
                        id="status"
                        name="status"
                        value={formData.status || 'draft'}
                        onChange={handleInputChange}
                      >
                        <option value="draft">Draft</option>
                        <option value="open">Open</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label htmlFor="urgency">Urgency</label>
                      <select
                        id="urgency"
                        name="urgency"
                        value={formData.urgency || 'medium'}
                        onChange={handleInputChange}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="deadline">Deadline</label>
                      <input
                        type="date"
                        id="deadline"
                        name="deadline"
                        value={formData.deadline ? new Date(formData.deadline).toISOString().split('T')[0] : ''}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label htmlFor="budget">Budget</label>
                      <input
                        type="text"
                        id="budget"
                        name="budget"
                        value={formData.budget || ''}
                        onChange={handleInputChange}
                        placeholder="Budget (e.g. $5,000, Equity, etc.)"
                      />
                    </div>
                  </div>
                  
                  <div className={styles.formActions}>
                    <button
                      type="button"
                      className={styles.cancelButton}
                      onClick={() => {
                        setEditMode(false);
                        setFormData(pod);
                      }}
                    >
                      <X size={16} />
                      <span>Cancel</span>
                    </button>
                    
                    <button
                      type="button"
                      className={styles.saveButton}
                      onClick={handleSavePod}
                    >
                      <Save size={16} />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className={styles.podDetails}>
                  <div className={styles.detailsGrid}>
                    <div className={styles.detailCard}>
                      <div className={styles.detailIcon}>
                        <Star size={20} />
                      </div>
                      <div className={styles.detailContent}>
                        <h3>Title</h3>
                        <p>{pod?.title || 'No title set'}</p>
                      </div>
                    </div>
                    
                    <div className={styles.detailCard}>
                      <div className={styles.detailIcon}>
                        <Calendar size={20} />
                      </div>
                      <div className={styles.detailContent}>
                        <h3>Deadline</h3>
                        <p>{pod?.deadline ? formatDate(pod.deadline) : 'No deadline set'}</p>
                      </div>
                    </div>
                    
                    <div className={styles.detailCard}>
                      <div className={styles.detailIcon}>
                        <Target size={20} />
                      </div>
                      <div className={styles.detailContent}>
                        <h3>Category</h3>
                        <p>{pod?.category ? pod.category.charAt(0).toUpperCase() + pod.category.slice(1) : 'Not specified'}</p>
                      </div>
                    </div>
                    
                    <div className={styles.detailCard}>
                      <div className={styles.detailIcon}>
                        <Briefcase size={20} />
                      </div>
                      <div className={styles.detailContent}>
                        <h3>Format</h3>
                        <p>{pod?.format ? pod.format.charAt(0).toUpperCase() + pod.format.slice(1) : 'Not specified'}</p>
                      </div>
                    </div>
                    
                    <div className={styles.detailCard}>
                      <div className={styles.detailIcon} style={{ 
                        backgroundColor: pod?.status === 'open' ? 'rgba(52, 211, 153, 0.1)' : 
                                         pod?.status === 'in-progress' ? 'rgba(251, 191, 36, 0.1)' : 
                                         'rgba(156, 163, 175, 0.1)'
                      }}>
                        <Clock size={20} style={{ 
                          color: pod?.status === 'open' ? '#34D399' : 
                                 pod?.status === 'in-progress' ? '#FBBF24' : 
                                 '#9CA3AF'
                        }} />
                      </div>
                      <div className={styles.detailContent}>
                        <h3>Status</h3>
                        <p style={{ 
                          color: pod?.status === 'open' ? '#34D399' : 
                                 pod?.status === 'in-progress' ? '#FBBF24' : 
                                 '#9CA3AF'
                        }}>
                          {pod?.status ? pod.status.charAt(0).toUpperCase() + pod.status.slice(1) : 'Draft'}
                        </p>
                      </div>
                    </div>
                    
                    <div className={styles.detailCard}>
                      <div className={styles.detailIcon}>
                        <Clock size={20} />
                      </div>
                      <div className={styles.detailContent}>
                        <h3>Budget</h3>
                        <p>{pod?.budget || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.descriptionSection}>
                    <h3>Description</h3>
                    <p>{pod?.description || 'No description provided.'}</p>
                  </div>
                  
                  <div className={styles.missionSection}>
                    <h3>Mission Statement</h3>
                    <p>{pod?.mission || 'No mission statement provided.'}</p>
                  </div>
                </div>
              )}
              
              <div className={styles.visibilitySection}>
                <div className={styles.sectionHeader}>
                  <h2>Visibility Settings</h2>
                </div>
                
                <div className={styles.visibilityOptions}>
                  <div className={`${styles.visibilityOption} ${pod?.visibility === 'public' ? styles.selected : ''}`}>
                    <div className={styles.visibilityIcon}>
                      <Globe size={24} />
                    </div>
                    <div className={styles.visibilityContent}>
                      <h3>Public</h3>
                      <p>Visible to everyone in the pod explorer</p>
                    </div>
                    <button 
                      className={styles.visibilityButton}
                      onClick={() => handleVisibilityChange('public')}
                      disabled={pod?.visibility === 'public'}
                    >
                      {pod?.visibility === 'public' ? 'Current' : 'Set as Public'}
                    </button>
                  </div>
                  
                  <div className={`${styles.visibilityOption} ${pod?.visibility === 'private' ? styles.selected : ''}`}>
                    <div className={styles.visibilityIcon}>
                      <Eye size={24} />
                    </div>
                    <div className={styles.visibilityContent}>
                      <h3>Private</h3>
                      <p>Only visible to members and invited users</p>
                    </div>
                    <button 
                      className={styles.visibilityButton}
                      onClick={() => handleVisibilityChange('private')}
                      disabled={pod?.visibility === 'private'}
                    >
                      {pod?.visibility === 'private' ? 'Current' : 'Set as Private'}
                    </button>
                  </div>
                  
                  <div className={`${styles.visibilityOption} ${pod?.visibility === 'unlisted' ? styles.selected : ''}`}>
                    <div className={styles.visibilityIcon}>
                      <EyeOff size={24} />
                    </div>
                    <div className={styles.visibilityContent}>
                      <h3>Unlisted</h3>
                      <p>Only accessible with a direct link</p>
                    </div>
                    <button 
                      className={styles.visibilityButton}
                      onClick={() => handleVisibilityChange('unlisted')}
                      disabled={pod?.visibility === 'unlisted'}
                    >
                      {pod?.visibility === 'unlisted' ? 'Current' : 'Set as Unlisted'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Members Tab */}
          {activeTab === 'members' && (
            <div className={styles.membersTab}>
              <div className={styles.sectionHeader}>
                <h2>Pod Members ({members.length})</h2>
                <button className={styles.addButton}>
                  <UserPlus size={16} />
                  <span>Invite Members</span>
                </button>
              </div>
              
              {members.length === 0 ? (
                <div className={styles.emptyState}>
                  <Users size={32} />
                  <h3>No members yet</h3>
                  <p>Invite members to join your pod</p>
                </div>
              ) : (
                <div className={styles.membersTable}>
                  <div className={styles.tableHeader}>
                    <div className={styles.memberCell}>Member</div>
                    <div className={styles.roleCell}>Role</div>
                    <div className={styles.joinedCell}>Joined</div>
                    <div className={styles.statusCell}>Status</div>
                    <div className={styles.actionsCell}>Actions</div>
                  </div>
                  
                  {members.map(member => (
                    <div key={member._id} className={styles.tableRow}>
                      <div className={styles.memberCell}>
                        <div className={styles.memberAvatar}>
                          {member.user?.profileImage ? (
                            <img src={member.user.profileImage} alt={member.user.name} />
                          ) : (
                            <div className={styles.avatarInitials}>
                              {member.user?.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className={styles.memberInfo}>
                          <h4>{member.user?.name}</h4>
                          <p>{member.user?.email}</p>
                        </div>
                      </div>
                      
                      <div className={styles.roleCell}>
                        <span className={styles.roleBadge}>{member.role}</span>
                      </div>
                      
                      <div className={styles.joinedCell}>
                        {formatDate(member.joinedAt)}
                      </div>
                      
                      <div className={styles.statusCell}>
                        <span className={`${styles.statusBadge} ${styles[member.status || 'active']}`}>
                          {member.status || 'Active'}
                        </span>
                      </div>
                      
                      <div className={styles.actionsCell}>
                        <button 
                          className={styles.removeMemberButton}
                          onClick={() => handleRemoveMember(member._id)}
                        >
                          <UserMinus size={16} />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className={styles.memberStats}>
                <div className={styles.statCard}>
                  <h4>Total Members</h4>
                  <div className={styles.statValue}>{members.length}</div>
                </div>
                
                <div className={styles.statCard}>
                  <h4>Active Members</h4>
                  <div className={styles.statValue}>
                    {members.filter(m => m.status === 'active' || !m.status).length}
                  </div>
                </div>
                
                <div className={styles.statCard}>
                  <h4>Max Capacity</h4>
                  <div className={styles.statValue}>{pod?.maxMembers || 8}</div>
                </div>
                
                <div className={styles.statCard}>
                  <h4>Open Spots</h4>
                  <div className={styles.statValue}>
                    {(pod?.maxMembers || 8) - members.length}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Roles Tab */}
          {activeTab === 'roles' && (
            <div className={styles.rolesTab}>
              <div className={styles.sectionHeader}>
                <h2>Pod Roles ({pod?.rolesNeeded?.length || 0})</h2>
                <button className={styles.addButton}>
                  <PlusCircle size={16} />
                  <span>Add Role</span>
                </button>
              </div>
              
              {!pod?.rolesNeeded || pod.rolesNeeded.length === 0 ? (
                <div className={styles.emptyState}>
                  <Briefcase size={32} />
                  <h3>No roles defined</h3>
                  <p>Add roles to your pod to attract the right members</p>
                </div>
              ) : (
                <div className={styles.rolesGrid}>
                  {pod.rolesNeeded.map((role, index) => (
                    <div key={index} className={styles.roleCard}>
                      <div className={styles.roleHeader}>
                        <h3>{role.title}</h3>
                        <div className={styles.roleActions}>
                          <button className={styles.editRoleButton}>
                            <Edit3 size={16} />
                          </button>
                          <button className={styles.deleteRoleButton}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      
                      <p className={styles.roleDescription}>
                        {role.description}
                      </p>
                      
                      {role.requirements && role.requirements.length > 0 && (
                        <div className={styles.requirementsList}>
                          <h4>Requirements:</h4>
                          <ul>
                          {role.requirements.map((req, reqIndex) => (
                              <li key={reqIndex}>{req}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <div className={styles.roleMetadata}>
                        {role.compensation && (
                          <div className={styles.metaItem}>
                            <Clock size={14} />
                            <span>{role.compensation}</span>
                          </div>
                        )}
                        
                        {role.timeCommitment && (
                          <div className={styles.metaItem}>
                            <Clock size={14} />
                            <span>{role.timeCommitment}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className={styles.applicantsInfo}>
                        <span>0 applicants</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Advanced Tab */}
          {activeTab === 'advanced' && (
            <div className={styles.advancedTab}>
              <div className={styles.sectionHeader}>
                <h2>Advanced Settings</h2>
              </div>
              
              <div className={styles.dangerZone}>
                <div className={styles.dangerZoneHeader}>
                  <h3>Danger Zone</h3>
                  <p>These actions cannot be undone. Please proceed with caution.</p>
                </div>
                
                <div className={styles.dangerActions}>
                  <div className={styles.dangerAction}>
                    <div className={styles.dangerInfo}>
                      <h4>Archive Pod</h4>
                      <p>Archive this pod to hide it from the public but keep all the data</p>
                    </div>
                    <button 
                      className={styles.archiveButton}
                      onClick={handleArchivePod}
                    >
                      <Archive size={16} />
                      <span>Archive Pod</span>
                    </button>
                  </div>
                  
                  <div className={styles.dangerAction}>
                    <div className={styles.dangerInfo}>
                      <h4>Delete Pod</h4>
                      <p>Permanently delete this pod and all associated data</p>
                    </div>
                    <button className={styles.deleteButton}>
                      <Trash2 size={16} />
                      <span>Delete Pod</span>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className={styles.exportSection}>
                <div className={styles.sectionHeader}>
                  <h3>Export Data</h3>
                </div>
                
                <div className={styles.exportOptions}>
                  <button className={styles.exportButton}>
                    <span>Export Pod Data</span>
                  </button>
                  
                  <button className={styles.exportButton}>
                    <span>Export Member List</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PodManagementPage;