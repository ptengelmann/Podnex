// src/pages/DashboardPage/DashboardPage.jsx
import React, { useEffect, useState } from 'react';
import styles from './DashboardPage.module.scss';
import HeroSection from './components/WelcomeSection/WelcomeSection';
import StatsSection from './components/StatsSection/StatsSection';
import MyPodsSection from './components/PodsSection/MyPodsSection';
import ActivityChartSection from './components/ActivitySection/ActivityChartSection';
import NotificationsSection from './components/NotificationsSection/NotificationsSection';
import axios from 'axios';

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [pods, setPods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activityData, setActivityData] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        setUser(storedUser);

        const podsRes = await axios.get(`http://localhost:5000/api/pods?creator=${storedUser._id}`);
        setPods(podsRes.data);

        const sampleActivity = [...Array(7)].map((_, i) => ({
          name: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
          contributions: Math.floor(Math.random() * 10),
          views: Math.floor(Math.random() * 30)
        }));
        setActivityData(sampleActivity);

        setNotifications([
          { id: 1, text: 'Your pod "AI Builders" reached 80% completion.', time: '3h ago', read: false },
          { id: 2, text: 'New contributor joined your "Future of Work" pod.', time: '6h ago', read: false },
        ]);

        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading Dashboard...</div>;
  }

  return (
    <div className={styles.dashboardPage}>
      <HeroSection user={user} />
      <StatsSection pods={pods} />
      <div className={styles.mainGrid}>
        <MyPodsSection pods={pods} />
        <div className={styles.rightSide}>
          <ActivityChartSection data={activityData} />
          <NotificationsSection notifications={notifications} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
