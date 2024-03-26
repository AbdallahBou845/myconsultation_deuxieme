import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import './ScorePage.css';

const NYHAScorePage = () => {
  const { userId } = useParams();
  const [score, setScore] = useState(0);
  const [result, setResult] = useState('');
  const [responses, setResponses] = useState({
    q44: '',
    q45: '',
    q46: '',
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
        case 'q44':
          newScore += response === 'Oui' ? 2 : 0;
          break;
        case 'q45':
          newScore += response === 'Oui' ? 3 : 0;
          break;
        case 'q46':
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

    if (score >= 0 && score <= 2) {
      calculatedResult = "Class IV";
    } else if (score >= 3 && score <= 5) {
      calculatedResult = "Class III";
    } else if (score >= 6 && score <= 7) {
      calculatedResult = "Class II";
    } else {
      calculatedResult = "Class I";
    }

    setResult(calculatedResult);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    calculateScore();

    // Envoi du score au serveur
    try {
      const response = await fetch('http://localhost:8000/insert-nyha-score', {
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
        console.log('Score NYHA inséré avec succès');
      } else {
        console.error('Erreur lors de l\'insertion du score NYHA');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du score au serveur:', error);
    }
  };

  const handleGoToDashboard = () => {
    navigate('/', { state: { userId } });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id='imc'>
      <h2>NYHA Score</h2>
      <form class="score" onSubmit={handleSubmit}>
        <label>
          Question 44:
          <select value={responses.q44} onChange={(e) => handleInputChange('q44', e.target.value)}>
            <option value="Oui">Oui</option>
            <option value="Non">Non</option>
          </select>
        </label>
        <br />
        <label>
          Question 45:
          <select value={responses.q45} onChange={(e) => handleInputChange('q45', e.target.value)}>
            <option value="Oui">Oui</option>
            <option value="Non">Non</option>
          </select>
        </label>
        <br />
        <label>
          Question 46:
          <select value={responses.q46} onChange={(e) => handleInputChange('q46', e.target.value)}>
            <option value="Oui">Oui</option>
            <option value="Non">Non</option>
          </select>
        </label>
        <br />

        <button type="submit">Calculer le score</button>
      </form>

      <p class="score">Score: {score}</p>
      <p class="score">Result: {result}</p>
      <button onClick={handlePrint}>Imprimer</button>
    </div>
  );
};

export default NYHAScorePage;
