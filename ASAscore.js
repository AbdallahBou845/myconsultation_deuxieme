import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ScorePage.css';

const ASAscore = () => {
  const { userId } = useParams();
  const [score, setScore] = useState(0);
  const [result, setResult] = useState('');
  const [responses, setResponses] = useState({
    q1: '',
    q2: '',
    q3: '',
    q4: '',
    q5: '',
    q6: '',
    q7: '',
    q8: '',
    q9: '',
    q10: '',
    q11: '',
    q12: '',
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
          calculateScore(initialResponses); // Appel de calculateScore une fois les données initialisées
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

  const calculateScore = (userResponses) => { // prenez les réponses utilisateur comme argument
    let newScore = 0;

    Object.entries(userResponses).forEach(([questionId, response]) => {
      switch (questionId) {
        case 'q1':
          newScore += response === 'Oui' ? 2 : 0;
          break;
        case 'q2':
          newScore += response === 'Oui' ? 3 : 0;
          break;
        case 'q3':
          newScore += response === 'Oui' ? 2 : 0;
          break;
        case 'q4':
          newScore += response === 'Oui' ? 2 : 0;
          break;
        case 'q5':
          newScore += response === 'Oui' ? 3 : 0;
          break;
        case 'q6':
          newScore += response === 'Oui' ? 2 : 0;
          break;
        case 'q7':
          newScore += response === 'Oui' ? 2 : 0;
          break;
        case 'q8':
          newScore += response === 'Oui' ? 3 : 0;
          break;
        case 'q9':
          newScore += response === 'Oui' ? 2 : 0;
          break;
        case 'q10':
          newScore += response === 'Oui' ? 2 : 0;
          break;
        case 'q11':
          newScore += response === 'Oui' ? 3 : 0;
          break;
        case 'q12':
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
    calculateScore(responses); // Passer les réponses utilisateur à calculateScore

    // Envoi du score au serveur
    try {
      const response = await fetch('http://localhost:8000/asa-score', {
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
        console.log('Score ASA inséré avec succès');
      } else {
        console.error('Erreur lors de l\'insertion du score ASA');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du score au serveur:', error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id='imc'>
      <h2>ASA Score</h2>
      <form className="score" onSubmit={handleSubmit}>
        <label>
          Question 1:
          <select value={responses.q1} onChange={(e) => handleInputChange('q1', e.target.value)}>
            <option value="Oui">Oui</option>
            <option value="Non">Non</option>
          </select>
        </label>
        <br />
        <label>
          Question 2:
          <select value={responses.q2} onChange={(e) => handleInputChange('q2', e.target.value)}>
            <option value="Oui">Oui</option>
            <option value="Non">Non</option>
          </select>
        </label>
        <br />
        <label>
          Question 3:
          <select value={responses.q3} onChange={(e) => handleInputChange('q3', e.target.value)}>
            <option value="Oui">Oui</option>
            <option value="Non">Non</option>
          </select>
        </label>
        <br />
        <label>
          Question 4:
          <select value={responses.q4} onChange={(e) => handleInputChange('q4', e.target.value)}>
            <option value="Oui">Oui</option>
            <option value="Non">Non</option>
          </select>
        </label>
        <br />
        <label>
          Question 5:
          <select value={responses.q5} onChange={(e) => handleInputChange('q5', e.target.value)}>
            <option value="Oui">Oui</option>
            <option value="Non">Non</option>
          </select>
        </label>
        <br />
        <label>
          Question 6:
          <select value={responses.q6} onChange={(e) => handleInputChange('q6', e.target.value)}>
            <option value="Oui">Oui</option>
            <option value="Non">Non</option>
          </select>
        </label>
        <br />
        <label>
          Question 7:
          <select value={responses.q7} onChange={(e) => handleInputChange('q7', e.target.value)}>
            <option value="Oui">Oui</option>
            <option value="Non">Non</option>
          </select>
        </label>
        <br />
        <label>
          Question 8:
          <select value={responses.q8} onChange={(e) => handleInputChange('q8', e.target.value)}>
            <option value="Oui">Oui</option>
            <option value="Non">Non</option>
          </select>
        </label>
        <br />
        <label>
          Question 9:
          <select value={responses.q9} onChange={(e) => handleInputChange('q9', e.target.value)}>
            <option value="Oui">Oui</option>
            <option value="Non">Non</option>
          </select>
        </label>
        <br />
        <label>
          Question 10:
          <select value={responses.q10} onChange={(e) => handleInputChange('q10', e.target.value)}>
            <option value="Oui">Oui</option>
            <option value="Non">Non</option>
          </select>
        </label>
        <br />
        <label>
          Question 11:
          <select value={responses.q11} onChange={(e) => handleInputChange('q11', e.target.value)}>
            <option value="Oui">Oui</option>
            <option value="Non">Non</option>
          </select>
        </label>
        <br />
        <label>
          Question 12:
          <select value={responses.q12} onChange={(e) => handleInputChange('q12', e.target.value)}>
            <option value="Oui">Oui</option>
            <option value="Non">Non</option>
          </select>
        </label>
        <br />
        {/* Ajoutez d'autres questions ici */}
        <button type="submit">Calculer le score</button>
      </form>

      <p className="score">Score: {score}</p>
      <p className="score">Result: {result}</p>
      <button onClick={handlePrint}>Imprimer</button>
    </div>
  );
};

export default ASAscore;
