// Admin.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom';
import LoginAdmin from './LoginAdmin';
import SignupAdmin from './SignupAdmin';
import Dashboard from './Dashboard';
import Resultat from './Resultat';
import Docteur from './Docteur';



function Admin() {
  const [showLogin, setShowLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  

  const handleLogin = (userId) => {
    console.log('Received User ID in Admin:', userId);
    console.log('Login logic');
    setIsLoggedIn(true);
    setUserId(userId);
    
  };

  const handleSignup = () => {
    console.log('Signup logic');
   
  };

  const togglePage = () => {
    setShowLogin(!showLogin);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Dashboard userId={userId} />
            ) : showLogin ? (
              <LoginAdmin onLogin={(userId) => handleLogin(userId)} onSignupClick={togglePage} />
            ) : (
              <SignupAdmin onSignup={handleSignup} onLoginClick={togglePage} />
            )
          }
        />
        
        
      </Routes>
    </Router>
  );
}

export default Admin;
