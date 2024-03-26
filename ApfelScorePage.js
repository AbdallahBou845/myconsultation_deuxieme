
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const ApfelScorePage = () => {
  const { userId } = useParams();
  const [score, setScore] = useState(0);
  const [result, setResult] = useState('');
  const [responses, setResponses] = useState({
    q59: '',
    q9: '',
    q6: '',
    q43: '',
    
    // Ajoutez d'autres questions ici jusqu'à q42
  });
  const navigate = useNavigate();
  const [isScoreCalculated, setIsScoreCalculated] = useState(false); // Nouvel état

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponsesResponse = await fetch(`http://localhost:8000/user-responses/${userId}`);
        const userResponsesData = await userResponsesResponse.json();
        console.log('User Responses:', userResponsesData);

        if (userResponsesData.userResponses.length > 0) {
          const initialResponses = userResponsesData.userResponses.reduce((accumulator, currentResponse) => {
            accumulator[`q${currentResponse.question_id}`] = currentResponse.option_selected || '';
            return accumulator;
          }, {});

          setResponses(initialResponses);
          calculateScore();
        } else {
          console.error('No user responses found for userId:', userId);
          // ... Reste du code ...
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // ... Reste du code ...
      }
    };

    fetchUserData();
  }, [userId]);

  const handleInputChange = (questionId, value) => {
    setResponses(prevResponses => ({ ...prevResponses, [questionId]: value }));
  };

  const calculateScore = () => {
    let newScore = 0;

    Object.entries(responses).forEach(([questionId, response]) => {
      switch (questionId) {
        case 'q59':
          newScore += response === 'Féminin' ? 1 : 0;
          break;
        case 'q9':
          newScore += response === 'Oui' ? 2 : 0;
          break;
        case 'q6':
          newScore += response === 'Oui' ? 1 : 0;
          break;
        case 'q43':
          newScore += response === 'Oui' ? 2 : 0;
          break;
        default:
          break;
      }
    });

    setScore(newScore);
    calculateResult(newScore);
  };

  const calculateResult = (score) => {
    let calculatedResult = '';

    if (score >= 0 && score <= 1) {
      calculatedResult = "Faible - Risque 21%";
    } else if (score >= 2 && score <= 3) {
      calculatedResult = "Intermédiaire - Risque 39%";
    } else if (score >= 4 && score <= 5) {
      calculatedResult = "Haut - Risque 61%";
    } else {
      calculatedResult = "Risque 79%";
    }

    setResult(calculatedResult);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    calculateScore();

    // Envoi du score au serveur
    try {
      const response = await fetch('http://localhost:8000/insert-Apfel-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          score,
          result,
        }),
      });

      const data = await response.json();
      if (data.success) {
        console.log('Apfel score inséré avec succès');
      } else {
        console.error('Erreur lors de l\'insertion du Apfel-score');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du score au serveur:', error);
    }
  };


  const handleGoToDashboard = () => {
    navigate('/', { state: { userId } });
  };

  return (
    <div>
      <h2>Apfel Score</h2>
      <form onSubmit={handleSubmit}>
      <label>
          Question 59:
          <select value={responses.q59} onChange={(e) => handleInputChange('q59', e.target.value)}>
            <option value="Féminin">Féminin</option>
            <option value="Masculin">Masculin</option>
          </select>
        </label>
        <label>
          Question 9:
          <select value={responses.q9} onChange={(e) => handleInputChange('q9', e.target.value)}>
            <option value="Oui">Oui</option>
            <option value="Non">Non</option>
          </select>
        </label>
        <label>
          Question 6:
          <select value={responses.q6} onChange={(e) => handleInputChange('q6', e.target.value)}>
            <option value="Oui">Oui</option>
            <option value="Non">Non</option>
          </select>
        </label>
        <label>
          Question 43:
          <select value={responses.q43} onChange={(e) => handleInputChange('q43', e.target.value)}>
            <option value="Oui">Oui</option>
            <option value="Non">Non</option>
          </select>
        </label>
        

        <button type="submit">Calculer le score</button>
      </form>

      <p>Score: {score}</p>
      <p>Result: {result}</p>
      <button onClick={handleGoToDashboard}>Go to Dashboard</button>
    </div>
  );
};

export default ApfelScorePage;
