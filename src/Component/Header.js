// Header.js

import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div>
          <Link to="/">Acceuil</Link>
          <Link to="/Docteur">Docteur</Link>
    </div> 
  );
};

export default Header;
