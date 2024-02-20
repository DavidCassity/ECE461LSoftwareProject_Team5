import React, { useState } from 'react';
import './App.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    // Add your login logic here
    // For simplicity, I'm just checking if both fields are filled
    if (username && password) {
      // Successful login
      console.log('Login successful');
      setError('');
    } else {
      setError('Please enter both username and password');
    }
  };

  return (
    <div className="App">
      <h1>Login Page</h1>
      <div>
        <label>Username:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button onClick={handleLogin}>Login</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default LoginPage;