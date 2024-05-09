import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddUserInfo.css';

const AddUserInfo = ({ userId }) => {
  const [age, setAge] = useState(''); // Provide a default value, e.g., an empty string
const [poids, setPoids] = useState('');
const [taille, setTaille] = useState('');
const [actNature, setActNature] = useState('');
const [genre, setGenre] = useState(''); // Provide a default value, e.g., an empty string

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
          setTaille(userData.taille);
          setActNature(userData.act_nature);
          setGenre(userData.Genre); // Update to include gender (Genre)
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
      taille,
      actNature,
      genre,
    };

    try {
      const response = await fetch('http://localhost:8000/add-user-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        console.log('User information successfully sent to the server');
        // Navigate to Dashboard only if userId is available
        if (userId) {
          navigate('/Dashboard', { state: { userId } });
        }
      } else {
        console.error('Error sending user information to the server');
      }
    } catch (error) {
      console.error('Error during form submission:', error);
    }
  };

  const handleEditUserInfo = () => {
    console.log('Navigating to EditUserInfo with userId:', userId);
    navigate('/edit-user-info', { state: { userId } });
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className='Adduserinfo-container'>
      
      <h2>Ajouter des informations Patient</h2>
      <form onSubmit={handleSubmit}>
        <input type="Hidden" id="userId" name="userId" value={userId} readOnly />

        <label htmlFor="age">Age:</label>
        <input type="text" name="age" value={age || ''} onChange={(e) => setAge(e.target.value)} required />

        <label htmlFor="poids">Poids:</label>
        <input type="text" name="poids" value={poids || ''} onChange={(e) => setPoids(e.target.value)} required />

        <label htmlFor="taille">Taille:</label>
        <input type="text" name="taille" value={taille || ''} onChange={(e) => setTaille(e.target.value)} required />

        <label htmlFor="actNature">Nature de l'activité :</label>
        <input type="text" name="actNature" value={actNature || ''} onChange={(e) => setActNature(e.target.value)} required />

        <label htmlFor="genre">Genre:</label>
        <select id="genre" name="genre" value={genre || ''} onChange={(e) => setGenre(e.target.value)} required>
          <option value=""></option>
          <option value="femme">Femme</option>
          <option value="homme">Homme</option>

        </select>

        <button type="submit">Submit</button> 
      </form>
      <br />
      <button type="button" onClick={handleEditUserInfo}> Modifier  </button>
    </div>
  );
};

export default AddUserInfo;
