import React, { useEffect, useState } from 'react';
import styles from './WelcomeSection.module.scss';
import { motion, AnimatePresence } from 'framer-motion';

const WelcomeSection = () => {
  const [userName, setUserName] = useState('Creator');
  const [currentMessage, setCurrentMessage] = useState(0);

  const messages = [
    "Creation is a team sport.",
    "Reputation unlocks opportunities.",
    "Systems > hustle.",
    "Visibility should be built-in, not gated."
  ];

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && storedUser.name) {
      setUserName(storedUser.name);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <section className={styles.welcomeSection}>
      <div className={styles.backgroundAccent} />

      <motion.div
        className={styles.greetingWrapper}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className={styles.greeting}>
          Welcome back, <span className={styles.name}>{userName}</span>!
        </h1>

        <div className={styles.messageContainer}>
          <AnimatePresence mode="wait">
            <motion.p
              key={currentMessage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className={styles.message}
            >
              {messages[currentMessage]}
            </motion.p>
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
};

export default WelcomeSection;

