import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import
import './EditUserInfo.css';

const EditUserInfo = ({ userId }) => {
  const [age, setAge] = useState('');
  const [poids, setPoids] = useState('');
  const [actNature, setActNature] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data only if userId is available
    if (userId) {
      const fetchUserData = async () => {
        try {
          const response = await fetch(`http://localhost:8000/user/${userId}`);
          const userData = await response.json();
          setAge(userData.age);
          setPoids(userData.poids);
          setActNature(userData.act_nature);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      fetchUserData();
    }
  }, [userId]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const userData = {
      userId,
      age,
      poids,
      actNature,
    };

    try {
      const response = await fetch('http://localhost:8000/update-user-info', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        console.log('User information successfully updated');
        // Navigate back to Dashboard
        navigate('/IMCPage', { state: { userId } });
      } else {
        console.error('Error updating user information');
      }
    } catch (error) {
      console.error('Error during form submission:', error);
    }
  };
  const handleLogout = () => {
    navigate('/');
};

  return (
    <div className='EditUserInfo-container'>
      <h2>Edit User Information</h2>
      <form onSubmit={handleSubmit}>
        
        <input type="hidden" id="userId" name="userId" value={userId} readOnly />

        <label htmlFor="age">Age:</label>
        <input type="number" id="age" name="age" value={age} onChange={(e) => setAge(e.target.value)} required />

        <label htmlFor="poids">Poids:</label>
        <input type="number" id="poids" name="poids" value={poids} onChange={(e) => setPoids(e.target.value)} required />

        <label htmlFor="actNature">Activity Nature:</label>
        <input type="text" id="actNature" name="actNature" value={actNature} onChange={(e) => setActNature(e.target.value)} required />

        <button type="submit">Modifier</button>
      </form>
    </div>
  );
};

export default EditUserInfo;
