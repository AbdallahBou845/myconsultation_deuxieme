import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './UserScoresPage.css';

const UserScoresPage = () => {
  const [userScores, setUserScores] = useState([]);
  const { userId, adminId } = useParams();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({});

  const navigateToScorePage = (scoreType) => {
    switch (scoreType) {
      case 'Duke':
        console.log('Navigating to DukeScorePage with userId:', userId);
        navigate(`/DukeScorePage/${userId}`, { state: { userId, adminId } });
        break;
      case 'Meet':
        console.log('Navigating to MeetScorePage with userId:', userId);
        navigate(`/MeetScorePage/${userId}`, { state: { userId, adminId } });
        break;
      case 'NYHA':
        console.log('Navigating to NYHAScore with userId:', userId);
        navigate(`/NYHAScore/${userId}`, { state: { userId, adminId } });
        break;
      case 'Apfel':
        console.log('Navigating to ApfelScorePage with userId:', userId);
        navigate(`/ApfelScorePage/${userId}`, { state: { userId, adminId } });
        break;
      case 'STOPBANG':
        console.log('Navigating to STOPBANGScorePage with userId:', userId);
        navigate(`/STOPBANGScorePage/${userId}`, { state: { userId, adminId } });
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const fetchUserScores = async () => {
      try {
        const response = await fetch(`http://localhost:8000/all-user-scores/${userId}`);
        const data = await response.json();

        const sanitizedData = JSON.parse(JSON.stringify(data, (key, value) => {
          if (key === '_timer') return undefined;
          return value;
        }));

        setUserScores(sanitizedData.userScores || []);
      } catch (error) {
        console.error(`Erreur lors de la récupération des scores pour l'utilisateur ${userId}:`, error);
      }
    };

    const fetchUserInfo = async () => {
      try {
        const response = await fetch(`http://localhost:8000/user-info/${userId}`);
        const data = await response.json();

        setUserInfo(data.userInfo || {});
      } catch (error) {
        console.error(`Erreur lors de la récupération des informations de l'utilisateur ${userId}:`, error);
      }
    };

    fetchUserScores();
    fetchUserInfo();
  }, [userId]);

  return (
    <div className="user-scores-container">
      <h2>Profil de Patient</h2>
      <table className="user-scores-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Age</th>
            <th>Weight</th>
          </tr>
        </thead>
        <tbody>
          <tr key={`user-${userInfo.userId}`}>
            <td>{userInfo.username}</td>
            <td>{userInfo.age}</td>
            <td>{userInfo.poids}</td>
          </tr>
        </tbody>
      </table>

      <table className="user-scores-table">
        <thead>
          <tr>
            <th>Duke Score</th>
            <th>Meet Score</th>
            <th>NYHA Score</th>
            <th>Apfel Score</th>
            <th>STOP-BANG Score</th>
          </tr>
        </thead>
        <tbody>
          {userScores.length > 0 && (
            <tr key={`user-${userScores[0].userId}`}>
              <td>{userScores[0].duke_score}</td>
              <td>{userScores[0].meet_score }</td>
              <td>{userScores[0].nyha_score }</td>
              <td>{userScores[0].apfel_score }</td>
              <td>{userScores[0].stopbang_score }</td>
            </tr>
          )}
        </tbody>
        <tr>
          <td><button onClick={() => navigateToScorePage('Duke')}>Cliquez</button></td>
          <td><button onClick={() => navigateToScorePage('Meet')}>Cliquez</button></td>
          <td><button onClick={() => navigateToScorePage('NYHA')}>Cliquez</button></td>
          <td><button onClick={() => navigateToScorePage('Apfel')}>Cliquez</button></td>
          <td><button onClick={() => navigateToScorePage('STOPBANG')}>Cliquez</button></td>
        </tr>
      </table>
    </div>
  );
};

export default UserScoresPage;
