import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import Dashboard from './Dashboard';
import DashboardAr from './DashboardAr';
import Resultat from './Resultat';
import IMCPage from './IMCPage';
import STOPBANGScorePage from './STOPBANGScorePage';
import DukeScorePage from './DukeScorePage';
import MeetScorePage from './MeetScorePage';
import NYHAScore from './NYHAScore';
import Docteur from './Docteur';
import AddUserInfo from './AddUserInfo';
import EditUserInfo from './EditUserInfo';
import UserScoresPage from './UserScoresPage';
import ApfelScorePage from './ApfelScorePage';
import LoginAdmin from './LoginAdmin';
import ListUsersPage from './ListUsersPage';

function App() {
  const [showLogin, setShowLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [adminId, setAdminId] = useState(null);

  const handleLogin = (userId) => {
    console.log('Received User ID in App:', userId);
    console.log('Login logic');
    setIsLoggedIn(true);
    setUserId(userId);
    
  };

// Inside the Signup component where you handle signup logic
const handleSignup = async (userId) => {
  console.log('Signup logic');
  // Additional logic for handling signup
};


  const togglePage = () => {
    setShowLogin(!showLogin);
  };

  const handleAdminLogin = (adminData) => {
    // Vous pouvez extraire l'ID de l'objet adminData ici
    setAdminId(adminData.user.id);
  };

  return (
    <Router>
      <Routes>
       <Route
  path="/"
  element={
    isLoggedIn ? (
      <AddUserInfo userId={userId} />
    ) : showLogin ? (
      <Login onLogin={(userId) => handleLogin(userId)} onSignupClick={togglePage} />
    ) : (
      <Signup onSignup={(userId) => handleSignup(userId)} onLoginClick={togglePage} />
    )
  }
/>
        <Route path="/login" element={<Login onLogin={(userId) => handleLogin(userId)} />} />
        <Route path="/" element={<App />} />
        <Route path="/Resultat" element={<Resultat />} />
        <Route path="/Docteur" element={<Docteur />} />
        <Route path="/Dashboard" element={<Dashboard userId={userId} />} />
        <Route path="/DashboardAr" element={<DashboardAr userId={userId} />} />
        <Route path="/AddUserInfo" element={<AddUserInfo userId={userId} />} />
        <Route path="/edit-user-info" element={<EditUserInfo userId={userId} />} />
        <Route path="/IMCPage" element={<IMCPage userId={userId} />} />

        <Route path="/STOPBANGScorePage/:userId" element={<STOPBANGScorePage />} />
        <Route path="/DukeScorePage/:userId" element={<DukeScorePage />} />
        <Route path="/MeetScorePage/:userId" element={<MeetScorePage />} />
        <Route path="/NYHAScore/:userId" element={<NYHAScore />} />
        <Route path="/ApfelScorePage/:userId" element={<ApfelScorePage />} />

        <Route path="/loginadmin" element={<LoginAdmin />} />
        <Route path="/listuserspage/:adminId" element={<ListUsersPage />} />
        <Route path="/userscorespage/:adminId/:userId" element={<UserScoresPage />} />
    

       
     
      </Routes>
    </Router>
  );
}

export default App;
