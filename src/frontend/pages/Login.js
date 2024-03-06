import React, { useState } from 'react';
import '../../App.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (event) => {

    if (username && password) {
      console.log('Login successful');
      setError('');
    } else {
      setError('Please enter both username and password');
    }
    event.preventDefault();

  };

  const toggleShowPassword = () => { 
    setShowPassword(!showPassword); 
}; 

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
      <input type="submit" value="Login"/>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
    </form>
  );
};

export default Login;