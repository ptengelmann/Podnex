import React from 'react';
import { Link } from 'react-router-dom';
import styles from './MiniPodCard.module.scss';

const MiniPodCard = ({ title, status, id }) => {
  return (
    <div className={styles.card}>
      <div className={styles.status}>{status}</div>
      <h3 className={styles.title}>{title}</h3>
      <Link to={`/pod/${id}`} className={styles.viewBtn}>
        View Pod
      </Link>
    </div>
  );
};

export default MiniPodCard;
