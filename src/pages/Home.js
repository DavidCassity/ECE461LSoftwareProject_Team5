import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import circuit from '../images/circuit.jpg'

const Home = () => {
  return (
    <div>
      <img src={circuit} width={500} />
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

export default Home;
