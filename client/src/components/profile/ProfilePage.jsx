import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Shield, 
  Edit, 
  Settings,
  MapPin,
  Briefcase,
  Github,
  Globe,
  Twitter,
  Linkedin,
  Award,
  Star,
  CheckCircle,
  Clock,
  Target,
  AlertCircle,
  Activity,
  FileText
} from 'lucide-react';
import { getCurrentProfile, getProfileByUserId } from '../../services/profileService';
import styles from './ProfilePage.module.scss';

// Helper function to get initials from name
const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

// Helper function to safely get user data from profile
const getUserData = (profile) => {
  // Handle different profile structures
  if (profile?.profile?.user) {
    return profile.profile.user;
  } else if (profile?.user) {
    return profile.user;
  } else if (profile) {
    // If profile is the user object itself
    return profile;
  }
  return null;
};

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return 'No date';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Helper function to safely get profile data
const getProfileData = (profile) => {
  if (profile?.profile) {
    return profile.profile;
  }
  return profile || {};
};

const ProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isCurrentUserProfile, setIsCurrentUserProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

// Contribution state
const [userContributions, setUserContributions] = useState([]);
const [contributionFilter, setContributionFilter] = useState('all');
const [contributionLoading, setContributionLoading] = useState(false);
  
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


    // Fetch contributions when the tab changes to 'contributions'
useEffect(() => {
  if (activeTab === 'contributions') {
    fetchUserContributions();
  }
}, [activeTab, userId]);

