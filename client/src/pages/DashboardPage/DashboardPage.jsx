import React from 'react';
import styles from './DashboardPage.module.scss';

const DashboardPage = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className={styles.dashboardPage}>
      <h1>Welcome back, {user?.name}</h1>
      <p>This is your Podnex Control Center.</p>
    </div>
  );
};

export default DashboardPage;
