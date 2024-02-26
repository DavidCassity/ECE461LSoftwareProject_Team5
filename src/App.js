// App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import ProjectManagementPage from './ProjectManagementPage';
import SignUpPage from './SignUpPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/project-management" element={<ProjectManagementPage />} />
      </Routes>
    </Router>
  );
};

export default App;
