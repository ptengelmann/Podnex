import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CreatePodPage.module.scss';
import axios from 'axios';

const CreatePodPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    mission: '',
    rolesNeeded: '',
  });

  const { title, mission, rolesNeeded } = formData;

  const onChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const res = await axios.post('http://localhost:5000/api/pods', formData);
      console.log('Pod Created:', res.data);
  
      navigate('/explore', { replace: true });
      window.location.reload();
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
      alert(error.response?.data?.message || 'Error creating pod');
    }
  };

  return (
    <div className={styles.createPodPage}>
      <h1>Launch a New Pod</h1>
      <form onSubmit={onSubmit} className={styles.form}>
        <input
          type="text"
          name="title"
          placeholder="Pod Title"
          value={title}
          onChange={onChange}
          required
        />
        <textarea
          name="mission"
          placeholder="Mission Statement"
          value={mission}
          onChange={onChange}
          required
        />
        <input
          type="text"
          name="rolesNeeded"
          placeholder="Roles Needed (comma separated)"
          value={rolesNeeded}
          onChange={onChange}
          required
        />
        <button type="submit">Create Pod</button>
      </form>
    </div>
  );
};

export default CreatePodPage;
