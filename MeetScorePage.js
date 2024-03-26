// MeetScorePage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import './ScorePage.css';

const MeetScorePage = () => {
    
  const { userId } = useParams();
  const [meetScore, setMeetScore] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDukeScore = async () => {
      try {
        const dukeScoreResponse = await fetch(`http://localhost:8000/duke-score/${userId}`);
        const dukeScoreData = await dukeScoreResponse.json();

        const dukeScoreValue = dukeScoreData.dukeScore;
        const meetScoreCalculation = ((dukeScoreValue * 0.43) + 9.6) / 3.5;

        setMeetScore(meetScoreCalculation);
      } catch (error) {
        console.error('Error fetching Duke score:', error);
      }
    };

    fetchDukeScore();
  }, [userId]);

  const insertMeetScore = async ({ userId, meetScore }) => {
    try {
      const response = await fetch('http://localhost:8000/insert-meet-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          meetScore,
        }),
      });

      const data = await response.json();
      if (data.success) {
        console.log('Score MEET inséré avec succès');
      } else {
        console.error('Erreur lors de l\'insertion du score MEET');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du score MEET au serveur:', error);
    }
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Calcul du score MEET
    const dukeScoreResponse = await fetch(`http://localhost:8000/duke-score/${userId}`);
    const dukeScoreData = await dukeScoreResponse.json();
    const dukeScoreValue = dukeScoreData.dukeScore;
    const meetScoreCalculation = ((dukeScoreValue * 0.43) + 9.6) / 3.5;

    // Envoi du score MEET au serveur
    insertMeetScore({ userId, meetScore: meetScoreCalculation });
  };

  const handleGoToDashboard = () => {
    navigate('/', { state: { userId } });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id='imc'>
      <h2>MEET Score</h2>
      <form onSubmit={handleSubmit}>
        {/* Ajoutez vos champs de formulaire pour les réponses de l'utilisateur */}
        <button className='bt_Meet' type="submit">Calculer le score MEET</button>
      </form>
      <p class="score">MEET Score: {meetScore}</p>
      <button onClick={handlePrint}>Imprimer</button>
    </div>
  );
};

export default MeetScorePage;
