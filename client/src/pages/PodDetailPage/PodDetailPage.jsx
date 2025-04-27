import React from 'react';
import { useParams } from 'react-router-dom';
import styles from './PodDetailPage.module.scss';

const dummyPods = [
  {
    id: 1,
    title: 'Build a Decentralized Finance App',
    status: 'Open',
    rolesNeeded: ['Developer', 'Designer'],
    description: 'We are building a DeFi app that empowers users to lend and borrow assets easily.',
  },
  {
    id: 2,
    title: 'Launch a Sustainable Fashion Brand',
    status: 'In Progress',
    rolesNeeded: ['Marketer', 'Writer'],
    description: 'We’re creating an eco-friendly clothing brand for modern consumers.',
  },
  {
    id: 3,
    title: 'Create a Mental Health AI Tool',
    status: 'Live',
    rolesNeeded: [],
    description: 'Launching an AI tool that helps users monitor and improve their mental health daily.',
  },
];

const PodDetailPage = () => {
  const { id } = useParams();
  const pod = dummyPods.find((p) => p.id === parseInt(id));

  if (!pod) {
    return <div className={styles.podDetailPage}>Pod not found.</div>;
  }

  return (
    <div className={styles.podDetailPage}>
      <h1>{pod.title}</h1>
      <p>Status: <span className={styles.status}>{pod.status}</span></p>
      <p>{pod.description}</p>

      {pod.rolesNeeded.length > 0 ? (
        <div className={styles.roles}>
          <h3>Roles Needed:</h3>
          {pod.rolesNeeded.map((role, index) => (
            <span key={index} className={styles.role}>{role}</span>
          ))}
        </div>
      ) : (
        <p>All roles are filled for this Pod.</p>
      )}
    </div>
  );
};

export default PodDetailPage;
