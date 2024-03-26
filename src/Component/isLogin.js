// isLogin.js

import React from 'react';
import Login from '../../Login';
import Signup from '../../signup';
import Dashboard from '../../Dashboard'

const isLogin = () => {
    const [showLogin, setShowLogin] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);

    const handleLogin = (userId) => {
        console.log('Received User ID in App:', userId); // Add this line for debugging
        // Logique pour le traitement de la connexion 
        console.log('Login logic');
        setIsLoggedIn(true); 
        setUserId(userId);
       
      };
     
     
      const handleSignup = () => {
        // Logique pour le traitement de l'inscription
        console.log('Signup logic');
        
      };
    
      const togglePage = () => {
        setShowLogin(!showLogin);
      };

  return (
    <div>
      {isLoggedIn ? (
        <Dashboard userId={userId} />
      ) : (
        showLogin ? (
          <Login onLogin={(userId) => handleLogin(userId)} onSignupClick={togglePage} />

        ) : (
          <Signup onSignup={handleSignup} onLoginClick={togglePage} />
        )
      )}
    </div>
  );
};

export default isLogin;
