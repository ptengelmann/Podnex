import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NavBar.module.scss';

const NavBar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/">PODNEX</Link>
      </div>
      <ul className={styles.navLinks}>
        <li><Link to="/explore">Explore</Link></li>
        <li><Link to="/create-pod">Create Pod</Link></li>
        <li><Link to="/help-feed">Help Feed</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/register">Register</Link></li>
      </ul>
    </nav>
  );
};

export default NavBar;
