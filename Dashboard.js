import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = ({ userId }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [comments, setComments] = useState({});
  const [insertSuccess, setInsertSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false); // Nouvel état local
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`http://localhost:8000/patients/${userId}/questions`);
        const data = await response.json();
        setQuestions(data.questions);
      } catch (error) {
        alert('Error fetching questions:' + error);
      }
    };

    // Fetch questions when the component mounts
    fetchQuestions();
  }, [userId]);

  const handleOptionChange = (questionId, option) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: option,
    }));
  };

  const handleCommentChange = (questionId, comment) => {
    setComments((prevComments) => ({
      ...prevComments,
      [questionId]: comment,
    }));
  };

  const handleNextQuestions = () => {
    // Vérifier si toutes les questions actuelles ont des réponses
    const currentQuestions = questions.slice(currentQuestionIndex, currentQuestionIndex + 10);
    const unansweredQuestions = currentQuestions.filter((question) => (
      !answers[question.id] && question.options.length > 0
    ));
  
    if (unansweredQuestions.length > 0) {
      alert('Veuillez répondre à toutes les questions avant de passer aux suivantes.');
      return;
    }
  
    setCurrentQuestionIndex((prevIndex) => prevIndex + 10);
    alert("Série de questions suivante commençant par Numero :" + (currentQuestionIndex + 10));
  };
  

  const handlePreviousQuestions = () => {
   
    setCurrentQuestionIndex((prevIndex) => Math.max(0, prevIndex - 10));
    alert("Série de questions précédente commençant :" + Math.max(0, currentQuestionIndex - 10));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Vérifier si toutes les questions ont des réponses
    const currentQuestions = questions.slice(currentQuestionIndex, currentQuestionIndex + 10);
    const unansweredQuestions = currentQuestions.filter((question) => (
      !answers[question.id] && question.options.length > 0
    ));
  
    if (unansweredQuestions.length > 0) {
      alert('Veuillez répondre à toutes les questions avant de soumettre le formulaire.');
      return;
    }
  
    if (formSubmitted) {
      alert('Le formulaire a déjà été soumis.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:8000/submit-answers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, answers, comments }),
      });
  
      if (response.ok) {
        const data = await response.json();
        alert('Server response: ' + JSON.stringify(data));
        navigate('/IMCPage', { state: { userId } });
        setInsertSuccess(true);
        setSubmittedData({ answers, comments });
        setFormSubmitted(true);
      } else {
        alert('Server returned an error: ' + response.status);
      }
    } catch (error) {
      alert('Error during form submission:' + error);
    }
  };
  
  const handleLogout = () => {
    navigate('/');
};
const handleLang = () => {
  navigate('/DashboardAr');
};


const handlePrintAllQuestions = () => {
  const printableContent = questions.map((question, index) => {
    // Include user's selected answers and comments
    const userAnswer = answers[question.id];
    const userComment = comments[question.id];

    // Generate printable content for each question
    return `
      ${index + 1}. ${question.text}
      Options: ${question.options.join(', ')}
      Your Answer: [${userAnswer || 'Not answered'}]
      Your Comment: ${userComment || 'No comment'}
    `;
  }).join('\n\n');

  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title>Printable Questions with Answers</title>
        <style>
          @media print {
            input[type="checkbox"] {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <pre>${printableContent}</pre>
        <script>
          window.onload = function() {
            const checkboxes = document.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(function(checkbox) {
              const label = document.createElement('label');
              label.innerHTML = checkbox.getAttribute('data-label');
              checkbox.parentNode.insertBefore(label, checkbox.nextSibling);
            });
          };
        </script>
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.print();
};
  // Render loading state while fetching questions
  if (questions.length === 0) {
    return <p>Loading...</p>;
  }

  const currentQuestions = questions.slice(currentQuestionIndex, currentQuestionIndex + 10);
  const isFormSubmitted = submittedData !== null;
  const handlePlayAudio = (audioSrc) => {
    const audio = new Audio(audioSrc);
    audio.play();
  };
  return (
    <div className='dashboard-container'>
      
      <button className='imp_dh' type="button" onClick={handlePrintAllQuestions}>Imprimer</button>
      <button className='imp_dh' type="button" onClick={handleLang}>Arabic</button>
      <h1 className='titre_fiche'>Fiche de renseignement pour consultation préanesthésique</h1>
      <form className='f_dh' onSubmit={handleSubmit}>
        {currentQuestions.map((currentQuestion) => (
          <div key={currentQuestion.id}>
             {currentQuestion.audio && (
                <div className="audio-player">
                  <span className="play-icon" onClick={() => handlePlayAudio(currentQuestion.audio)}>             
                    ▶
                  </span>
                  
                </div>
              )}

             

            <label>{currentQuestion.text}</label><br />
            {currentQuestion.options.map((option) => (
              <label key={option}>
                <input  type="radio" name={currentQuestion.id} value={option} checked={isFormSubmitted ? submittedData.answers[currentQuestion.id] === option : answers[currentQuestion.id] === option}
                  onChange={() => handleOptionChange(currentQuestion.id, option)} required/>
                {option}
              </label>
            ))}
            {currentQuestion && currentQuestion.options.length === 0 && (
                <input type="text" name={`comment_${currentQuestion.id}`} value={isFormSubmitted ? submittedData.comments[currentQuestion.id] || '' : comments[currentQuestion.id] || ''}
                onChange={(e) => handleCommentChange(currentQuestion.id, e.target.value)}  placeholder="repond..." required // Ajoutez l'attribut required ici
              />
            )}
         
          </div>
        ))}
        
        {currentQuestionIndex > 0 && (
          <button  className='ret' type="button" onClick={handlePreviousQuestions}>Retour</button>
        )}
        {currentQuestionIndex < questions.length - 10 && (
          <button  className='suiv' type="button" onClick={handleNextQuestions}>Suivantes</button>
        )}
        {currentQuestionIndex >= questions.length - 10 && (
          <button className='soum' ctype="submit">Soumettre</button>
        )}
      </form>
    </div>
  );
};

export default Dashboard;
