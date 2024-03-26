import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Resultat.css'; // Import the CSS file


// Import the STOP-BANG questions
import { questions } from './data';

const Resultat = () => {
  const [userResponses, setUserResponses] = useState([]);
  const { userId } = useLocation().state;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserResponses = async () => {
      try {
        const response = await fetch(`http://localhost:8000/user-responses/${userId}`);
        const data = await response.json();
        setUserResponses(data.userResponses);
      } catch (error) {
        console.error('Error fetching user responses:', error);
      }
    };

    // Fetch user responses when the component mounts
    fetchUserResponses();
  }, [userId]);

  const handleLogout = () => {
        navigate('/');
  };
  const handleSB = () => {
   
    navigate('/STOPBANGScorePage/' + userId, { state: { userId } });
  };
  const handleDuke = () => {
   
    navigate(`/DukeScorePage/${userId}`, { state: { userId } });
  };
  const handleMeet = () => {
    
    navigate(`/MeetScorePage/${userId}`, { state: { userId } });
  };
  const handleNYHA = () => {
    
    navigate(`/NYHAScore/${userId}`, { state: { userId } });
  };
  const handleApfel = () => {
    
    navigate(`/ApfelScorePage/${userId}`, { state: { userId } });
  };
  
 

  if (!userResponses || userResponses.length === 0) {
    return <p>Aucune réponse trouvée pour cet utilisateur.</p>;
  }

  const currentUser = userResponses[0];


  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="resultat-container">
    <button class="score" onClick={handlePrint}>Imprimer</button>
    <h2 className="resultat-heading">Résultats de la consultation préanesthésique</h2>
    <div key={currentUser.id} className="user-result">
      <h3>User ID: {currentUser.user_id}</h3>
      <h4>Username: {currentUser.username}</h4>
      <h4>Email: {currentUser.email}</h4>
      <table >
      <tr>
          <td><button onClick={handleSB}>STOP BANG Score</button></td>
          <td><button onClick={handleDuke}>Duke</button></td>
          <td><button onClick={handleMeet}>Meet</button></td>
          <td><button onClick={handleNYHA}>NYHA</button></td>
          <td><button onClick={handleApfel}>Apfel</button></td>
        </tr>
      </table>
      <table className="resultat-table">
        <thead>
          <tr>
            <th>Question</th>
            <th>Response</th>
            <th>Commentaire</th>
          </tr>
        </thead>
        <tbody>
          {userResponses.map((response) => (
            <tr key={response.id}>
              <td>{response.questions}</td>
              <td>{response.option_selected}</td>
              <td>{response.comment}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
    </div>
    
  </div>
  );
};

export default Resultat;