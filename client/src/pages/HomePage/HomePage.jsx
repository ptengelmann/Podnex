import React from 'react';
import styles from './HomePage.module.scss';
import HeroSection from './HeroSection/HeroSection';
import FeaturedPodsSection from './FeaturedPodsSection/FeaturedPodsSection';
import HowItWorksSection from './HowItWorksSection/HowItWorksSection';

const HomePage = () => {
  return (
    <div className={styles.home}>
      <HeroSection />
      <FeaturedPodsSection />
      <HowItWorksSection />
    </div>
  );
};

export default HomePage;
