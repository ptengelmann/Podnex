import React from 'react';
import { Link } from 'react-router-dom'; // <-- Very important import
import styles from './PodCard.module.scss';

const PodCard = ({ id, title, status, neededRoles, creatorName }) => {
  return (
    <div className={styles.card}>
      <div className={styles.status}>{status}</div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.creator}>by {creatorName}</p> {/* 👈 add this */}
      <div className={styles.roles}>
        {neededRoles.map((role, index) => (
          <span key={index} className={styles.role}>
            {role}
          </span>
        ))}
      </div>
      <Link to={`/pods/${id}`} className={styles.viewBtn}>View Pod</Link>
    </div>
  );
};

export default PodCard;
