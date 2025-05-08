import React from 'react';
import styles from './HomePage.module.scss';
import HeroSection from './HeroSection/HeroSection';
import FeaturedPodsSection from './FeaturedPodsSection/FeaturedPodsSection';
import HowItWorksSection from './HowItWorksSection/HowItWorksSection';
import Ecosystem from './Ecosystem/Ecosystem';
import Testimonials from './Testimonials/Testimonials';

const HomePage = () => {
  return (
    <div className={styles.home}>
      <HeroSection />
      <HowItWorksSection />
      <FeaturedPodsSection />
      <Ecosystem />
      <Testimonials />
    </div>
  );
};

export default HomePage;
