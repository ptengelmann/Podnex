import React from 'react';
import styles from './HeroSection.module.scss';
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <section className={styles.hero}>
      <motion.div 
        className={styles.heroContent}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1>Build Bold.<br />Build Together.</h1>
        <p>The ecosystem where creators launch real products, brands, and movements.</p>
        <div className={styles.actions}>
          <button className={styles.primaryBtn}>Join Now</button>
          <button className={styles.secondaryBtn}>Explore Pods</button>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
