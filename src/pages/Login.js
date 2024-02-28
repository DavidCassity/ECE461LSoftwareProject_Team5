import React, { useState } from 'react';
import '../App.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = () => {

    if (username && password) {
      console.log('Login successful');
      setError('');
    } else {
      setError('Please enter both username and password');
    }
  };

  const toggleShowPassword = () => { 
    setShowPassword(!showPassword); 
}; 

  return (
    <div className="LoginPage">
      <h1>Login Page</h1>
      <div>
        <label>Username: </label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div>
      <label>Password: </label>
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={toggleShowPassword}>
          {showPassword ? 'Hide' : 'Show'} Password
        </button>
      </div>
      <button onClick={handleLogin}>Login</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Login;