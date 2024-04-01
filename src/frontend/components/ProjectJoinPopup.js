import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import './Popup.css'; // Import the CSS file

const ProjectJoinPopup = ({ onClose }) => {
  const [projectID, setProjectID] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
        body: JSON.stringify({action: 'join', projectID, password }),
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log('Join project successful');
        onClose(); // Close the popup after successful join
      } else {
        console.error('Join project failed:', data.error); // Log the specific error message
      }
    } catch (error) {
      console.error('Error joining project:', error);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>Join Project</h2>
        <form onSubmit={handleSubmit}>
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
        <Button onClick={onClose} className="close-button">
          X
        </Button>
      </div>
    </div>
  );
};

export default ProjectJoinPopup;