import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import './Popup.css'; // Import the CSS file

const ProjectJoinPopup = ({ onClose }) => {
  const [projectID, setProjectID] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Add your submission logic here
    onClose(); // Close the popup after submission
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