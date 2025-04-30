import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './LoginPage.module.scss';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { email, password } = formData;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.2 }
    );
    const section = document.querySelector(`.${styles.loginPage}`);
    if (section) observer.observe(section);
    return () => section && observer.unobserve(section);
  }, []);

  const onChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };
  const togglePasswordVisibility = () => setPasswordVisible(v => !v);
  const toggleRememberMe = () => setRememberMe(v => !v);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);

      // Persist the full user object, including role
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));

      // Brief delay for loading animation
      setTimeout(() => navigate('/dashboard'), 500);

    } catch (err) {
      console.error(err.response?.data?.message || 'Login failed');
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <motion.div
        className={styles.gridBackground}
        animate={{ scale: [1, 1.02, 1], rotate: [0, 1, 0] }}
        transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
      />

      <div className={`${styles.floatingShape} ${styles.shape1}`}></div>
      <div className={`${styles.floatingShape} ${styles.shape2}`}></div>

      <motion.div
        className={styles.loginCard}
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <div className={styles.loginHeader}>
          <div className={styles.logoWrapper}>
            <div className={styles.logoIcon}>
              {/* SVG logo omitted for brevity */}
            </div>
            <h3 className={styles.logoText}>PODNEX</h3>
          </div>
          <div className={styles.titleWrapper}>
            <h2 className={styles.pageTitle}>Welcome Back</h2>
            <div className={styles.titleDecoration}></div>
          </div>
          <p className={styles.subtitle}>Sign in to continue your podcast journey</p>
        </div>

        {error && (
          <motion.div
            className={styles.errorMessage}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Error icon omitted for brevity */}
            {error}
          </motion.div>
        )}

        <motion.form
          className={styles.form}
          onSubmit={onSubmit}
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          {/* Email input */}
          <motion.div className={styles.inputGroup} variants={itemVariants}>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Your email address"
              value={email}
              onChange={onChange}
              required
              className={styles.inputField}
            />
          </motion.div>

          {/* Password input */}
          <motion.div className={styles.inputGroup} variants={itemVariants}>
            <div className={styles.passwordHeader}>
              <label htmlFor="password">Password</label>
              <Link to="/forgot-password" className={styles.forgotPassword}>
                Forgot Password?
              </Link>
            </div>
            <div className={styles.passwordField}>
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter your password"
                value={password}
                onChange={onChange}
                required
                className={styles.inputField}
              />
              <button type="button" className={styles.passwordToggle} onClick={togglePasswordVisibility}>
                {/* Toggle icon SVG omitted for brevity */}
              </button>
            </div>
          </motion.div>

          {/* Remember me */}
          <motion.div className={styles.rememberMeContainer} variants={itemVariants}>
            <label className={styles.rememberMeLabel}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={toggleRememberMe}
                className={styles.checkbox}
              />
              <span className={styles.checkmark}></span>
              Remember me
            </label>
          </motion.div>

          {/* Submit */}
          <motion.button
            type="submit"
            className={styles.submitButton}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            variants={itemVariants}
          >
            {loading ? <div className={styles.loadingSpinner}></div> : 'Sign In'}
          </motion.button>

          {/* Divider & Google button omitted for brevity */}

          <motion.p className={styles.registerLink} variants={itemVariants}>
            Don't have an account? <Link to="/register">Sign up here</Link>
          </motion.p>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default LoginPage;
