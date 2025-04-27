import React, { useEffect, useState } from 'react';
import styles from './ExplorePage.module.scss';
import PodCard from '../../components/PodCard/PodCard';
import axios from 'axios';

const ExplorePage = () => {
  const [pods, setPods] = useState([]);

  useEffect(() => {
    const fetchPods = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/pods');
        setPods(res.data);
      } catch (error) {
        console.error(error.response?.data?.message || error.message);
      }
    };

    fetchPods();
  }, []);

  return (
    <div className={styles.explorePage}>
      <h1>Explore Pods</h1>
      <div className={styles.podGrid}>
        {pods.length > 0 ? (
          pods.map((pod) => (
            <PodCard
              key={pod._id}
              id={pod._id}
              title={pod.title}
              status="Open" // Placeholder, we'll expand statuses later
              neededRoles={pod.rolesNeeded}
            />
          ))
        ) : (
          <p>No Pods available yet. Be the first to create one!</p>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
