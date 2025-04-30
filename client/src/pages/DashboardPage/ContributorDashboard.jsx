import React, { useEffect, useState } from 'react';
import styles from './ContributorDashboard.module.scss';
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
  ArrowRight
} from 'lucide-react';
import axios from 'axios';

const ContributorDashboard = () => {
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

        // Filter applications for this contributor
        const userApplications = appsRes.data.filter(
          app => app.applicantId === JSON.parse(userData)._id
        );
        
        setApplications(userApplications);
        setPods(podsRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate dashboard metrics
  const podsJoined = applications.filter(app => app.status === 'Accepted').length;
  const applicationsSent = applications.length;
  const pendingApplications = applications.filter(app => app.status === 'Pending').length;
  
  // For XP progress - assuming 450 XP as in your example
  const userXP = 450;
  const xpToNextLevel = 1000;
  const xpProgress = (userXP / xpToNextLevel) * 100;
  
  // Get pods user has joined (status Accepted)
  const acceptedPods = applications
    .filter(app => app.status === 'Accepted')
    .map(app => {
      const pod = pods.find(p => p._id === app.podId);
      return {
        ...app,
        podDetails: pod || {}
      };
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);
  
  // Recent applications
  const recentApplications = [...applications]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);
  
  // Calculate insights
  const topAppliedPod = applications.length > 0 
    ? pods.filter(pod => applications.some(app => app.podId === pod._id))
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))[0]
    : null;
  
  const acceptanceRate = applications.length > 0
    ? Math.round((applications.filter(app => app.status === 'Accepted').length / applications.length) * 100)
    : 0;
  
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
    <div className={styles.contributorDashboard}>
      <div className={styles.gridBackground}></div>
      
      {/* Floating decorative elements */}
      <div className={`${styles.floatingShape} ${styles.shape1}`}></div>
      <div className={`${styles.floatingShape} ${styles.shape2}`}></div>
      
      <div className={styles.dashboardHeader}>
        <div className={styles.headerLeft}>
          <h1>
            Welcome back, <span className={styles.highlight}>{user?.name || 'Contributor'}</span>
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
          
          <a href="/explore" className={styles.explorePodButton}>
            <Search size={18} />
            <span>Explore Pods</span>
          </a>
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
              <h3>{podsJoined}</h3>
              <p>Pods Joined</p>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIconContainer} style={{ backgroundColor: 'rgba(78, 205, 196, 0.1)' }}>
              <MessageSquare size={24} style={{ color: '#4ECDC4' }} />
            </div>
            <div>
              <h3>{applicationsSent}</h3>
              <p>Applications Sent</p>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIconContainer} style={{ backgroundColor: 'rgba(107, 91, 149, 0.1)' }}>
              <Clock size={24} style={{ color: '#6B5B95' }} />
            </div>
            <div>
              <h3>{pendingApplications}</h3>
              <p>Pending Applications</p>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIconContainer} style={{ backgroundColor: 'rgba(255, 107, 107, 0.1)' }}>
              <Award size={24} style={{ color: '#FF6B6B' }} />
            </div>
            <div>
              <h3>{userXP}</h3>
              <p>XP Earned</p>
            </div>
          </div>
        </div>
      </section>

      {/* XP & Pods Joined Summary Section */}
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
                  <TrendingUp size={16} />
                </div>
                <div className={styles.benefitText}>Boosted profile visibility</div>
              </div>
              
              <div className={styles.benefitItem}>
                <div className={styles.benefitIcon}>
                  <Zap size={16} />
                </div>
                <div className={styles.benefitText}>Priority pod matching</div>
              </div>
              
              <div className={styles.benefitItem}>
                <div className={styles.benefitIcon}>
                  <BarChart2 size={16} />
                </div>
                <div className={styles.benefitText}>Monthly analytics</div>
              </div>
              
              <div className={styles.benefitItem}>
                <div className={styles.benefitIcon}>
                  <Award size={16} />
                </div>
                <div className={styles.benefitText}>Profile badges</div>
              </div>
            </div>
          </div>
        </section>

        {/* Pods Joined Section */}
        <section className={styles.yourPodsSection}>
          <div className={styles.sectionHeaderWithAction}>
            <h3>Pods Joined</h3>
            <a href="/my-pods" className={styles.viewAllLink}>
              <span>View All</span>
              <ChevronRight size={16} />
            </a>
          </div>
          
          {acceptedPods.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <Briefcase size={32} />
              </div>
              <h4>You haven't joined any Pods yet</h4>
              <p>Start exploring and applying to Pods that match your skills</p>
              <a href="/explore" className={styles.emptyStateButton}>
                <Search size={16} />
                <span>Explore Pods</span>
              </a>
            </div>
          ) : (
            <div className={styles.podsList}>
              {acceptedPods.map((application) => (
                <div key={application._id} className={styles.podItem}>
                  <div className={styles.podHeader}>
                    <h4>{application.podTitle}</h4>
                    <div className={styles.podMeta}>
                      <div className={styles.podRole}>
                        <Users size={14} />
                        <span>{application.roleApplied}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.podProgressSection}>
                    <div className={styles.podProgressLabel}>
                      <span>Pod Status</span>
                      <span className={styles.podProgressText}>
                        {application.podDetails.status || 'Active'}
                      </span>
                    </div>
                    <div className={styles.podTeamMembers}>
                      <div className={styles.teamLabel}>Team Members:</div>
                      <div className={styles.teamCount}>
                        {application.podDetails.teamSize || 
                          (application.podDetails.acceptedApplications?.length || '2-5')} members
                      </div>
                    </div>
                  </div>
                  
                  <a href={`/pods/${application.podId}`} className={styles.podDetailsLink}>
                    <span>Manage Contribution</span>
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
                    You applied for <strong>{app.roleApplied}</strong> in{' '}
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

      {/* Insights (Pro feature) Section */}
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
            <p>Upgrade to Pro to access detailed analytics about your application performance and pod matching.</p>
            <ul className={styles.proFeaturesList}>
              <li>
                <BarChart2 size={14} />
                <span>Application success rate analytics</span>
              </li>
              <li>
                <Clock size={14} />
                <span>Average response time metrics</span>
              </li>
              <li>
                <TrendingUp size={14} />
                <span>Profile visibility insights</span>
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
                <h4>Top Pod You Applied To</h4>
                <Eye size={16} />
              </div>
              <div className={styles.insightContent}>
                {topAppliedPod ? (
                  <>
                    <div className={styles.insightTitle}>{topAppliedPod.title}</div>
                    <div className={styles.insightValue}>{topAppliedPod.viewCount || 0} views</div>
                  </>
                ) : (
                  <div className={styles.insightEmpty}>No data available</div>
                )}
              </div>
            </div>
            
            <div className={styles.insightCard}>
              <div className={styles.insightHeader}>
                <h4>Application Acceptance Rate</h4>
                <BarChart2 size={16} />
              </div>
              <div className={styles.insightContent}>
                <div className={styles.insightValue}>{acceptanceRate}%</div>
                <div className={styles.insightDescription}>
                  of your applications accepted
                </div>
              </div>
            </div>
            
            <div className={styles.insightCard}>
              <div className={styles.insightHeader}>
                <h4>Average Response Time</h4>
                <Clock size={16} />
              </div>
              <div className={styles.insightContent}>
                <div className={styles.insightValue}>48 hours</div>
                <div className={styles.insightDescription}>
                  for application decisions
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Quick Actions Section */}
      <section className={styles.quickActionsSection}>
        <h3>Quick Actions</h3>
        
        <div className={styles.quickActionsGrid}>
          <a href="/explore" className={styles.actionCard}>
            <div className={styles.actionIcon}>
              <Search size={24} />
            </div>
            <div className={styles.actionText}>Explore Pods</div>
          </a>
          
          <a href="/applications" className={styles.actionCard}>
            <div className={styles.actionIcon}>
              <MessageSquare size={24} />
            </div>
            <div className={styles.actionText}>View My Applications</div>
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

export default ContributorDashboard;