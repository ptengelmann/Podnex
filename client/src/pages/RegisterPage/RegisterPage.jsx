import React, { useState, useEffect } from 'react';
import styles from './RegisterPage.module.scss';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Rocket, Users, LifeBuoy } from 'lucide-react'; // Custom icons


const RegisterPage = () => {
  const navigate = useNavigate();


  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
  });


  const { name, email, password, role } = formData;
  const [isVisible, setIsVisible] = useState(false);


  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );


    const section = document.querySelector(`.${styles.registerPage}`);
    if (section) observer.observe(section);


    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);


  const onChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };


  const onRoleSelect = (selectedRole) => {
    setFormData((prev) => ({
      ...prev,
      role: selectedRole,
    }));
  };


  const onSubmit = async (e) => {
    e.preventDefault();


    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify({
        name: res.data.name,
        email: res.data.email,
        role: formData.role,
      }));
      navigate('/dashboard');
    } catch (error) {
      console.error(error.response?.data?.message);
      alert(error.response?.data?.message || 'Registration failed');
    }
  };


  return (
    <section className={styles.registerPage}>
      <motion.div
        className={styles.registerCard}
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <div className={styles.registerHeader}>
          <h2 className={styles.pageTitle}>Create Your Account</h2>
          <div className={styles.titleDecoration} />
        </div>


        <motion.form
          className={styles.form}
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={name}
            onChange={onChange}
            required
            className={styles.inputField}
          />


          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={email}
            onChange={onChange}
            required
            className={styles.inputField}
          />


          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={onChange}
            required
            className={styles.inputField}
          />


          <div className={styles.roleSelection}>
            <h4>Select Your Role</h4>
            <div className={styles.roleOptions}>
              <div
                className={`${styles.roleOption} ${role === 'creator' ? styles.active : ''}`}
                onClick={() => onRoleSelect('creator')}
              >
                <Rocket size={24} />
                <span>Creator</span>
                <div className={styles.roleDescription}>Launch and lead Pods.</div>
              </div>


              <div
                className={`${styles.roleOption} ${role === 'contributor' ? styles.active : ''}`}
                onClick={() => onRoleSelect('contributor')}
              >
                <Users size={24} />
                <span>Contributor</span>
                <div className={styles.roleDescription}>Join Pods and contribute.</div>
              </div>


              <div
                className={`${styles.roleOption} ${role === 'booster' ? styles.active : ''}`}
                onClick={() => onRoleSelect('booster')}
              >
                <LifeBuoy size={24} />
                <span>Booster</span>
                <div className={styles.roleDescription}>Support Pods to succeed.</div>
              </div>
            </div>
          </div>


          <motion.button
            type="submit"
            className={styles.submitButton}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Register
          </motion.button>
        </motion.form>
      </motion.div>
    </section>
  );
};


export default RegisterPage;


