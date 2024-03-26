import React from 'react';
import { Link } from 'react-router-dom';

const Docteur = () => {
  // Vous devez définir docteurId ici ou utiliser useParams() s'il est défini dans ce composant
  const docteurId = "123"; // Remplacez cela par votre logique pour obtenir docteurId

  return (
    <div className="container-fluid">
      <Link to={`/docteur/${docteurId}`}>Consulter mes informations</Link>
    </div>
  );
};

export default Docteur;
