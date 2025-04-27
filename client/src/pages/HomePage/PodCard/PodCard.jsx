import React from 'react';
import styles from './PodCard.module.scss';

const PodCard = ({ title, status, neededRoles }) => {
  return (
    <div className={styles.card}>
      <div className={styles.status}>{status}</div>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.roles}>
        {neededRoles.map((role, index) => (
          <span key={index} className={styles.role}>
            {role}
          </span>
        ))}
      </div>
      <button className={styles.viewBtn}>View Pod</button>
    </div>
  );
};

export default PodCard;
