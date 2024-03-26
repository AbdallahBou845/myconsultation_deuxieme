import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import './ScorePage.css';


const STOPBANGScorePage = () => {
  const { userId } = useParams();
  const [score, setScore] = useState(0);
  const [result, setResult] = useState('');
  const [responses, setResponses] = useState({
    q23: '',
    q24: '',
    q25: '',
  });
  const [imcValue, setImcValue] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponsesResponse = await fetch(`http://localhost:8000/user-responses/${userId}`);
        const userResponsesData = await userResponsesResponse.json();
        console.log('User Responses:', userResponsesData);
  
        const imcResponse = await fetch(`http://localhost:8000/imc/${userId}`);
        const imcData = await imcResponse.json();
  
        if (userResponsesData.userResponses.length > 0) {
          const initialResponses = userResponsesData.userResponses.reduce((accumulator, currentResponse) => {
            accumulator[`q${currentResponse.question_id}`] = currentResponse.option_selected || '';
            return accumulator;
          }, {});
          
          setResponses(initialResponses);
          setImcValue(imcData.imcData.imc_value);
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
  
  const handlePrint = () => {
    window.print();
  };


  const handleInputChange = (questionId, value) => {
    setResponses(prevResponses => ({ ...prevResponses, [questionId]: value }));
  };

  const handleImcChange = (value) => {
    setImcValue(value);
  };

  const calculateScore = () => {
    let newScore = 0;

    Object.entries(responses).forEach(([questionId, response]) => {
      switch (questionId) {
        case 'q23':
          newScore += response === 'Non' ? 0 : response === 'Parfois' ? 1 : response === 'Toujours' ? 2 : 0;
          break;
        case 'q24':
          newScore += response === 'Oui' ? 1 : 0;
          break;
        case 'q25':
          newScore += response === 'Oui' ? 1 : 0;
          break;
        default:
          break;
      }
    });
    console.log('Reponse', responses);
    newScore += imcValue > 35 ? 1 : 0;
    console.log('imcValue', imcValue);
    setScore(newScore);
    calculateResult(newScore);
  };

  const calculateResult = (score) => {
    let calculatedResult = '';

    if (score >= 0 && score <= 2) {
      calculatedResult = "Faible - Risque d'AOS modérée à sévère";
    } else if (score >= 3 && score <= 4) {
      calculatedResult = "Intermédiaire - Risque d'AOS modérée à sévère";
    } else if (score >= 5 && score <= 7) {
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
      const response = await fetch('http://localhost:8000/insert-stopbang-score', {
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
        console.log('Score STOP-BANG inséré avec succès');
      } else {
        console.error('Erreur lors de l\'insertion du score STOP-BANG');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du score au serveur:', error);
    }
  };

  const handleGoToDashboard = () => {
    navigate('/', { state: { userId } });
  };

  return (
    <div id='stopbangForm'>
      <button class="score" onClick={handlePrint}>Imprimer</button>
      <h2>STOP-BANG Score</h2>
      <form class="score" onSubmit={handleSubmit}>
        <label>
          Question 23:
          <select value={responses.q23} onChange={(e) => handleInputChange('q23', e.target.value)}>
            <option value="Toujours">Toujours</option>
            <option value="Parfois">Parfois</option>
            <option value="Non">Non</option>
          </select>
        </label>
        <br />

        <label>
          Question 24:
          <select value={responses.q24} onChange={(e) => handleInputChange('q24', e.target.value)}>
            <option value="Oui">Oui</option>
            <option value="Non">Non</option>
          </select>
        </label>
        <br />

        <label>
          Question 25:
          <select value={responses.q25} onChange={(e) => handleInputChange('q25', e.target.value)}>
            <option value="Oui">Oui</option>
            <option value="Non">Non</option>
          </select>
        </label>
        <br />

        <label>
          IMC:
          <input type="number" value={imcValue} onChange={(e) => handleImcChange(e.target.value)} />
        </label>
        <br />

        <button type="submit">Calculer le score</button>
      </form>

      <p class="score">Score: {score}</p>
      <p class="score">Result: {result}</p>
      
    </div>
  );
};

export default STOPBANGScorePage;
