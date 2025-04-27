import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import styles from './ActivitySection.module.scss';

const ActivitySection = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const generateActivity = () => {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const result = days.map(day => ({
        name: day,
        contributions: Math.floor(Math.random() * 5),
        views: Math.floor(Math.random() * 20) + 5,
      }));
      setData(result);
    };

    generateActivity();
  }, []);

  return (
    <motion.section 
      className={styles.activitySection}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      <h2>Weekly Activity</h2>
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#aaa', fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#222', borderRadius: 8 }}
              itemStyle={{ color: '#fff' }}
              labelStyle={{ color: '#aaa' }}
            />
            <Bar dataKey="contributions" barSize={10} radius={[5, 5, 0, 0]} fill="#3B82F6" />
            <Bar dataKey="views" barSize={10} radius={[5, 5, 0, 0]} fill="#8B5CF6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.section>
  );
};

export default ActivitySection;
