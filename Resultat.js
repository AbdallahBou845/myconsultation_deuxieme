import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Resultat.css'; // Importer le fichier CSS

// Importer les questions depuis data.js
import { questions } from './data';

const Resultat = () => {
  const [userResponses, setUserResponses] = useState([]);
  const { userId } = useLocation().state;
  const [currentPage, setCurrentPage] = useState(1); // Ajout de l'état pour la page actuelle
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserResponses = async () => {
      try {
        const response = await fetch(`http://localhost:8000/user-responses/${userId}`);
        const data = await response.json();
        setUserResponses(data.userResponses);
      } catch (error) {
        console.error('Erreur lors de la récupération des réponses utilisateur :', error);
      }
    };

    // Récupérer les réponses utilisateur lorsque le composant est monté
    fetchUserResponses();
  }, [userId]);

  const handleLogout = () => {
    navigate('/');
  };

  const handlePrint = () => {
    window.print();
  };

  const questionsPerPage = 10; // Nombre de questions par page

  // Index de la première et dernière question de la page actuelle
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;

  // Questions à afficher sur la page actuelle
  const currentQuestions = questions.slice(indexOfFirstQuestion, indexOfLastQuestion);

  // Fonction pour passer à la page suivante
  const nextPage = () => {
    if (currentPage < Math.ceil(questions.length / questionsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Fonction pour revenir à la page précédente
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="container mt-4">
      <button className="btn btn-primary mr-2" onClick={handlePrint}>Imprimer</button>
      <button className="btn btn-danger" onClick={handleLogout}>Déconnexion</button>
      <h2 className="my-4">Résultats de la consultation préanesthésique</h2>
      <div className="user-result">
        {/* Afficher les questions, leur ID et les réponses utilisateur */}
        <table className="table">
          <thead className="thead-dark">
            <tr>
              <th>ID</th>
              <th>Question</th>
              <th>Response</th>
            </tr>
          </thead>
          <tbody>
            {currentQuestions.map((question, index) => (
              <tr key={index}>
                <td>{question.id}</td>
                <td>{question.text}</td>
                <td>{userResponses[indexOfFirstQuestion + index]?.option_selected}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Bouton "Suivant" en bas de la table */}
        <div className="pagination">
          <button className="btn btn-primary mr-2" onClick={prevPage} disabled={currentPage === 1}>Précédent</button>
          <button className="btn btn-primary" onClick={nextPage} disabled={currentPage === Math.ceil(questions.length / questionsPerPage)}>Suivant</button>
        </div>
      </div>
    </div>
  );
};

export default Resultat;
