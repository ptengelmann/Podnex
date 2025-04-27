import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import styles from './PodsSection.module.scss';
import axios from 'axios';

const PodsSection = () => {
  const [pods, setPods] = useState([]);

  useEffect(() => {
    const fetchPods = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const res = await axios.get(`http://localhost:5000/api/pods?creator=${user._id}`, config);
        setPods(res.data);
      } catch (error) {
        console.error(error.response?.data?.message || error.message);
      }
    };

    fetchPods();
  }, []);

  return (
    <motion.section 
      className={styles.podsSection}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <h2>Your Pods</h2>

      {pods.length > 0 ? (
        <div className={styles.podGrid}>
          {pods.map(pod => (
            <motion.div 
              key={pod._id} 
              className={styles.podCard}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={styles.header}>
                <h3>{pod.title}</h3>
                <span className={styles.status}>Open</span>
              </div>
              <p>{pod.mission.slice(0, 80)}...</p>
              <div className={styles.footer}>
                <Users size={16} />
                <span>{pod.rolesNeeded.length} roles needed</span>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className={styles.noPods}>You haven't created any Pods yet.</p>
      )}
    </motion.section>
  );
};

export default PodsSection;
