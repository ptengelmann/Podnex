import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CreatePodPage.module.scss';

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

  const onSubmit = (e) => {
    e.preventDefault();

    console.log('Creating Pod:', formData);

    // Later we send this to MongoDB via Axios
    // For now just navigate
    navigate('/dashboard');
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
