// SignupAdmin.js
import React, { useState } from 'react';
import axios from 'axios';
import './Signup.css';
import { useNavigate } from 'react-router-dom';

const SignupAdmin = () => {

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
        // Send data to the server endpoint for admin registration
        const response = await axios.post('http://localhost:8000/registerAdmin', formData);

        console.log('Admin Registration successful:', response.data);
        navigate('/LoginAdmin');
      } catch (error) {
        console.error('Admin Registration failed:', error.message);
      }
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="signup-container">
      <h1>Admin Créer un compte</h1>
      <form onSubmit={handleSubmit}>
      
        <label>Username:</label>
        <input type="text" name="username" value={formData.username} onChange={handleChange}/>    
        {errors.username && <p>{errors.username}</p>}
      
        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange}/>
        {errors.email && <p>{errors.email}</p>}
      
        <label>Password:</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} />
        {errors.password && <p>{errors.password}</p>}
      
        <label>Confirm Password:</label>
        <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}/>
        {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
      

      <button type="submit" disabled={isSubmitting}>
        Admin Register
      </button>
    </form>
    </div>
  );
};

export default SignupAdmin;
