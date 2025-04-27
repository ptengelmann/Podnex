import React from 'react';
import styles from './FeaturedPodsSection.module.scss';
import PodCard from '../PodCard/PodCard';

const FeaturedPodsSection = () => {
  const featuredPods = [
    {
      title: 'Nomad Tools — Remote Worker Kit',
      status: 'In Progress',
      neededRoles: ['Designer', 'Marketer', 'Dev'],
    },
    {
      title: 'EcoHome — Sustainable Living Products',
      status: 'Open',
      neededRoles: ['Strategist', 'Writer', 'Tester'],
    },
    {
      title: 'Pulse AI — Mental Health Tracker',
      status: 'Live',
      neededRoles: ['Promoter', 'Marketer'],
    },
  ];

  return (
    <section className={styles.featured}>
      <h2 className={styles.sectionTitle}>Featured Pods</h2>
      <div className={styles.podGrid}>
        {featuredPods.map((pod, index) => (
          <PodCard
            key={index}
            title={pod.title}
            status={pod.status}
            neededRoles={pod.neededRoles}
          />
        ))}
      </div>
    </section>
  );
};

export default FeaturedPodsSection;
