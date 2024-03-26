// Signup.js
import React, { useState } from 'react';
import axios from 'axios';
import './Signup.css';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};

    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is not valid';
    }

    if (!formData.password.trim()) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (formData.confirmPassword !== formData.password) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      try {
        const response = await axios.post('http://localhost:8000/message', formData);

        if (response.data.success) {
          console.log('Registration successful:', response.data);
          navigate('/Login');
        } else {
          // L'inscription a échoué en raison de l'email déjà existant
          console.log('Registration failed:', response.data.error);
          alert('L adresse e-mail est déjà utilisée. Veuillez choisir une autre adresse e-mail');
        }
      } catch (error) {
        console.error('Registration failed:', error.message);

        if (error.response && error.response.status === 400) {
          // Afficher une alerte spécifique pour le statut 400 (Bad Request)
          alert('L inscription a échoué. Veuillez vérifier vos données d entrée.');
        } else {
          // Afficher une alerte générique pour d'autres erreurs
          alert('L inscription a échoué. Veuillez réessayer ultérieurement.');
        }
      }

      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="signup-container">
      <h1>Créer un compte </h1>
      <form onSubmit={handleSubmit}>
        <label>Username:</label>
        <input type="text" name="username" value={formData.username} onChange={handleChange} />
        {errors.username && <p>{errors.username}</p>}

        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} />
        {errors.email && <p>{errors.email}</p>}

        <label>Password:</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} />
        {errors.password && <p>{errors.password}</p>}

        <label>Confirm Password:</label>
        <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
        {errors.confirmPassword && <p>{errors.confirmPassword}</p>}

        <button type="submit" disabled={isSubmitting}>
          Register
        </button>
      </form>
    </div>
  );
};

export default Signup;
