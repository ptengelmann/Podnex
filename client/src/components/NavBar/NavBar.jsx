import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './NavBar.module.scss';

const NavBar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/">PODNEX</Link>
      </div>
      <ul className={styles.navLinks}>
        <li><Link to="/explore">Explore</Link></li>
        {token && (
  <li><Link to="/create-pod">Create Pod</Link></li>
)}        <li><Link to="/help-feed">Help Feed</Link></li>

        {token ? (
          <>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li>
              <button
                className={styles.logoutButton}
                onClick={handleLogout}
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
