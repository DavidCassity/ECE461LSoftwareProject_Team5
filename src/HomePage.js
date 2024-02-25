import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';

const HomePage = () => {
  return (
    <div>
      <Header />
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Welcome to Hardware Storage</h2>
        <Link to="/login">
          <button>Login</button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
