import React from 'react';
import styles from './ExplorePage.module.scss';
import PodCard from '../../components/PodCard/PodCard';

const ExplorePage = () => {
  const dummyPods = [
    {
      id: 1,
      title: 'Build a Decentralized Finance App',
      status: 'Open',
      neededRoles: ['Developer', 'Designer'],
    },
    {
      id: 2,
      title: 'Launch a Sustainable Fashion Brand',
      status: 'In Progress',
      neededRoles: ['Marketer', 'Writer'],
    },
    {
      id: 3,
      title: 'Create a Mental Health AI Tool',
      status: 'Live',
      neededRoles: [],
    },
  ];

  return (
    <div className={styles.explorePage}>
      <h1>Explore Pods</h1>
      <div className={styles.podGrid}>
      {dummyPods.map((pod) => (
  <PodCard
    key={pod.id}
    id={pod.id} // <-- important!
    title={pod.title}
    status={pod.status}
    neededRoles={pod.neededRoles}
  />
))}
      </div>
    </div>
  );
};

export default ExplorePage;
