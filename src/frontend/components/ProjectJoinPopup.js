import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import './Popup.css'; // Import the CSS file

const ProjectJoinPopup = ({ onClose }) => {
  const [projectID, setProjectID] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const toggleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const response = await fetch('/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'join', projectID, password }),
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log('Join project successful');
        onClose(); // Close the popup after successful join
      } else {
        console.error('Join project failed:', data.error);
        setErrorMessage(data.error); // Set the error message received from the server
      }
    } catch (error) {
      console.error('Error joining project:', error);
      setErrorMessage('Error joining project'); // Set a generic error message
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <Button onClick={onClose} className="close-button">
          X
        </Button>
        <h2>Join Project</h2>
        <form onSubmit={handleSubmit}>
          {errorMessage && <p style={{ color: 'red', marginBottom: '10px' }}>{errorMessage}</p>}
          <TextField
            label="ProjectID"
            value={projectID}
            onChange={(e) => setProjectID(e.target.value)}
            fullWidth
          />
          <TextField
            type={showPassword ? "text" : "password"}
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
          <Button onClick={toggleShowPassword}>
            {showPassword ? "Hide Password" : "Show Password"}
          </Button>
          <Button variant="contained" type="submit" style={{ marginTop: '10px' }}>
            Join Project
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ProjectJoinPopup;