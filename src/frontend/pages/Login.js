import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);

  const navigate = useNavigate();

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
      if(data.authenticated) {
        navigate('/projects');
      }
      else {
        setLoginFailed(true);
      }

    } catch (error) {
      console.error('Error:', error);
    }
  };

  const usernameChange = (e) => {
    setUsername(e.target.value);
    setLoginFailed(false);
  }

  const passwordChange = (e) => {
    setPassword(e.target.value);
    setLoginFailed(false);
  }

  const toggleShowPassword = () => { 
    setShowPassword(!showPassword); 
  }; 

  useEffect(() => {
    console.log(authenticated);
  }, [authenticated]); // Execute the effect whenever 'authenticated' changes


  return (
    <form onSubmit={handleLogin}>
    <div className="LoginPage">
      <h1>Login</h1>
      <div>
        <input id="textbox" placeholder="Username ID" type="text" value={username} onChange={usernameChange} />
      </div> 
      <div>
          <input id="textbox" placeholder="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={passwordChange}
          />
      </div>
      <div>
        <input type="checkbox" checked={showPassword} onChange={toggleShowPassword} />
        <label id="showpassword">Show password</label>
        
      </div>
      <div style={{ textAlign: 'center' }}>
        <input type="submit" value="Login"/>
        {loginFailed ? (
            <p style={{ color: "red" }}>Sorry, we couldn't find an account with that username or password.</p>
        ) : (
            <p style={{ color: "transparent" }}>Sorry, we couldn't find an account with that username or password.</p>
        )}
      </div>
    </div>
    
    </form>
  );
};

export default Login;