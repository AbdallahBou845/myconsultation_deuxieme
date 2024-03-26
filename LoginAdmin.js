import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginAdmin = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is not valid';
    }

    if (!formData.password.trim()) {
      errors.password = 'Password is required';
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitAdmin = async (e) => {
    e.preventDefault();
  
    if (validateForm()) {
      setIsSubmitting(true);
  
      try {
        const response = await axios.post('http://localhost:8000/loginadmin', formData);
        console.log('Admin Login successful:', response.data);
  
        // Passer l'ID de l'administrateur à la page suivante
        navigate(`/listuserspage/${response.data.user.id}`);
      } catch (error) {
        console.error('Admin Login failed:', error.message);
      }
  
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="login-container">
      <h1>Partie Docteur</h1>
      <form onSubmit={handleSubmitAdmin}>
        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} />
        {errors.email && <p>{errors.email}</p>}

        <label>Mot de passe:</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} />
        {errors.password && <p>{errors.password}</p>}

        <button type="submit" disabled={isSubmitting}>
          Connexion
        </button>
      </form>
    </div>
  );
};

export default LoginAdmin;
