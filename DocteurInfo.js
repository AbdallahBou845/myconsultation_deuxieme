// DocteurInfo.js (ou Docteur.js selon votre choix)
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const DocteurInfo = () => {
  // Utilisez useParams pour extraire docteurId de l'URL
  const { docteurId } = useParams();
  const [docteurData, setDocteurData] = useState(null);

  useEffect(() => {
    const fetchDocteurData = async () => {
      try {
        // Effectuer une requête à l'API pour obtenir les informations du docteur
        const response = await fetch(`/docteur/${docteurId}`);
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données du docteur');
        }

        // Convertir la réponse en JSON
        const data = await response.json();

        // Mettez à jour l'état avec les données du docteur
        setDocteurData(data.docteur);
      } catch (error) {
        console.error('Erreur:', error.message);
      }
    };

    // Appeler la fonction fetchDocteurData
    fetchDocteurData();
  }, [docteurId]);

  if (!docteurData) {
    return <div>Loading...</div>;
  }

  // Afficher les informations du docteur ici

  return (
    <div>
      <h1>Informations du docteur</h1>
      {/* Afficher les détails du docteur */}
      <p>Nom: {docteurData.nom}</p>
      <p>Spécialité: {docteurData.specialite}</p>
      {/* Ajoutez d'autres détails en fonction de votre modèle de données */}
    </div>
  );
};

export default DocteurInfo;
