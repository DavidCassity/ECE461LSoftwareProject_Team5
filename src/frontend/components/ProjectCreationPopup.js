import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import './Popup.css'; // Import the CSS file

const ProjectCreationPopup = ({ onClose }) => {
  const [ownerID, setOwnerID] = useState('');
  const [projectID, setProjectID] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
        console.log("Passwords do not match");
        return;
    }

    try {
      const response = await fetch('/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Set Content-Type to JSON
        },
        body: JSON.stringify({action: 'create', ownerID, projectID, password }),
      });

      const data = await response.json();
      console.log(data);

      // Assuming 'validProjectID' is returned from the server
      // Handle success (e.g., show a success message, redirect, etc.)
    } catch (error) {
        console.error('Error creating project:', error);
        // Handle error (e.g., show an error message to the user)
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>Project Creation</h2>
        <form onSubmit={handleSubmit}>
          <TextField
            label="OwnerID"
            value={ownerID}
            onChange={(e) => setOwnerID(e.target.value)}
            fullWidth
          />
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
          <TextField
            type={showPassword ? "text" : "password"}
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
          />
          <Button variant="contained" type="submit" style={{ marginTop: '10px' }}>
            Create Project
          </Button>
        </form>
        <Button onClick={onClose} className="close-button">
          X
        </Button>
      </div>
    </div>
  );
};

export default ProjectCreationPopup;