// Refetch when filter changes
useEffect(() => {
  if (activeTab === 'contributions') {
    fetchUserContributions();
  }
}, [contributionFilter]);
  
  useEffect(() => {
    const fetchProfile = async () => {
        try {
          setLoading(true);
          setError(null);
          
          // Get current user from localStorage
          const userData = localStorage.getItem('user');
          if (userData) {
            try {
              const parsedUser = JSON.parse(userData);
              setCurrentUser(parsedUser);
              
              console.log('Current user from localStorage:', parsedUser);
              console.log('Token:', localStorage.getItem('token'));
              
              // Check if this is the current user's profile
              if (!userId || userId === parsedUser._id) {
                setIsCurrentUserProfile(true);
                console.log('Fetching current user profile...');
                const profileData = await getCurrentProfile();
                console.log('Profile data received:', profileData);
                setProfile(profileData);
              } else {
                setIsCurrentUserProfile(false);
                console.log(`Fetching profile for user ID: ${userId}`);
                const profileData = await getProfileByUserId(userId);
                console.log('Profile data received:', profileData);
                setProfile(profileData);
              }
            } catch (err) {
              console.error('Error fetching profile:', err);
              
              if (err.response) {
                console.error('Error response data:', err.response.data);
                console.error('Error response status:', err.response.status);
                
                if (err.response.status === 404) {
                  setError('Profile not found. You may need to complete your profile.');
                } else if (err.response.status === 401) {
                  setError('Authentication error. Please log in again.');
                  setTimeout(() => navigate('/login'), 2000);
                } else {
                  setError(`Server error: ${err.response.data.message || 'Unknown error'}`);
                }
              } else if (err.request) {
                console.error('Error request:', err.request);
                setError('No response from server. Please check if the backend is running.');
              } else {
                console.error('Error message:', err.message);
                setError(`Error: ${err.message}`);
              }
            }
          } else {
            if (userId) {
              try {
                console.log(`Fetching profile for public user ID: ${userId}`);
                const profileData = await getProfileByUserId(userId);
                console.log('Profile data received:', profileData);
                setProfile(profileData);
              } catch (err) {
                console.error('Error fetching profile by ID:', err);
                setError('Profile not found or you don\'t have permission to view it.');
              }
            } else {
              console.log('No user data found, redirecting to login');
              setError('User not authenticated');
              navigate('/login');
            }
          }
          
          setLoading(false);
        } catch (err) {
          console.error('Unexpected error in fetchProfile:', err);
          setError('An unexpected error occurred');
          setLoading(false);
        }
      };
    
    fetchProfile();
  }, [userId, navigate]);
  
  if (loading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading profile...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={styles.errorState}>
        <div className={styles.errorIcon}>
          <AlertCircle size={40} />
        </div>
        <h3>Error Loading Profile</h3>
        <p>{error}</p>
        <button 
          className={styles.retryButton}
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  
  
  if (!profile) {
    return (
      <div className={styles.notFoundState}>
        <div className={styles.notFoundIcon}>
          <User size={40} />
        </div>
        <h3>Profile Not Found</h3>
        <p>The profile you're looking for doesn't exist or you don't have permission to view it.</p>
        <button 
          className={styles.backButton}
          onClick={() => navigate('/')}
        >
          Go Home
        </button>
      </div>
    );
  }

  // Fetch user contributions
const fetchUserContributions = async () => {
  try {
    if (!userId) return;
    
    setContributionLoading(true);
    const token = localStorage.getItem('token');
    
    if (!token) {
      if (!isCurrentUserProfile) {
        // For public viewing without login
        setContributionLoading(false);
        return;
      }
      throw new Error('Authentication required');
    }
    
    // Construct the query URL with the filter
    let url = `http://localhost:5000/api/gamification/contributions?userId=${userId}`;
    if (contributionFilter !== 'all') {
      url += `&type=${contributionFilter}`;
    }
    
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    setUserContributions(response.data);
    setContributionLoading(false);
  } catch (error) {
    console.error('Error fetching user contributions:', error);
    setContributionLoading(false);
  }
};

  // Get user and profile data safely
  const userData = getUserData(profile);
  const profileData = getProfileData(profile);
  
  // Provide fallback values
  const displayName = profileData.displayName || userData?.name || 'User';
  const userRole = userData?.role || 'member';
  const userReputation = userData?.reputation || 0;
  
  return (
    <div className={styles.profilePage}>
      <div className={styles.gridBackground}></div>
      <div className={styles.glowEffect1}></div>
      <div className={styles.glowEffect2}></div>
      
      <motion.div 
        className={styles.profileContainer}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Profile Header */}
        <motion.div 
          className={styles.profileHeader}
          variants={itemVariants}
        >
          <div className={styles.coverImage} style={profileData.coverImage ? { backgroundImage: `url(${profileData.coverImage})` } : {}}>
            <div className={styles.coverOverlay}></div>
          </div>
          
          <div className={styles.profileHeaderContent}>
            <div className={styles.profileImageContainer}>
              {profileData.profileImage ? (
                <img 
                  src={profileData.profileImage} 
                  alt={displayName} 
                  className={styles.profileImage}
                />
              ) : (
                <div className={styles.profileInitials}>
                  {getInitials(displayName)}
                </div>
              )}
            </div>
            
            <div className={styles.profileInfo}>
              <div className={styles.nameSection}>
                <h1 className={styles.displayName}>{displayName}</h1>
                
                <div className={styles.roleBadge}>
                  <Shield size={14} />
                  <span>{userRole.charAt(0).toUpperCase() + userRole.slice(1)}</span>
                </div>
                
                {userReputation > 0 && (
                  <div className={styles.reputationBadge}>
                    <Star size={14} />
                    <span>{userReputation} XP</span>
                  </div>
                )}
              </div>
              
              {profileData.headline && (
                <p className={styles.headline}>{profileData.headline}</p>
              )}
              
              <div className={styles.statsRow}>
                <div className={styles.statItem}>
                  <Target size={16} />
                  <span><strong>{profileData.stats?.podsCreated || 0}</strong> Pods Created</span>
                </div>
                
                <div className={styles.statItem}>
                  <Briefcase size={16} />
                  <span><strong>{profileData.stats?.podsJoined || 0}</strong> Pods Joined</span>
                </div>
                
                <div className={styles.statItem}>
                  <CheckCircle size={16} />
                  <span><strong>{profileData.stats?.tasksCompleted || 0}</strong> Tasks Completed</span>
                </div>
                
                <div className={styles.statItem}>
                  <Award size={16} />
                  <span><strong>{(profileData.experience?.tier || 'bronze').charAt(0).toUpperCase() + (profileData.experience?.tier || 'bronze').slice(1)}</strong> Tier</span>
                </div>
              </div>
            </div>
            
            {isCurrentUserProfile && (
              <div className={styles.profileActions}>
                <button 
                  className={styles.editProfileButton}
                  onClick={() => navigate('/settings/profile')}
                >
                  <Edit size={16} />
                  <span>Edit Profile</span>
                </button>
                
                <button 
                  className={styles.settingsButton}
                  onClick={() => navigate('/settings')}
                >
                  <Settings size={16} />
                </button>
              </div>
            )}
          </div>
        </motion.div>
        
        {/* Profile Navigation */}
        <motion.div 
          className={styles.profileNavigation}
          variants={itemVariants}
        >
          <div className={styles.navTabs}>
            <button 
              className={`${styles.navTab} ${activeTab === 'overview' ? styles.active : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            
            <button 
              className={`${styles.navTab} ${activeTab === 'pods' ? styles.active : ''}`}
              onClick={() => setActiveTab('pods')}
            >
              Pods
            </button>
            
            <button 
              className={`${styles.navTab} ${activeTab === 'portfolio' ? styles.active : ''}`}
              onClick={() => setActiveTab('portfolio')}
            >
              Portfolio
            </button>
            
            <button 
              className={`${styles.navTab} ${activeTab === 'contributions' ? styles.active : ''}`}
              onClick={() => setActiveTab('contributions')}
            >
              Contributions
            </button>
          </div>
        </motion.div>
        
        {/* Profile Content */}
        <motion.div 
          className={styles.profileContent}
          variants={itemVariants}
        >
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className={styles.overviewTab}>
              <div className={styles.twoColumnLayout}>
                <div className={styles.mainColumn}>
                  <div className={styles.profileSection}>
                    <h2 className={styles.sectionTitle}>About</h2>
                    <div className={styles.bioContent}>
                      {profileData.bio ? (
                        <p>{profileData.bio}</p>
                      ) : (
                        <p className={styles.emptyState}>
                          {isCurrentUserProfile 
                            ? 'You haven\'t added a bio yet. Tell others about yourself and your expertise.'
                            : `${displayName} hasn't added a bio yet.`}
                        </p>
                      )}
                      
                      {isCurrentUserProfile && !profileData.bio && (
                        <button 
                          className={styles.addBioButton}
                          onClick={() => navigate('/settings/profile')}
                        >
                          Add Bio
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className={styles.profileSection}>
                    <h2 className={styles.sectionTitle}>Skills</h2>
                    <div className={styles.skillsContainer}>
                      {profileData.skills && profileData.skills.length > 0 ? (
                        <div className={styles.skillsList}>
                          {profileData.skills.map((skill, index) => (
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
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className={styles.emptyState}>
                          {isCurrentUserProfile 
                            ? 'You haven\'t added any skills yet. Add skills to showcase your expertise.'
                            : `${displayName} hasn't added any skills yet.`}
                        </div>
                      )}
                      
                      {isCurrentUserProfile && (!profileData.skills || profileData.skills.length === 0) && (
                        <button 
                          className={styles.addButton}
                          onClick={() => navigate('/settings/profile')}
                        >
                          Add Skills
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className={styles.profileSection}>
                    <h2 className={styles.sectionTitle}>Recent Activity</h2>
                    <div className={styles.activityFeed}>
                      <div className={styles.emptyState}>
                        No recent activity to display.
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className={styles.sideColumn}>
                  <div className={styles.profileCard}>
                    <h3 className={styles.cardTitle}>Experience</h3>
                    <div className={styles.experienceProgress}>
                      <div className={styles.tierBadge} style={{
                        backgroundColor: (profileData.experience?.tier || 'bronze') === 'bronze' ? 'rgba(205, 127, 50, 0.1)' :
                                         (profileData.experience?.tier || 'bronze') === 'silver' ? 'rgba(192, 192, 192, 0.1)' :
                                         (profileData.experience?.tier || 'bronze') === 'gold' ? 'rgba(232, 197, 71, 0.1)' :
                                         'rgba(229, 231, 235, 0.1)',
                        color: (profileData.experience?.tier || 'bronze') === 'bronze' ? '#CD7F32' :
                              (profileData.experience?.tier || 'bronze') === 'silver' ? '#C0C0C0' :
                              (profileData.experience?.tier || 'bronze') === 'gold' ? '#E8C547' :
                              '#E5E7EB'
                      }}>
                        <span className={styles.tierName}>{(profileData.experience?.tier || 'bronze').toUpperCase()}</span>
                        <span className={styles.tierLevel}>Level {profileData.experience?.level || 1}</span>
                      </div>
                      
                      <div className={styles.xpProgressBar}>
                        <div 
                          className={styles.xpFill}
                          style={{ width: `${((profileData.experience?.currentXP || 0) % 1000) / 10}%` }}
                        ></div>
                      </div>
                      
                      <div className={styles.xpStats}>
                        <span>{profileData.experience?.currentXP || 0} XP</span>
                        <span>{1000 - ((profileData.experience?.currentXP || 0) % 1000)} XP to next level</span>
                      </div>
                    </div>
                  </div>
                  
                  {profileData.badges && profileData.badges.length > 0 && (
                    <div className={styles.profileCard}>
                      <h3 className={styles.cardTitle}>Badges</h3>
                      <div className={styles.badgesList}>
                        {profileData.badges.map((badge, index) => (
                          <div key={index} className={styles.badgeItem}>
                            <div 
                              className={styles.badgeIcon}
                              dangerouslySetInnerHTML={{ __html: badge.icon }}
                            ></div>
                            <div className={styles.badgeInfo}>
                              <span className={styles.badgeName}>{badge.name}</span>
                              <span className={styles.badgeDescription}>{badge.description}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className={styles.profileCard}>
                    <h3 className={styles.cardTitle}>Social Links</h3>
                    {profileData.socialLinks && (
                      Object.values(profileData.socialLinks).some(link => link) ? (
                        <div className={styles.socialLinks}>
                          {profileData.socialLinks.website && (
                            <a 
                              href={profileData.socialLinks.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className={styles.socialLink}
                            >
                              <Globe size={16} />
                              <span>Website</span>
                            </a>
                          )}
                          
                          {profileData.socialLinks.github && (
                            <a 
                              href={profileData.socialLinks.github} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className={styles.socialLink}
                            >
                             <Github size={16} />
                              <span>GitHub</span>
                            </a>
                          )}
                          
                          {profileData.socialLinks.linkedin && (
                            <a 
                              href={profileData.socialLinks.linkedin} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className={styles.socialLink}
                            >
                              <Linkedin size={16} />
                              <span>LinkedIn</span>
                            </a>
                          )}
                          
                          {profileData.socialLinks.twitter && (
                            <a 
                              href={profileData.socialLinks.twitter} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className={styles.socialLink}
                            >
                              <Twitter size={16} />
                              <span>Twitter</span>
                            </a>
                          )}
                        </div>
                      ) : (
                        <div className={styles.emptyState}>
                          {isCurrentUserProfile 
                            ? 'You haven\'t added any social links yet.'
                            : `${displayName} hasn't added any social links yet.`}
                        </div>
                      )
                    )}
                    
                    {isCurrentUserProfile && (!profileData.socialLinks || !Object.values(profileData.socialLinks).some(link => link)) && (
                      <button 
                        className={styles.addButton}
                        onClick={() => navigate('/settings/profile')}
                      >
                        Add Social Links
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Pods Tab */}
          {activeTab === 'pods' && (
            <div className={styles.podsTab}>
              <div className={styles.tabHeader}>
                <h2>Pods</h2>
              </div>
              
              <div className={styles.podsFilter}>
                <button className={`${styles.filterButton} ${styles.active}`}>All Pods</button>
                <button className={styles.filterButton}>Created</button>
                <button className={styles.filterButton}>Joined</button>
                <button className={styles.filterButton}>Archived</button>
              </div>
              
              <div className={styles.podsGrid}>
                <div className={styles.emptyState}>
                  {isCurrentUserProfile 
                    ? 'You haven\'t joined or created any pods yet. Explore pods to get started.'
                    : `${displayName} hasn't joined or created any pods yet.`}
                </div>
                
                {isCurrentUserProfile && (
                  <button 
                    className={styles.explorePodButton}
                    onClick={() => navigate('/pods/explore')}
                  >
                    Explore Pods
                  </button>
                )}
              </div>
            </div>
          )}
          
          {/* Portfolio Tab */}
          {activeTab === 'portfolio' && (
            <div className={styles.portfolioTab}>
              <div className={styles.tabHeader}>
                <h2>Portfolio</h2>
                {isCurrentUserProfile && (
                  <button 
                    className={styles.addPortfolioButton}
                    onClick={() => navigate('/settings/portfolio/add')}
                  >
                    Add Portfolio Item
                  </button>
                )}
              </div>
              
              {profileData.portfolio && profileData.portfolio.length > 0 ? (
                <div className={styles.portfolioGrid}>
                  {profileData.portfolio.map((item, index) => (
                    <div key={index} className={styles.portfolioItem}>
                      <div className={styles.portfolioItemImage}>
                        {item.images && item.images.length > 0 ? (
                          <img src={item.images[0]} alt={item.title} />
                        ) : (
                          <div className={styles.placeholderImage}>
                            <Briefcase size={32} />
                          </div>
                        )}
                        {item.featured && (
                          <div className={styles.featuredBadge}>
                            <Star size={12} />
                            <span>Featured</span>
                          </div>
                        )}
                      </div>
                      
                      <div className={styles.portfolioItemContent}>
                        <h3 className={styles.portfolioItemTitle}>{item.title}</h3>
                        <p className={styles.portfolioItemDescription}>{item.description}</p>
                        
                        {item.link && (
                          <a 
                            href={item.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={styles.portfolioItemLink}
                          >
                            <Globe size={14} />
                            <span>View Project</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  {isCurrentUserProfile 
                    ? 'You haven\'t added any portfolio items yet. Showcase your best work!'
                    : `${displayName} hasn't added any portfolio items yet.`}
                </div>
              )}
              
              {isCurrentUserProfile && (!profileData.portfolio || profileData.portfolio.length === 0) && (
                <button 
                  className={styles.addButton}
                  onClick={() => navigate('/settings/portfolio/add')}
                >
                  Add Portfolio Item
                </button>
              )}
            </div>
          )}
          
          {/* Contributions Tab */}
{activeTab === 'contributions' && (
  <div className={styles.contributionsTab}>
    <div className={styles.tabHeader}>
      <h2>Contributions</h2>
      <div className={styles.tabActions}>
        <div className={styles.filterContainer}>
          <select 
            className={styles.filterSelect}
            value={contributionFilter}
            onChange={(e) => setContributionFilter(e.target.value)}
          >
            <option value="all">All Activities</option>
            <option value="task_completed">Tasks Completed</option>
            <option value="task_created">Tasks Created</option>
            <option value="resource_uploaded">Resources Uploaded</option>
            <option value="milestone_completed">Milestones Completed</option>
          </select>
        </div>
      </div>
    </div>
    
    <div className={styles.contributionStatsRow}>
      <div className={styles.contributionStatCard}>
        <div className={styles.statValue}>{profileData.stats?.tasksCompleted || 0}</div>
        <div className={styles.statLabel}>Tasks Completed</div>
      </div>
      
      <div className={styles.contributionStatCard}>
        <div className={styles.statValue}>{profileData.stats?.contributionCount || 0}</div>
        <div className={styles.statLabel}>Total Contributions</div>
      </div>
      
      <div className={styles.contributionStatCard}>
        <div className={styles.statValue}>{profileData.stats?.successRate || 0}%</div>
        <div className={styles.statLabel}>Success Rate</div>
      </div>
      
      <div className={styles.contributionStatCard}>
        <div className={styles.statValue}>{userContributions.reduce((total, contrib) => total + (contrib.xpGained || 0), 0)}</div>
        <div className={styles.statLabel}>Total XP Earned</div>
      </div>
    </div>
    
    <div className={styles.contributionHistory}>
      <h3 className={styles.subSectionTitle}>Contribution History</h3>
      
      <div className={styles.contributionTimeline}>
        {contributionLoading ? (
          <div className={styles.loadingState}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading contributions...</p>
          </div>
        ) : userContributions.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>
              <Activity size={32} />
            </div>
            <p>No contribution history available.</p>
            {isCurrentUserProfile && (
              <p>Start contributing to pods to build your profile!</p>
            )}
          </div>
        ) : (
          <div className={styles.contributionItems}>
            {userContributions.map((contribution, index) => (
              <div key={contribution._id || index} className={styles.contributionItem}>
                <div className={styles.contributionTypeIcon}>
                  {(() => {
                    switch(contribution.type) {
                      case 'task_completed': return <CheckCircle size={18} />;
                      case 'task_created': return <Activity size={18} />;
                      case 'resource_uploaded': return <FileText size={18} />;
                      case 'milestone_completed': return <Target size={18} />;
                      default: return <Activity size={18} />;
                    }
                  })()}
                </div>
                <div className={styles.contributionContent}>
                  <div className={styles.contributionHeader}>
                    <span className={styles.contributionAction}>
                      {(() => {
                        switch(contribution.type) {
                          case 'task_completed': return 'Completed a task';
                          case 'task_created': return 'Created a task';
                          case 'resource_uploaded': return 'Uploaded a resource';
                          case 'milestone_completed': return 'Completed a milestone';
                          default: return contribution.type.replace(/_/g, ' ');
                        }
                      })()}
                    </span>
                    <span className={styles.contributionPod}>
                      in <a href={`/pod-environment/${contribution.podId}`}>{contribution.podTitle || 'Pod'}</a>
                    </span>
                  </div>
                  <div className={styles.contributionDetails}>
                    <h4>{contribution.title || contribution.object?.title || 'Untitled'}</h4>
                    <p>{contribution.description || contribution.object?.description || ''}</p>
                  </div>
                  <div className={styles.contributionMeta}>
                    <span className={styles.contributionTime}>{formatDate(contribution.createdAt)}</span>
                    {contribution.xpGained && (
                      <span className={styles.xpGained}>
                        <Award size={14} />
                        +{contribution.xpGained} XP
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
)}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;