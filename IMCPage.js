import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ScorePage.css';

const IMCPage = ({ userId }) => {
  const [weight, setWeight] = useState(0);
  const [height, setHeight] = useState(0);
  const [imc, setIMC] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      const fetchUserData = async () => {
        try {
          const response = await fetch(`http://localhost:8000/user-info/${userId}`);
          const userData = await response.json();
          setWeight(userData.userInfo.poids || 0);
          setHeight(userData.userInfo.taille || 0);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      fetchUserData();
    }
  }, [userId]);

  const calculateIMC = async () => {
    if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
      setErrorMessage('Veuillez entrer des valeurs valides pour le poids et la taille.');
      setIMC(null);
      return;
    }

    const calculatedIMC = weight / ((height / 100) ** 2);
    setIMC(calculatedIMC);
    setErrorMessage('');

    if (calculatedIMC > 35) {
      setErrorMessage('Votre IMC est supérieur à 35 kg/m². Consultez un professionnel de la santé.');
    }

    // Envoi des données d'IMC au serveur
    try {
      const response = await fetch('http://localhost:8000/add-imc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          imcValue: calculatedIMC,
        }),
      });

      if (response.ok) {
        console.log('IMC information successfully sent to the server');
        navigate('/Resultat', { state: { userId } });
      } else {
        console.error('Error sending IMC information to the server');
      }
    } catch (error) {
      console.error('Error during IMC submission:', error);
    }
  };
  const handleLogout = () => {
    navigate('/');
};

const handlePrint = () => {
  window.print();
};

  return (
    <div id='imc'>
      <button class="score" onClick={handlePrint}>Imprimer</button>
      <h2>Calcul de l'IMC</h2>

      <div>
        <label>Poids (kg):</label>
        <input type="number" placeholder='Enrez vous le Poids ' value={weight} onChange={(e) => setWeight(e.target.value)} />
      </div>
      <div>
        <label>Taille (cm):</label>
        <input type="number" placeholder='Enrez vous le Taille ' value={height} onChange={(e) => setHeight(e.target.value)} />
      </div>
      <button onClick={calculateIMC}>Calculer l'IMC</button>

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      {imc !== null && (
        <div>
          <h3>Votre IMC:</h3>
          <p>{imc}</p>
        </div>
      )}
    </div>
  );
};

export default IMCPage;
