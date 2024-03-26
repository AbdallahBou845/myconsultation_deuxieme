import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import './ScorePage.css';


const DukeScorePage = () => {
  const { userId } = useParams();
  const [score, setScore] = useState(0);
  const [result, setResult] = useState('');
  const [responses, setResponses] = useState({
    q31: '',
    q32: '',
    q33: '',
    q34: '',
    q35: '',
    q36: '',
    q37: '',
    q38: '',
    q39: '',
    q40: '',
    q41: '',
    q42: '',
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
  const handleLogout = () => {
    navigate('/');
};
const handlePrint = () => {
  window.print();
};

  const calculateScore = () => {
    let newScore = 0;

    Object.entries(responses).forEach(([questionId, response]) => {
      switch (questionId) {
        case 'q31':
          newScore += response === 'Oui' ? 1.75 : 0;
          break;
        case 'q32':
          newScore += response === 'Oui' ? 2.75 : 0;
          break;
        case 'q33':
          newScore += response === 'Oui' ? 5.5 : 0;
          break;
        case 'q34':
          newScore += response === 'Oui' ? 8 : 0;
          break;
        case 'q35':
          newScore += response === 'Oui' ? 2.7 : 0;
          break;
        case 'q36':
          newScore += response === 'Oui' ? 3.5 : 0;
          break;
          case 'q37':
          newScore += response === 'Oui' ? 8 : 0;
          break;
        case 'q38':
          newScore += response === 'Oui' ? 4.5 : 0;
          break;
        case 'q39':
          newScore += response === 'Oui' ? 5.25 : 0;
          break;
          case 'q40':
          newScore += response === 'Oui' ? 6 : 0;
          break;
        case 'q41':
          newScore += response === 'Oui' ? 7.5 : 0;
          break;
        case 'q42':
          newScore += response === 'Oui' ? 2.75 : 0;
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

    if (score >= 0 && score <= 18) {
      calculatedResult = "Faible - Risque d'AOS modérée à sévère";
    } else if (score >= 19 && score <= 37) {
      calculatedResult = "Intermédiaire - Risque d'AOS modérée à sévère";
    } else if (score >= 38 && score <= 56) {
      calculatedResult = "Haut - Risque d'AOS modérée à sévère";
    } else {
      calculatedResult = "Risque indéterminé";
    }

    setResult(calculatedResult);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    calculateScore();

    // Envoi du score au serveur
    try {
      const response = await fetch('http://localhost:8000/insert-duke-score', {
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
        console.log('Score Duke inséré avec succès');
      } else {
        console.error('Erreur lors de l\'insertion du Duke');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du score au serveur:', error);
    }
  };


  const handleGoToDashboard = () => {
    navigate('/UserScoresPage', { state: { userId } });
  };

  return (
    <div id='dukeForm'>
      <button class="score" onClick={handlePrint}>Imprimer</button>
      <h2>Duke Score</h2>
      <form class="score"  onSubmit={handleSubmit}>
      <label>
          Question 31:
          <select value={responses.q31} onChange={(e) => handleInputChange('q31', e.target.value)}>
            <option value="Oui">Oui</option>
            <option value="Non">Non</option>
          </select>
        </label>
        <label>
          Question 32:
          <select value={responses.q32} onChange={(e) => handleInputChange('q32', e.target.value)}>
            <option value="Oui">Oui</option>
            <option value="Non">Non</option>
          </select>
        </label>
        <label>
          Question 33:
          <select value={responses.q33} onChange={(e) => handleInputChange('q33', e.target.value)}>
            <option value="Oui">Oui</option>
            <option value="Non">Non</option>
          </select>
        </label>
        <label>
          Question 34:
          <select value={responses.q34} onChange={(e) => handleInputChange('q34', e.target.value)}>
            <option value="Oui">Oui</option>
            <option value="Non">Non</option>
          </select>
        </label>
        <label>
          Question 35:
          <select value={responses.q35} onChange={(e) => handleInputChange('q35', e.target.value)}>
            <option value="Oui">Oui</option>
            <option value="Non">Non</option>
          </select>
        </label>
        <label>
          Question 36:
          <select value={responses.q36} onChange={(e) => handleInputChange('q36', e.target.value)}>
            <option value="Oui">Oui</option>
            <option value="Non">Non</option>
          </select>
        </label>
        <label>
          Question 37:
          <select value={responses.q37} onChange={(e) => handleInputChange('q37', e.target.value)}>
            <option value="Oui">Oui</option>
            <option value="Non">Non</option>
          </select>
        </label>
        <label>
          Question 38:
          <select value={responses.q38} onChange={(e) => handleInputChange('q38', e.target.value)}>
            <option value="Oui">Oui</option>
            <option value="Non">Non</option>
          </select>
        </label>
        <label>
          Question 39:
          <select value={responses.q39} onChange={(e) => handleInputChange('q39', e.target.value)}>
            <option value="Oui">Oui</option>
            <option value="Non">Non</option>
          </select>
        </label>
        <label>
          Question 40:
          <select value={responses.q40} onChange={(e) => handleInputChange('q40', e.target.value)}>
            <option value="Oui">Oui</option>
            <option value="Non">Non</option>
          </select>
        </label>
        <label>
          Question 41:
          <select value={responses.q41} onChange={(e) => handleInputChange('q41', e.target.value)}>
            <option value="Oui">Oui</option>
            <option value="Non">Non</option>
          </select>
        </label>
        <label>
          Question 42:
          <select value={responses.q42} onChange={(e) => handleInputChange('q42', e.target.value)}>
            <option value="Oui">Oui</option>
            <option value="Non">Non</option>
          </select>
        </label>

        <button type="submit">Calculer le score</button>
      </form>

      <p  class="score">Score: {score}</p>
      <p  class="score">Result: {result}</p>
      
    </div>
  );
};

export default DukeScorePage;
