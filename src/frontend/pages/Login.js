import React, { useState, useEffect } from 'react';
import '../../App.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const [authenticated, setAuthenticated] = useState(false);

  const handleLogin = async (e) => {

    e.preventDefault(); // Prevent default form submission behavior
    console.log(username, password);
    
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Set Content-Type to JSON
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      setAuthenticated(data.authenticated);
      console.log(data.authenticated);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const toggleShowPassword = () => { 
    setShowPassword(!showPassword); 
  }; 

  useEffect(() => {
    console.log(authenticated);
  }, [authenticated]); // Execute the effect whenever 'authenticated' changes


  return (
    <form onSubmit={handleLogin}>
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
      </div>
      <div>
        <input type="checkbox" checked={showPassword} onChange={toggleShowPassword} />
        <label>Show password</label>
      </div>
      <div>
      <input type="submit" value="Login"/>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {authenticated ? <p>Authenticated!</p> : <p>Not Authenticated</p>}
      </div>
    </div>
    
    </form>
  );
};

export default Login;