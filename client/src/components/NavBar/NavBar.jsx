import React from 'react';
import styles from './NavBar.module.scss';

const NavBar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>PODNEX</div>
      <ul className={styles.navLinks}>
        <li>Explore</li>
        <li>Create Pod</li>
        <li>Help Feed</li>
        <li>Login</li>
      </ul>
    </nav>
  );
};

export default NavBar;
