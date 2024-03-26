// Layout.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './Sidebar';


import './Layout.css';

const Layout = () => {
  return (
    <Router>
      <div className="container-fluid">
        <div className="row">
          <div className="col-2">
            <Sidebar />
          </div>
          <div className="col-10">
            <Routes>
              <Route path="/Sidebar" element={<Sidebar />} />
              {/* Add more routes for other components */}
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default Layout;