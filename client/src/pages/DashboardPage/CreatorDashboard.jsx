import React, { useEffect, useState } from 'react';
import styles from './CreatorDashboard.module.scss';
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
  PlusCircle, 
  Eye, 
  MessageSquare, 
  BarChart2, 
  Bell,
  ArrowRight
} from 'lucide-react';
import axios from 'axios';

const CreatorDashboard = () => {
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [pods, setPods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setIsPro(parsedUser.planType === 'pro');
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [appsRes, podsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/applications', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:5000/api/pods', {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);

        const userPods = podsRes.data.filter(p => p.creator === JSON.parse(userData)._id);
        setApplications(appsRes.data);
        setPods(userPods);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate dashboard metrics
  const totalApplicants = applications.length > 0 
    ? new Set(applications.map(app => app.applicantName)).size 
    : 0;
  
  const pendingApplications = applications.filter(app => app.status === 'Pending').length;
  
  const totalRolesOpen = pods.reduce((total, pod) => {
    const filledRoles = applications.filter(
      app => app.podId === pod._id && app.status === 'Accepted'
    ).length;
    const totalRoles = pod.rolesNeeded ? pod.rolesNeeded.length : 0;
    return total + (totalRoles - filledRoles);
  }, 0);
  
  const podViews = pods.reduce((total, pod) => total + (pod.viewCount || 0), 0);
  
  // For XP progress - assuming 450 XP as in your example
  const userXP = 450;
  const xpToNextLevel = 1000;
  const xpProgress = (userXP / xpToNextLevel) * 100;
  
  // Calculate pod with most applications
  const podApplicationCounts = pods.map(pod => {
    const appCount = applications.filter(app => app.podId === pod._id).length;
    return { id: pod._id, title: pod.title, count: appCount };
  }).sort((a, b) => b.count - a.count);
  
  const topPod = podApplicationCounts.length > 0 ? podApplicationCounts[0] : null;
  
  // Role fill rate
  const roleFillRate = pods.length > 0 
    ? Math.round((applications.filter(app => app.status === 'Accepted').length / 
      pods.reduce((total, pod) => total + (pod.rolesNeeded ? pod.rolesNeeded.length : 0), 0)) * 100) 
    : 0;

  // Get recent pod updates (for simplicity, using the 3 most recent pods)
  const recentPods = [...pods].sort((a, b) => 
    new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
  ).slice(0, 3);

  // Get recent applications
  const recentApplications = [...applications]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // Pod fill progress
  const calculatePodFillProgress = (podId) => {
    const pod = pods.find(p => p._id === podId);
    if (!pod) return '0/0';
    
    const totalRoles = pod.rolesNeeded ? pod.rolesNeeded.length : 0;
    const filledRoles = applications.filter(
      app => app.podId === podId && app.status === 'Accepted'
    ).length;
    
    return `${filledRoles}/${totalRoles}`;
  };

  // Status badges
  const getStatusBadge = (status) => {
    switch(status) {
      case 'Accepted':
        return styles.statusAccepted;
      case 'Rejected':
        return styles.statusRejected;
      case 'Pending':
        return styles.statusPending;
      default:
        return '';
    }
  };
  
  if (isLoading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className={styles.creatorDashboard}>
      <div className={styles.gridBackground}></div>
      
      {/* Floating decorative elements */}
      <div className={`${styles.floatingShape} ${styles.shape1}`}></div>
      <div className={`${styles.floatingShape} ${styles.shape2}`}></div>
      
      <div className={styles.dashboardHeader}>
        <div className={styles.headerLeft}>
          <h1>
            Welcome back, <span className={styles.highlight}>{user?.name || 'Creator'}</span>
          </h1>
          <div className={styles.userMeta}>
            <div className={styles.planBadge} style={{ 
              backgroundColor: isPro ? 'rgba(232, 197, 71, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              color: isPro ? '#E8C547' : '#fff'
            }}>
              {isPro ? 'Pro Plan' : 'Free Plan'}
            </div>
            <div className={styles.trustLevel}>
              <Shield size={14} />
              <span>Trust Level: {userXP >= 500 ? 'Gold' : userXP >= 200 ? 'Silver' : 'Bronze'}</span>
            </div>
          </div>
        </div>
        
        <div className={styles.headerRight}>
          <div className={styles.notificationBell}>
            <Bell size={20} />
            <span className={styles.notificationCount}>3</span>
          </div>
          
          <button className={styles.createPodButton}>
            <PlusCircle size={18} />
            <span>Create New Pod</span>
          </button>
        </div>
      </div>

      {/* Live Stats Cards */}
      <section className={styles.statsSection}>
        <h2 className={styles.sectionTitle}>Live Stats</h2>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIconContainer} style={{ backgroundColor: 'rgba(232, 197, 71, 0.1)' }}>
              <Briefcase size={24} style={{ color: '#E8C547' }} />
            </div>
            <div>
              <h3>{pods.length}</h3>
              <p>Total Pods Created</p>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIconContainer} style={{ backgroundColor: 'rgba(78, 205, 196, 0.1)' }}>
              <Users size={24} style={{ color: '#4ECDC4' }} />
            </div>
            <div>
              <h3>{totalRolesOpen}</h3>
              <p>Roles Still Open</p>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIconContainer} style={{ backgroundColor: 'rgba(107, 91, 149, 0.1)' }}>
              <MessageSquare size={24} style={{ color: '#6B5B95' }} />
            </div>
            <div>
              <h3>{applications.length}</h3>
              <p>Applications Received</p>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIconContainer} style={{ backgroundColor: 'rgba(255, 107, 107, 0.1)' }}>
              <Eye size={24} style={{ color: '#FF6B6B' }} />
            </div>
            <div>
              <h3>{podViews}</h3>
              <p>Total Pod Views</p>
            </div>
          </div>
        </div>
      </section>

      {/* XP & Pods Summary Section */}
      <div className={styles.twoColumnSection}>
        {/* XP Progress */}
        <section className={styles.xpSection}>
          <div className={styles.xpCard}>
            <div className={styles.xpHeader}>
              <h3>Your XP Progress</h3>
              <div className={styles.tier}>
                <Star size={14} />
                <span>{userXP >= 800 ? 'Gold Tier' : userXP >= 300 ? 'Silver Tier' : 'Bronze Tier'}</span>
              </div>
            </div>
            
            <div className={styles.xpProgressBar}>
              <div
                className={styles.fill}
                style={{ width: `${xpProgress}%` }}
              />
            </div>
            
            <div className={styles.xpFooter}>
              <span>{userXP} XP</span>
              <span>Next Unlock: {userXP >= 800 ? 'Platinum Tier' : userXP >= 300 ? 'Gold Tier' : 'Silver Tier'} ({xpToNextLevel - userXP} XP needed)</span>
            </div>
            
            <div className={styles.xpBenefits}>
              <div className={styles.benefitItem}>
                <div className={styles.benefitIcon}>
                  <Zap size={16} />
                </div>
                <div className={styles.benefitText}>Higher application prioritization</div>
              </div>
              
              <div className={styles.benefitItem}>
                <div className={styles.benefitIcon}>
                  <Shield size={16} />
                </div>
                <div className={styles.benefitText}>Increased trust score</div>
              </div>
              
              <div className={styles.benefitItem}>
                <div className={styles.benefitIcon}>
                  <Award size={16} />
                </div>
                <div className={styles.benefitText}>Exclusive badges on your profile</div>
              </div>
            </div>
          </div>
        </section>

        {/* Your Pods Section */}
        <section className={styles.yourPodsSection}>
          <div className={styles.sectionHeaderWithAction}>
            <h3>Your Pods</h3>
            <a href="/pods" className={styles.viewAllLink}>
              <span>View All</span>
              <ChevronRight size={16} />
            </a>
          </div>
          
          {pods.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <Briefcase size={32} />
              </div>
              <h4>No pods created yet</h4>
              <p>Create your first pod to start collaborating with talented individuals</p>
              <button className={styles.emptyStateButton}>
                <PlusCircle size={16} />
                <span>Create Pod</span>
              </button>
            </div>
          ) : (
            <div className={styles.podsList}>
              {pods.slice(0, 3).map((pod, index) => (
                <div key={pod._id} className={styles.podItem}>
                  <div className={styles.podHeader}>
                    <h4>{pod.title}</h4>
                    <div className={styles.podMeta}>
                      <div className={styles.podViews}>
                        <Eye size={14} />
                        <span>{pod.viewCount || 0}</span>
                      </div>
                      <div className={styles.podApplications}>
                        <MessageSquare size={14} />
                        <span>{applications.filter(app => app.podId === pod._id).length}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.podProgressSection}>
                    <div className={styles.podProgressLabel}>
                      <span>Roles Filled</span>
                      <span className={styles.podProgressText}>
                        {calculatePodFillProgress(pod._id)}
                      </span>
                    </div>
                    <div className={styles.podProgressBar}>
                      <div 
                        className={styles.podProgressFill} 
                        style={{ 
                          width: `${(applications.filter(
                            app => app.podId === pod._id && app.status === 'Accepted'
                          ).length / (pod.rolesNeeded ? pod.rolesNeeded.length : 1)) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <a href={`/pods/${pod._id}`} className={styles.podDetailsLink}>
                    <span>Manage Pod</span>
                    <ArrowRight size={14} />
                  </a>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Recent Activity Section */}
      <section className={styles.activitySection}>
        <div className={styles.sectionHeaderWithAction}>
          <h3>Recent Activity</h3>
          <div className={styles.activityFilter}>
            <select className={styles.activityFilterSelect}>
              <option value="all">All Activities</option>
              <option value="applications">Applications</option>
              <option value="updates">Pod Updates</option>
            </select>
          </div>
        </div>
        
        <div className={styles.activityFeed}>
          {recentApplications.length === 0 ? (
            <div className={styles.emptyActivity}>
              <Activity size={20} />
              <p>No recent activity to display</p>
            </div>
          ) : (
            recentApplications.map(app => (
              <div key={app._id} className={styles.activityItem}>
                <div className={styles.activityIcon}>
                  <Activity size={18} />
                </div>
                <div className={styles.activityContent}>
                  <div className={styles.activityText}>
                    <strong>{app.applicantName}</strong> applied for <strong>{app.roleApplied}</strong> in{' '}
                    <strong>{app.podTitle}</strong>
                  </div>
                  <div className={styles.activityMeta}>
                    <span className={styles.activityTime}>
                      {new Date(app.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                    <span className={`${styles.activityStatus} ${getStatusBadge(app.status)}`}>
                      {app.status}
                    </span>
                  </div>
                </div>
                <a href={`/applications/${app._id}`} className={styles.activityAction}>
                  <ChevronRight size={16} />
                </a>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Insights (Pro feature) & Roles Sections */}
      <div className={styles.twoColumnSection}>
        {/* Insights Section */}
        <section className={styles.insightsSection}>
          <div className={styles.sectionHeaderWithAction}>
            <h3>
              Insights 
              {!isPro && <span className={styles.proTag}>PRO</span>}
            </h3>
            {!isPro && (
              <button className={styles.upgradePlanButton}>
                <Zap size={14} />
                <span>Upgrade to Pro</span>
              </button>
            )}
          </div>
          
          {!isPro ? (
            <div className={styles.proLockedFeature}>
              <div className={styles.lockedIcon}>
                <Shield size={32} />
              </div>
              <h4>Unlock Pro Insights</h4>
              <p>Upgrade to Pro to access detailed analytics about your pods' performance and engagement.</p>
              <ul className={styles.proFeaturesList}>
                <li>
                  <BarChart2 size={14} />
                  <span>Detailed engagement metrics</span>
                </li>
                <li>
                  <TrendingUp size={14} />
                  <span>Conversion analytics</span>
                </li>
                <li>
                  <Users size={14} />
                  <span>Applicant demographic breakdown</span>
                </li>
              </ul>
              <button className={styles.proFeatureButton}>
                <Zap size={16} />
                <span>Get Pro</span>
              </button>
            </div>
          ) : (
            <div className={styles.insightsGrid}>
              <div className={styles.insightCard}>
                <div className={styles.insightHeader}>
                  <h4>Top Engagement</h4>
                  <TrendingUp size={16} />
                </div>
                <div className={styles.insightContent}>
                  {topPod ? (
                    <>
                      <div className={styles.insightTitle}>{topPod.title}</div>
                      <div className={styles.insightValue}>{topPod.count} applications</div>
                    </>
                  ) : (
                    <div className={styles.insightEmpty}>No data available</div>
                  )}
                </div>
              </div>
              
              <div className={styles.insightCard}>
                <div className={styles.insightHeader}>
                  <h4>Application Rate</h4>
                  <BarChart2 size={16} />
                </div>
                <div className={styles.insightContent}>
                  <div className={styles.insightValue}>{roleFillRate}%</div>
                  <div className={styles.insightDescription}>
                    of all available roles received applications
                  </div>
                </div>
              </div>
              
              <div className={styles.insightCard}>
                <div className={styles.insightHeader}>
                  <h4>Conversion Rate</h4>
                  <Activity size={16} />
                </div>
                <div className={styles.insightContent}>
                  <div className={styles.insightValue}>
                    {applications.length > 0 ? 
                      Math.round((applications.filter(app => app.status === 'Accepted').length / applications.length) * 100) : 0}%
                  </div>
                  <div className={styles.insightDescription}>
                    applications accepted
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Roles in Demand Section */}
        <section className={styles.rolesSection}>
          <div className={styles.sectionHeaderWithAction}>
            <h3>Top Roles in Demand</h3>
            <a href="/roles-data" className={styles.viewAllLink}>
              <span>Explore Roles</span>
              <ChevronRight size={16} />
            </a>
          </div>
          
          <div className={styles.rolesContainer}>
            {[
              { role: 'Frontend Developer', count: 12 },
              { role: 'Product Manager', count: 9 },
              { role: 'UX Designer', count: 7 },
              { role: 'Backend Engineer', count: 5 },
              { role: 'Community Manager', count: 4 },
            ].map((r, idx) => (
              <div key={idx} className={styles.roleItem}>
                <div className={styles.roleInfo}>
                  <span className={styles.roleName}>{r.role}</span>
                  <span className={styles.roleDemand} style={{
                    backgroundColor: 
                      idx === 0 ? 'rgba(232, 197, 71, 0.1)' : 
                      idx === 1 ? 'rgba(78, 205, 196, 0.1)' : 
                      idx === 2 ? 'rgba(107, 91, 149, 0.1)' : 
                      idx === 3 ? 'rgba(255, 107, 107, 0.1)' : 
                      'rgba(255, 255, 255, 0.1)',
                    color:
                      idx === 0 ? '#E8C547' : 
                      idx === 1 ? '#4ECDC4' : 
                      idx === 2 ? '#6B5B95' : 
                      idx === 3 ? '#FF6B6B' : 
                      '#ffffff'
                  }}>
                    <span>{r.count} pods</span>
                  </span>
                </div>
                <div className={styles.roleTrend} style={{
                  color: 
                    idx <= 1 ? '#4ECDC4' : 
                    idx >= 4 ? '#FF6B6B' : 
                    '#E8C547'
                }}>
                  {idx <= 1 ? <TrendingUp size={16} /> : idx >= 4 ? <i>↓</i> : <i>→</i>}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Quick Actions Section */}
      <section className={styles.quickActionsSection}>
        <h3>Quick Actions</h3>
        
        <div className={styles.quickActionsGrid}>
          <a href="/pods" className={styles.actionCard}>
            <div className={styles.actionIcon}>
              <Briefcase size={24} />
            </div>
            <div className={styles.actionText}>View All Pods</div>
          </a>
          
          <a href="/applications" className={styles.actionCard}>
            <div className={styles.actionIcon}>
              <MessageSquare size={24} />
            </div>
            <div className={styles.actionText}>Manage Applications</div>
          </a>
          
          {!isPro ? (
            <a href="/pricing" className={styles.actionCard} style={{ backgroundColor: 'rgba(232, 197, 71, 0.08)' }}>
              <div className={styles.actionIcon} style={{ color: '#E8C547' }}>
                <Zap size={24} />
              </div>
              <div className={styles.actionText}>Upgrade Plan</div>
            </a>
          ) : (
            <a href="/settings" className={styles.actionCard}>
              <div className={styles.actionIcon}>
                <Settings size={24} />
              </div>
              <div className={styles.actionText}>Account Settings</div>
            </a>
          )}
          
          <a href="/help" className={styles.actionCard}>
            <div className={styles.actionIcon}>
              <i>?</i>
            </div>
            <div className={styles.actionText}>Help & Tutorials</div>
          </a>
        </div>
      </section>
    </div>
  );
};

export default CreatorDashboard;