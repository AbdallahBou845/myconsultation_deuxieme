// Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ onLogin, onSignupClick }) => {
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

  const handleLoginSuccess = async (userId) => {
    try {
      // Check if user responses exist for the given user
      const userResponsesResponse = await axios.get(`http://localhost:8000/user-responses/${userId}`);
  
      if (userResponsesResponse.data.userResponses.length > 0) {
        // User responses exist, navigate to Resultat.js
        navigate('/Resultat', { state: { userId } });
      } else {
        // No user responses, continue checking user info
        const userInfoResponse = await axios.get(`http://localhost:8000/user-info/${userId}`);
  
        if (userInfoResponse.data.userInfo) {
          // User info exists, navigate to Dashboard
          navigate('/Dashboard', { state: { userId } });
        } else {
          // User info does not exist, navigate to AddUserInfo
          navigate('/AddUserInfo', { state: { userId } });
        }
      }
    } catch (error) {
      console.error('Error checking user info or responses:', error.message);
    }
  };
  
  
  
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      try {
        // Send data to the server endpoint for user login
        const response = await axios.post('http://localhost:8000/login', formData);

        console.log('Login successful:', response.data);
        // Call the onLogin function passed as a prop
        onLogin(response.data.user.id);
        // Redirect based on user info and responses existence
        handleLoginSuccess(response.data.user.id);
      } catch (error) {
        console.error('Login failed:', error.message);
      }

      setIsSubmitting(false);
    }
  };

  const handleDocteur = () => {
    navigate('/LoginAdmin');
};

  return (
    <div className="login-container">
      <button class="score" onClick={handleDocteur}>Docteur</button>
      <h1>Partie Patient</h1>

      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input type="email" name="email" placeholder="Adresse e-mail ou numéro Tel" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
        {errors.email && <p>{errors.email}</p>}

        <label>Mot de passe:</label>
        <input type="password" name="password" placeholder="Mot de passe" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
        {errors.password && <p>{errors.password}</p>}

        <button type="submit" disabled={isSubmitting}>
          Se connecter
        </button>
      </form>
      <p className='text'>
        Vous n'avez pas de compte? <span className='signup-link' onClick={onSignupClick}>Inscrivez-vous ici</span>.
      </p>
    </div>
  );
};

export default Login;
