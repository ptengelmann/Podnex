import React from 'react';
import styles from './HomePage.module.scss';
import HeroSection from './HeroSection/HeroSection';
import FeaturedPodsSection from './FeaturedPodsSection/FeaturedPodsSection';
import HowItWorksSection from './HowItWorksSection/HowItWorksSection';
import Testimonials from './Testimonials/Testimonials';

const HomePage = () => {
  return (
    <div className={styles.home}>
      <HeroSection />
      <HowItWorksSection />
      <FeaturedPodsSection />
      <Testimonials />
    </div>
  );
};

export default HomePage;
