import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './NavBar.module.scss';

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState(localStorage.getItem('token')); // ADD THIS LINE
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || {};
    } catch {
      return {};
    }
  });
  
  // Ref for detecting clicks outside the dropdown
  const profileDropdownRef = useRef(null);

const checkAuth = useCallback(() => {
  const currentToken = localStorage.getItem('token');
  const currentUser = localStorage.getItem('user');
  
  console.log('🔍 Auth check - Raw token:', currentToken);
  console.log('🔍 Auth check - Raw user:', currentUser);
  
  // Set token directly - no complex logic
  if (currentToken) {
    console.log('🔍 Setting token from localStorage');
    setToken(currentToken);
  } else {
    console.log('🔍 No token found, setting to null');
    setToken(null);
  }
  
  // Set user data
  if (currentUser) {
    try {
      const parsedUser = JSON.parse(currentUser);
      console.log('🔍 Setting user:', parsedUser);
      // Remove token from user object to avoid duplication
      const { token: userToken, ...userWithoutToken } = parsedUser;
      setUser(userWithoutToken);
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('user');
      setUser({});
    }
  } else {
    setUser({});
  }
}, []);
// Single auth effect - runs only on mount and when storage changes
useEffect(() => {
  // Check auth on component mount
  checkAuth();
  
  // Create a listener for storage events to detect login/logout in other tabs
  const handleStorageChange = (e) => {
    console.log('Storage changed:', e.key, e.newValue ? 'set' : 'removed');
    if (e.key === 'token' || e.key === 'user') {
      checkAuth();
    }
  };
  
  window.addEventListener('storage', handleStorageChange);
  
  return () => {
    window.removeEventListener('storage', handleStorageChange);
  };
}, [checkAuth]);

// Force auth check when location changes (important for login flow)
useEffect(() => {
  console.log('🔄 Route changed, checking auth state');
  checkAuth();
}, [location.pathname, checkAuth]);

