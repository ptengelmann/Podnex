import React from 'react';
import styles from './HowItWorksSection.module.scss';
import { RocketIcon, UsersIcon, HammerIcon } from 'lucide-react'; // You can replace or customize later

const steps = [
  {
    icon: <UsersIcon size={48} />,
    title: 'Join or Create a Pod',
    description: 'Jump into an existing Pod or launch your own to start building bold ideas.',
  },
  {
    icon: <HammerIcon size={48} />,
    title: 'Collaborate and Build',
    description: 'Contribute, create, and grow your Pod with real work tracked transparently.',
  },
  {
    icon: <RocketIcon size={48} />,
    title: 'Launch to the World',
    description: 'Go live with your product, service, or movement — fully backed by your team.',
  },
];

const HowItWorksSection = () => {
  return (
    <section className={styles.howItWorks}>
      <h2 className={styles.sectionTitle}>How It Works</h2>
      <div className={styles.stepsGrid}>
        {steps.map((step, index) => (
          <div key={index} className={styles.stepCard}>
            <div className={styles.icon}>{step.icon}</div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorksSection;
