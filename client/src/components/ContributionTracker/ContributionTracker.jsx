// client/src/components/ContributionTracker/ContributionTracker.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Star, 
  Award, 
  Code, 
  Paintbrush, 
  FileText, 
  Bug, 
  Zap,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Github,
  ExternalLink,
  Eye,
  MessageSquare
} from 'lucide-react';
import axios from 'axios';
import styles from './ContributionTracker.module.scss'; // Import as styles object

const ContributionTracker = ({ podId }) => {
  const [contributions, setContributions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [userProgress, setUserProgress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchContributions();
    fetchUserProgress();
  }, [podId]);

  const fetchContributions = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');
      
      if (!user || !token) {
        setError('Please log in to view contributions');
        return;
      }

      const response = await axios.get(`http://localhost:5000/api/contributions/user/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setContributions(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching contributions:', error);
      setError('Failed to load contributions');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserProgress = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');
      
      if (!user || !token) return;

      const response = await axios.get(`http://localhost:5000/api/contributions/progress/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUserProgress(response.data);
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const submitContribution = async (contributionData) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/contributions', contributionData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      await fetchContributions();
      await fetchUserProgress();
      setShowForm(false);
      
      alert('Contribution submitted successfully!');
      
    } catch (error) {
      console.error('Error submitting contribution:', error);
      alert('Failed to submit contribution. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className={styles.contributionTracker}>
        {/* Animated background elements */}
        <div className={styles.gridBackground}></div>
        <div className={`${styles.floatingShape} ${styles.shape1}`}></div>
        <div className={`${styles.floatingShape} ${styles.shape2}`}></div>
        
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading contributions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.contributionTracker}>
        {/* Animated background elements */}
        <div className={styles.gridBackground}></div>
        <div className={`${styles.floatingShape} ${styles.shape1}`}></div>
        <div className={`${styles.floatingShape} ${styles.shape2}`}></div>
        
        <div className={styles.errorState}>
          <AlertCircle size={48} />
          <h3>Error Loading Contributions</h3>
          <p>{error}</p>
          <button onClick={fetchContributions}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.contributionTracker}>
      {/* Animated background elements */}
      <div className={styles.gridBackground}></div>
      <div className={`${styles.floatingShape} ${styles.shape1}`}></div>
      <div className={`${styles.floatingShape} ${styles.shape2}`}></div>

      {/* Progress Overview */}
      {userProgress && (
        <motion.div 
          className={styles.progressOverview}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className={styles.xpDisplay}>
            <Star size={24} />
            <span>{userProgress.totalXP} XP</span>
            <div className={styles.level}>Level {userProgress.currentLevel}</div>
          </div>
          
          <div className={styles.tierBadge} data-tier={userProgress.tier}>
            <Award size={20} />
            <span>{userProgress.tier.toUpperCase()} TIER</span>
          </div>
          
          <div className={styles.statsGrid}>
            <div className={styles.stat}>
              <span className={styles.value}>{userProgress.stats.totalContributions}</span>
              <span className={styles.label}>Total Contributions</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.value}>{userProgress.stats.approvedContributions}</span>
              <span className={styles.label}>Approved</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.value}>{Math.round(userProgress.stats.contributionSuccessRate)}%</span>
              <span className={styles.label}>Success Rate</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Contribution Form */}
      <AnimatePresence>
        {showForm && (
          <ContributionForm 
            onSubmit={submitContribution}
            onClose={() => setShowForm(false)}
            podId={podId}
          />
        )}
      </AnimatePresence>

      {/* Contributions Section */}
      <div className={styles.contributionsSection}>
        <div className={styles.sectionHeader}>
          <h3>Your Contributions</h3>
          <button 
            className={styles.addContributionBtn}
            onClick={() => setShowForm(true)}
          >
            <Plus size={20} />
            Add Contribution
          </button>
        </div>

        <div className={styles.contributionsList}>
          {contributions.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <Code size={48} />
              </div>
              <h4>No contributions yet</h4>
              <p>Start contributing to this pod to earn XP and build your reputation!</p>
              <button 
                className={styles.ctaButton}
                onClick={() => setShowForm(true)}
              >
                <Plus size={16} />
                Submit Your First Contribution
              </button>
            </div>
          ) : (
            contributions.map(contribution => (
              <ContributionCard 
                key={contribution._id}
                contribution={contribution}
                onUpdate={fetchContributions}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const ContributionForm = ({ onSubmit, onClose, podId }) => {
  const [formData, setFormData] = useState({
    type: 'code_commit',
    title: '',
    description: '',
    difficulty: 'medium',
    impact: 'medium',
    evidence: {}
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit({ ...formData, podId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contributionTypes = [
    { value: 'code_commit', label: 'Code Commit', icon: <Code size={16} /> },
    { value: 'design_asset', label: 'Design Asset', icon: <Paintbrush size={16} /> },
    { value: 'documentation', label: 'Documentation', icon: <FileText size={16} /> },
    { value: 'bug_fix', label: 'Bug Fix', icon: <Bug size={16} /> },
    { value: 'feature_implementation', label: 'Feature Implementation', icon: <Zap size={16} /> },
  ];

  return (
    <motion.div 
      className={styles.contributionFormOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className={styles.contributionForm}
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.formHeader}>
          <h3>Submit Contribution</h3>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Contribution Type</label>
            <div className={styles.typeSelector}>
              {contributionTypes.map(type => (
                <button
                  key={type.value}
                  type="button"
                  className={`${styles.typeOption} ${formData.type === type.value ? styles.selected : ''}`}
                  onClick={() => setFormData({...formData, type: type.value})}
                >
                  {type.icon}
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Title</label>
            <input 
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Brief description of your contribution"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Detailed explanation of what you did..."
              rows={4}
              required
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Difficulty</label>
              <select 
                value={formData.difficulty}
                onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="expert">Expert</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Impact</label>
              <select 
                value={formData.impact}
                onChange={(e) => setFormData({...formData, impact: e.target.value})}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Evidence (Optional)</label>
            <input 
              type="url"
              placeholder="https://github.com/... or link to design files"
              onChange={(e) => setFormData({
                ...formData, 
                evidence: {...formData.evidence, githubCommit: e.target.value}
              })}
            />
            <small>Provide a link to your work (GitHub, Figma, etc.)</small>
          </div>

          <div className={styles.formActions}>
            <button 
              type="button" 
              className={styles.cancelBtn}
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit"
              className={styles.submitBtn}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit for Review'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

const ContributionCard = ({ contribution, onUpdate }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={16} className={styles.statusApproved} />;
      case 'rejected':
        return <XCircle size={16} className={styles.statusRejected} />;
      case 'pending':
        return <Clock size={16} className={styles.statusPending} />;
      default:
        return <AlertCircle size={16} className={styles.statusReview} />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'code_commit':
        return <Code size={16} />;
      case 'design_asset':
        return <Paintbrush size={16} />;
      case 'documentation':
        return <FileText size={16} />;
      case 'bug_fix':
        return <Bug size={16} />;
      case 'feature_implementation':
        return <Zap size={16} />;
      default:
        return <FileText size={16} />;
    }
  };

  return (
    <motion.div 
      className={styles.contributionCard}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
    >
      <div className={styles.cardHeader}>
        <div className={styles.typeIndicator}>
          {getTypeIcon(contribution.type)}
          <span>{contribution.type.replace('_', ' ').toUpperCase()}</span>
        </div>
        <div className={styles.statusIndicator}>
          {getStatusIcon(contribution.status)}
          <span>{contribution.status.toUpperCase()}</span>
        </div>
      </div>

      <div className={styles.cardContent}>
        <h4>{contribution.title}</h4>
        <p>{contribution.description}</p>
        
        <div className={styles.metaInfo}>
          <div className={styles.metaItem}>
            <strong>Difficulty:</strong> {contribution.difficulty}
          </div>
          <div className={styles.metaItem}>
            <strong>Impact:</strong> {contribution.impact}
          </div>
          <div className={styles.metaItem}>
            <strong>XP:</strong> {contribution.totalXP || 0}
          </div>
        </div>

        {contribution.evidence?.githubCommit && (
          <div className={styles.evidenceLinks}>
            <a 
              href={contribution.evidence.githubCommit}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.evidenceLink}
            >
              <Github size={14} />
              View Code
              <ExternalLink size={12} />
            </a>
          </div>
        )}

        {contribution.reviews && contribution.reviews.length > 0 && (
          <div className={styles.reviewsInfo}>
            <MessageSquare size={14} />
            <span>{contribution.reviews.length} review(s)</span>
          </div>
        )}
      </div>

      <div className={styles.cardFooter}>
        <span className={styles.submissionDate}>
          Submitted {new Date(contribution.createdAt).toLocaleDateString()}
        </span>
        {contribution.approvedAt && (
          <span className={styles.approvalDate}>
            Approved {new Date(contribution.approvedAt).toLocaleDateString()}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default ContributionTracker;