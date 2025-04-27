import React, { useState } from 'react';
import styles from './RegisterPage.module.scss';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'contributor' // default value
  });

  const { name, email, password, role } = formData;

  const onChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
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
        role: res.data.role, // save role too
      }));
      navigate('/dashboard');
    } catch (error) {
      console.error(error.response?.data?.message);
      alert(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className={styles.registerPage}>
      <form className={styles.form} onSubmit={onSubmit}>
        <h2>Register</h2>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={name}
          onChange={onChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={onChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={onChange}
          required
        />

        <div className={styles.roleSelector}>
          <label>Select Your Role:</label>
          <select name="role" value={role} onChange={onChange}>
            <option value="creator">Creator</option>
            <option value="contributor">Contributor</option>
            <option value="booster">Booster</option>
          </select>
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;
