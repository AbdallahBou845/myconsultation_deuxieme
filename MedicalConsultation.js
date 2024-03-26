// MedicalConsultation.js

import React, { useState } from 'react';
import './MedicalConsultation.css';

const MedicalConsultation = ({ username }) => {
  const [formData, setFormData] = useState({
    question1: false,
    question2: false,
    question3: false,
    question4: false,
    question5: false,
    question6: false,
    question7: false,
    question8: false,
  });

  const handleCheckboxChange = (question) => {
    setFormData((prevData) => ({
      ...prevData,
      [question]: !prevData[question],
    }));
  };

  const handleSubmit = () => {
   
    fetch('http://127.0.0.1:5000/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
  };

  return (
    <div className="medical-consultation-container">
      <h2>Bienvenue, {username}!</h2>

      <div className="question">
        <label className="checkbox-label">
          <input
            type="checkbox"
            className="checkbox-input"
            checked={formData.question1}
            onChange={() => handleCheckboxChange('question1')}
          />
          Question 1: Avez-vous des antécédents familiaux de maladies cardiaques?
        </label>
      </div>

      <div className="question">
        <label className="checkbox-label">
          <input
            type="checkbox"
            className="checkbox-input"
            checked={formData.question2}
            onChange={() => handleCheckboxChange('question2')}
          />
          Question 2: Avez-vous des allergies alimentaires?
        </label>
      </div>

      <div className="question">
        <label className="checkbox-label">
          <input
            type="checkbox"
            className="checkbox-input"
            checked={formData.question3}
            onChange={() => handleCheckboxChange('question3')}
          />
          Question 1: Avez-vous des antécédents familiaux de maladies cardiaques?
        </label>
      </div>

      <div className="question">
        <label className="checkbox-label">
          <input
            type="checkbox"
            className="checkbox-input"
            checked={formData.question4}
            onChange={() => handleCheckboxChange('question4')}
          />
          Question 2: Avez-vous des allergies alimentaires?
        </label>
      </div>
      <div className="question">
        <label className="checkbox-label">
          <input
            type="checkbox"
            className="checkbox-input"
            checked={formData.question5}
            onChange={() => handleCheckboxChange('question6')}
          />
          Question 1: Avez-vous des antécédents familiaux de maladies cardiaques?
        </label>
      </div>

      <div className="question">
        <label className="checkbox-label">
          <input
            type="checkbox"
            className="checkbox-input"
            checked={formData.question7}
            onChange={() => handleCheckboxChange('question8')}
          />
          Question 2: Avez-vous des allergies alimentaires?
        </label>
      </div>
      <div className="question">
        <label className="checkbox-label">
          <input
            type="checkbox"
            className="checkbox-input"
            checked={formData.question9}
            onChange={() => handleCheckboxChange('question9')}
          />
          Question 1: Avez-vous des antécédents familiaux de maladies cardiaques?
        </label>
      </div>

      <div className="question">
        <label className="checkbox-label">
          <input
            type="checkbox"
            className="checkbox-input"
            checked={formData.question10}
            onChange={() => handleCheckboxChange('question10')}
          />
          Question 2: Avez-vous des allergies alimentaires?
        </label>
      </div>
      
      <button className="submit-button" onClick={handleSubmit}>
        Soumettre
      </button>
    </div>
  );
};

export default MedicalConsultation;
