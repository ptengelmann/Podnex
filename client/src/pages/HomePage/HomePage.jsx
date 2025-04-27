import React from 'react';
import styles from './HomePage.module.scss';
import HeroSection from './HeroSection/HeroSection';
import FeaturedPodsSection from './FeaturedPodsSection/FeaturedPodsSection';

const HomePage = () => {
  return (
    <div className={styles.home}>
      <HeroSection />
      <FeaturedPodsSection />
    </div>
  );
};

export default HomePage;
