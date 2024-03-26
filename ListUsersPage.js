// ListUsersPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import './ListUsersPage.css';

const ListUsersPage = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const { adminId } = useParams();
  console.log('Admin ID from ListUsersPage:', adminId);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8000/users');
        const userData = await response.json();

        setUsers(userData);
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleUserClick = (userId) => {
    navigate(`/userscorespage/${adminId}/${userId}`);
  };
  console.log('Admin ID:', adminId);
  return (
    <div className="list-users-container">
      <h2>Liste des Utilisateurs</h2>
      <ul className="user-list">
        {users.map((user) => (
          <li key={user.id} className="user-list-item" onClick={() => handleUserClick(user.id)}>
            {user.username}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListUsersPage;
