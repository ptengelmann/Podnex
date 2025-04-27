import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './PodDetailPage.module.scss';

const PodDetailPage = () => {
  const { id } = useParams();
  const [pod, setPod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPod = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/pods/${id}`);
        setPod(res.data);
      } catch (err) {
        console.error(err.response?.data?.message || err.message);
        setError('Pod not found');
      } finally {
        setLoading(false);
      }
    };

    fetchPod();
  }, [id]);

  if (loading) {
    return <div className={styles.podDetailPage}>Loading Pod...</div>;
  }

  if (error) {
    return <div className={styles.podDetailPage}>{error}</div>;
  }

  return (
    <div className={styles.podDetailPage}>
      <h1>{pod.title}</h1>
      <p>{pod.mission}</p>

      <h3>Needed Roles:</h3>
      {pod.rolesNeeded.length > 0 ? (
        <ul>
          {pod.rolesNeeded.map((role, index) => (
            <li key={index}>{role}</li>
          ))}
        </ul>
      ) : (
        <p>No roles specified.</p>
      )}
    </div>
  );
};

export default PodDetailPage;