// Handle scroll effects
useEffect(() => {
  const handleScroll = () => {
    if (window.scrollY > 20) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [location.pathname]);
  
  // Handle clicks outside of profile dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

const handleLogout = useCallback(() => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  setToken(null);
  setUser({});
  setProfileDropdownOpen(false);
  navigate('/login');
}, [navigate]);

  // Improved getUserInitials function
  const getUserInitials = () => {
    console.log('Getting initials for user:', user);
    
    if (user?.name && typeof user.name === 'string') {
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    if (user?.email && typeof user.email === 'string') {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  // Check if a menu item is active
  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };
  
  // Toggle profile dropdown
  const toggleProfileDropdown = (e) => {
    e.stopPropagation();
    console.log('Toggling profile dropdown. Current state:', profileDropdownOpen);
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  // Add debugging log before render
  console.log('NavBar render - Token:', !!token, 'User:', user, 'ProfileDropdownOpen:', profileDropdownOpen);

  return (
    <motion.nav 
      className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
    >
      <div className={styles.navbarContainer}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <motion.div 
            className={styles.logoWrapper}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className={styles.logoIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 16V8.00002C20.9996 7.6493 20.9071 7.30483 20.7315 7.00119C20.556 6.69754 20.3037 6.44539 20 6.27002L13 2.27002C12.696 2.09449 12.3511 2.00208 12 2.00208C11.6489 2.00208 11.304 2.09449 11 2.27002L4 6.27002C3.69626 6.44539 3.44398 6.69754 3.26846 7.00119C3.09294 7.30483 3.00036 7.6493 3 8.00002V16C3.00036 16.3508 3.09294 16.6952 3.26846 16.9989C3.44398 17.3025 3.69626 17.5547 4 17.73L11 21.73C11.304 21.9056 11.6489 21.998 12 21.998C12.3511 21.998 12.696 21.9056 13 21.73L20 17.73C20.3037 17.5547 20.556 17.3025 20.7315 16.9989C20.9071 16.6952 20.9996 16.3508 21 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3.27002 6.96002L12 12.01L20.73 6.96002" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 22.08V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className={styles.logoText}>PODNEX</span>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <div className={styles.desktopNav}>
          <ul className={styles.navLinks}>
            <motion.li whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
              <Link 
                to="/explore" 
                className={isActive('/explore') ? styles.active : ''}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Explore
              </Link>
            </motion.li>
            
            <motion.li whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
              <Link 
                to="/ecosystem" 
                className={isActive('/ecosystem') ? styles.active : ''}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L6.5 11H17.5L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6.5 11L3 17H12L6.5 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17.5 11L21 17H12L17.5 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 17V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Ecosystem
              </Link>
            </motion.li>

            <motion.li whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
              <Link 
                to="/profile-discovery" 
                className={isActive('/discover') ? styles.active : ''}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Discover
              </Link>
            </motion.li>
            
            <motion.li whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
              <Link 
                to="/about" 
                className={isActive('/about') ? styles.active : ''}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                About
              </Link>
            </motion.li>
            
            {token && (
              <motion.li whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                <Link 
                  to="/create-pod" 
                  className={isActive('/create-pod') ? styles.active : ''}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Create Pod
                </Link>
              </motion.li>
            )}

            {token && (
              <motion.li whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                <Link
                  to="/applications"
                  className={isActive('/applications') ? styles.active : ''}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 6H21M8 12H21M8 18H21M3 6H3.01M3 12H3.01M3 18H3.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Applications
                </Link>
              </motion.li>
            )}
          </ul>
        </div>

        {/* Auth Actions */}
        <div className={styles.authActions}>
          {token ? (
            <div className={styles.userActions}>
              {/* Dashboard Link */}
              <motion.div 
                className={styles.dashboardLink}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Link to="/dashboard" className={isActive('/dashboard') ? styles.active : ''}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </motion.div>

              {/* User Avatar with Dropdown */}
              <div className={styles.userAvatarContainer} ref={profileDropdownRef}>
                <motion.div 
                  className={styles.avatarCircle}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleProfileDropdown}
                >
                  {getUserInitials()}
                </motion.div>
                
                {/* Profile Dropdown Menu */}
                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      className={styles.profileDropdown}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className={styles.dropdownHeader}>
                        <div className={styles.userInfo}>
                          <div className={styles.avatarSmall}>{getUserInitials()}</div>
                          <div className={styles.userDetails}>
                            <span className={styles.userName}>{user?.name || 'User'}</span>
                            <span className={styles.userRole}>
                              {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Member'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className={styles.dropdownDivider}></div>
                      
                      <ul className={styles.dropdownMenu}>
                        <li>
                          <Link 
                            to="/profile" 
                            className={styles.dropdownItem}
                            onClick={() => setProfileDropdownOpen(false)}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span>View Profile</span>
                          </Link>
                        </li>
                        <li>
                          <Link 
                            to="/settings/profile" 
                            className={styles.dropdownItem}
                            onClick={() => setProfileDropdownOpen(false)}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span>Edit Profile</span>
                          </Link>
                        </li>
                        <li>
                          <Link 
                            to="/settings/portfolio/add" 
                            className={styles.dropdownItem}
                            onClick={() => setProfileDropdownOpen(false)}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M21 16V8C20.9996 7.64927 20.9071 7.30481 20.7315 7.00117C20.556 6.69753 20.3037 6.44538 20 6.27V6.27L13 2.27C12.696 2.09447 12.3511 2.00206 12 2.00206C11.6489 2.00206 11.304 2.09447 11 2.27L4 6.27C3.69626 6.44538 3.44398 6.69753 3.26846 7.00117C3.09294 7.30481 3.00036 7.64927 3 8V16C3.00036 16.3507 3.09294 16.6952 3.26846 16.9988C3.44398 17.3025 3.69626 17.5546 4 17.73L11 21.73C11.304 21.9055 11.6489 21.9979 12 21.9979C12.3511 21.9979 12.696 21.9055 13 21.73L20 17.73C20.3037 17.5546 20.556 17.3025 20.7315 16.9988C20.9071 16.6952 20.9996 16.3507 21 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span>Add Portfolio Item</span>
                          </Link>
                        </li>
                        <li className={styles.dropdownDivider}></li>
                        <li>
                          <button 
                            className={styles.dropdownItem}
                            onClick={() => {
                              handleLogout();
                              setProfileDropdownOpen(false);
                            }}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span>Logout</span>
                          </button>
                        </li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className={styles.authButtons}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/login" className={styles.loginButton}>
                  Login
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/register" className={styles.registerButton}>
                  Register
                </Link>
              </motion.div>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <motion.button
          className={styles.mobileMenuToggle}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Toggle menu"
        >
          <div className={`${styles.hamburger} ${mobileMenuOpen ? styles.active : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className={styles.mobileMenu}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className={styles.mobileMenuContent}>
              {/* User Info (Mobile) */}
              {token && (
                <div className={styles.mobileUserInfo}>
                  <div className={styles.mobileAvatar}>
                    {getUserInitials()}
                  </div>
                  <div className={styles.mobileUserDetails}>
                    <span className={styles.mobileUserName}>{user?.name || 'User'}</span>
                    <span className={styles.mobileUserRole}>
                      {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Member'}
                    </span>
                  </div>
                  <Link to="/profile" className={styles.viewProfileButton}>
                    View Profile
                  </Link>
                </div>
              )}
            
              <ul className={styles.mobileNavLinks}>
                <li>
                  <Link 
                    to="/explore" 
                    className={isActive('/explore') ? styles.active : ''}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Explore
                  </Link>
                </li>

                <li>
                  <Link 
                    to="/ecosystem" 
                    className={isActive('/ecosystem') ? styles.active : ''}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L6.5 11H17.5L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M6.5 11L3 17H12L6.5 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M17.5 11L21 17H12L17.5 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 17V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Ecosystem
                  </Link>
                </li>

                <li>
                  <Link 
                    to="/profile-discovery" 
                    className={isActive('/profile-discovery') ? styles.active : ''}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Discover
                  </Link>
                </li>

                <li>
                  <Link 
                    to="/about" 
                    className={isActive('/about') ? styles.active : ''}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    About
                  </Link>
                </li>
                
                {token && (
                  <li>
                    <Link 
                      to="/create-pod" 
                      className={isActive('/create-pod') ? styles.active : ''}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Create Pod
                    </Link>
                  </li>
                )}

                {token && (
                  <li>
                    <Link 
                      to="/dashboard" 
                      className={isActive('/dashboard') ? styles.active : ''}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Dashboard
                    </Link>
                  </li>
                )}

                {token && (
                  <li>
                    <Link
                      to="/applications"
                      className={isActive('/applications') ? styles.active : ''}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 6H21M8 12H21M8 18H21M3 6H3.01M3 12H3.01M3 18H3.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Applications
                    </Link>
                  </li>
                )}
                
                {/* Add Profile links for mobile menu */}
                {token && (
                  <li>
                    <Link 
                      to="/profile" 
                      className={isActive('/profile') ? styles.active : ''}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      My Profile
                    </Link>
                  </li>
                )}
                
                {token && (
                  <li>
                    <Link 
                      to="/settings/profile" 
                      className={isActive('/settings/profile') ? styles.active : ''}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Edit Profile
                    </Link>
                  </li>
                )}
                
                {token ? (
                  <li>
                    <button 
                      className={styles.mobileLogoutButton}
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Logout
                    </button>
                  </li>
                ) : (
                  <>
                    <li>
                      <Link 
                        to="/login" 
                        className={styles.mobileAuthLink}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M10 17L15 12L10 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/register" 
                        className={styles.mobileAuthLink}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M20 8V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M23 11H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Register
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default NavBar;