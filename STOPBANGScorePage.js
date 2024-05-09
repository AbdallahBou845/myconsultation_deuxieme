import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ScorePage.css';

const STOPBANGScorePage = () => {
  const { userId } = useParams();
  const [score, setScore] = useState(0);
  const [result, setResult] = useState('');
  const [responses, setResponses] = useState({ q23: '', q24: '', q25: '' });
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

          // Appel de calculateScore dès que les données sont disponibles
          calculateScore(initialResponses, imcData.imcData.imc_value);
        } else {
          console.error('No user responses found for userId:', userId);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
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

  const calculateScore = (userResponses, imc) => {
    let newScore = 0;

    Object.entries(userResponses).forEach(([questionId, response]) => {
      switch (questionId) {
        case 'q23':
          newScore += response === 'Non' ? 0 : response === 'Parfois' ? 1 : response === 'Toujours' ? 2 : 0;
          break;
        case 'q24':
        case 'q25':
          newScore += response === 'Oui' ? 1 : 0;
          break;
        default:
          break;
      }
    });

    newScore += imc > 35 ? 1 : 0;
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

  const handleSubmit = async () => {
    // Pas besoin de recalcule, car le score a déjà été calculé lors de l'affichage initial
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

  return (
    <div id='stopbangForm'>
      <button className="score" onClick={handlePrint}>Imprimer</button>
      <h2>STOP-BANG Score</h2>
      <form className="score">
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

        {/* Soumission du formulaire avec le bouton */}
        <button type="button" onClick={handleSubmit}>Calculer et insérer le score</button>
      </form>

      <p className="score">Score: {score}</p>
      <p className="score">Result: {result}</p>
    </div>
  );
};

export default STOPBANGScorePage;
