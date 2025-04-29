import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './ApplicationsPage.module.scss';

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = JSON.parse(localStorage.getItem('user'));

        if (!token || !userData) throw new Error('User not authenticated');

        setUserRole(userData.role);

        const res = await axios.get('http://localhost:5000/api/applications', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setApplications(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch applications.');
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) return <div className={styles.loading}>Loading applications...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  // Remove the additional filtering - the backend already does the filtering we need
  const filteredApplications = applications;

  return (
    <div className={styles.applicationsPage}>
      <h1>{userRole === 'creator' ? 'Applications Received' : 'My Applications'}</h1>

      {filteredApplications.length === 0 ? (
        <div className={styles.noApplications}><p>No applications found.</p></div>
      ) : (
        <div className={styles.applicationsList}>
          {filteredApplications.map(application => (
            <div key={application._id} className={styles.applicationCard}>
              <div className={styles.applicationHeader}>
                <h2>{application.pod?.title || 'Untitled Pod'}</h2>
                <p>Role: <strong>{application.roleApplied}</strong></p>
              </div>

              <div className={styles.applicationBody}>
                <p><strong>Experience:</strong> {application.experience}</p>
                <p><strong>Motivation:</strong> {application.motivation}</p>
                {application.portfolioLink && (
                  <p><strong>Portfolio:</strong> <a href={application.portfolioLink} target="_blank" rel="noopener noreferrer">View</a></p>
                )}
                {userRole === 'creator' && (
                  <p><strong>Applicant:</strong> {application.applicant?.name || 'Anonymous'}</p>
                )}
              </div>

              <div className={styles.applicationStatus}>
                <span>Status: {application.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationsPage;