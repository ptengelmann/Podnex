import React from 'react';
import styles from './HomePage.module.scss';
import HeroSection from './HeroSection/HeroSection';

const HomePage = () => {
  return (
    <div className={styles.home}>
      <HeroSection />
    </div>
  );
};

export default HomePage;
