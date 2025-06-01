import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './PodListPage.module.scss';
import { 
  Briefcase, 
  Clock, 
  Users, 
  Activity, 
  TrendingUp, 
  Award, 
  Star, 
  Shield, 
  Zap, 
  ChevronRight, 
  Settings, 
  Search, 
  Eye, 
  MessageSquare, 
  BarChart2, 
  Bell,
  ArrowRight,
  Filter,
  SortDesc,
  PlusCircle,
  ArrowLeft
} from 'lucide-react';

const PodListPage = () => {
  const [user, setUser] = useState(null);
  const [pods, setPods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    const fetchPods = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        let response;
        const userRole = JSON.parse(userData).role?.toLowerCase();
        
        // Choose the appropriate endpoint based on the user's role
        if (userRole === 'creator') {
          // For creators, fetch the pods they created
          try {
            response = await axios.get('http://localhost:5000/api/creator/pods', {
              headers: { Authorization: `Bearer ${token}` },
            });
          } catch (err) {
            console.log('Trying fallback endpoint for creator pods');
            response = await axios.get('http://localhost:5000/api/pods/creator-pods', {
              headers: { Authorization: `Bearer ${token}` },
            });
          }
        } else {
          // For contributors, fetch the pods they've joined
          response = await axios.get('http://localhost:5000/api/pods/user-memberships', {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          // Transform memberships data to match the expected pod structure
          if (response.data) {
            response.data = response.data.map(membership => ({
              ...membership.pod,
              membershipId: membership._id,
              role: membership.role,
              joinedAt: membership.joinedAt
            }));
          }
        }

        if (response.data) {
          console.log('Pods fetched:', response.data);
          setPods(response.data);
        }
      } catch (err) {
        console.error('Error fetching pods:', err);
        setError('Failed to load pods. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPods();
  }, [navigate]);

  // Filter and sort the pods
  const filteredPods = pods.filter(pod => {
    // Apply status filter
    if (filterStatus !== 'all' && pod.status !== filterStatus) {
      return false;
    }
    
    // Apply search filter
    if (searchQuery && !pod.title?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Sort the filtered pods
  const sortedPods = [...filteredPods].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now());
      case 'oldest':
        return new Date(a.createdAt || Date.now()) - new Date(b.createdAt || Date.now());
      case 'title':
        return (a.title || '').localeCompare(b.title || '');
      case 'activity':
        return (b.viewCount || 0) - (a.viewCount || 0);
      default:
        return 0;
    }
  });

  const isCreator = user?.role?.toLowerCase() === 'creator';

  const getStatusClass = (status) => {
    switch(status) {
      case 'active':
        return styles.statusActive;
      case 'completed':
        return styles.statusCompleted;
      case 'draft':
        return styles.statusDraft;
      default:
        return '';
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading your pods...</p>
      </div>
    );
  }

  return (
    <div className={styles.podListPage}>
      <div className={styles.gridBackground}></div>
      
      {/* Floating decorative elements */}
      <div className={`${styles.floatingShape} ${styles.shape1}`}></div>
      <div className={`${styles.floatingShape} ${styles.shape2}`}></div>
      
      {/* Back to Dashboard button */}
      <div className={styles.backButton}>
        <button 
          className={styles.backToDashboard}
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </button>
      </div>
      
      <div className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <h1>
            {isCreator ? 'My Created Pods' : 'My Joined Pods'}
          </h1>
          <p className={styles.subheading}>
            {isCreator 
              ? 'Manage all the pods you have created' 
              : 'View all the pods you have joined as a contributor'}
          </p>
        </div>
        
        <div className={styles.headerRight}>
          {isCreator && (
            <button 
              className={styles.createPodButton}
              onClick={() => navigate('/create-pod')}
            >
              <PlusCircle size={18} />
              <span>Create New Pod</span>
            </button>
          )}
          
          {!isCreator && (
            <button 
              className={styles.explorePodButton}
              onClick={() => navigate('/explore')}
            >
              <Search size={18} />
              <span>Explore Pods</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters and Search */}
      <div className={styles.filtersBar}>
        <div className={styles.searchContainer}>
          <Search size={18} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search pods..." 
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className={styles.filterControls}>
          <div className={styles.filterGroup}>
            <Filter size={16} />
            <select 
              className={styles.filterSelect}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          
          <div className={styles.filterGroup}>
            <SortDesc size={16} />
            <select 
              className={styles.filterSelect}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title (A-Z)</option>
              <option value="activity">Most Active</option>
            </select>
          </div>
        </div>
      </div>

      {error ? (
        <div className={styles.errorState}>
          <div className={styles.errorIcon}>⚠️</div>
          <h4>Error Loading Pods</h4>
          <p>{error}</p>
          <button 
            className={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      ) : sortedPods.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <Briefcase size={32} />
          </div>
          <h4>{isCreator ? 'No pods created yet' : 'You haven\'t joined any pods yet'}</h4>
          <p>
            {isCreator 
              ? 'Create your first pod to start collaborating with talented individuals' 
              : 'Start exploring and joining pods that match your skills and interests'}
          </p>
          <button 
            className={styles.emptyStateButton}
            onClick={() => navigate(isCreator ? '/create-pod' : '/explore')}
          >
            {isCreator 
              ? <><PlusCircle size={16} /><span>Create Pod</span></> 
              : <><Search size={16} /><span>Explore Pods</span></>}
          </button>
        </div>
      ) : (
        <div className={styles.podGrid}>
          {sortedPods.map((pod) => (
            <div key={pod._id} className={styles.podCard}>
              <div className={styles.podHeader}>
                <h3>{pod.title}</h3>
                <div className={`${styles.statusBadge} ${getStatusClass(pod.status)}`}>
                  {pod.status}
                </div>
              </div>
              
              <p className={styles.podDescription}>
                {pod.description && pod.description.length > 150 
                  ? `${pod.description.substring(0, 150)}...` 
                  : pod.description || 'No description provided'}
              </p>
              
              <div className={styles.podMeta}>
                {isCreator ? (
                  <>
                    <div className={styles.metaItem}>
                      <Users size={14} />
                      <span>{pod.memberCount || 0}/{pod.maxMembers || 8} Members</span>
                    </div>
                    <div className={styles.metaItem}>
                      <MessageSquare size={14} />
                      <span>{pod.pendingApplications || 0} Pending</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={styles.metaItem}>
                      <Users size={14} />
                      <span>Role: {pod.role || 'Contributor'}</span>
                    </div>
                    <div className={styles.metaItem}>
                      <Clock size={14} />
                      <span>Joined: {new Date(pod.joinedAt).toLocaleDateString()}</span>
                    </div>
                  </>
                )}
              </div>
              
              <div className={styles.podActions}>
                {isCreator ? (
                  <>
                    <button 
                      className={styles.actionButton}
                      onClick={() => navigate(`/pods/${pod._id}/manage`)}
                    >
                      <Settings size={14} />
                      <span>Manage</span>
                    </button>
                    <button 
                      className={`${styles.actionButton} ${styles.primaryAction} ${styles.creatorGold}`}
                      onClick={() => navigate(`/pod-environment/${pod._id}`)}
                    >
                      <ArrowRight size={14} />
                      <span>Enter</span>
                    </button>
                  </>
                ) : (
                  <button 
                    className={`${styles.actionButton} ${styles.fullWidth}`}
                    onClick={() => navigate(`/pod-environment/${pod._id}`)}
                  >
                    <ArrowRight size={14} />
                    <span>Enter Pod Environment</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PodListPage;