import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import './Popup.css'; // Import the CSS file

const ProjectCreationPopup = ({ onClose }) => {
  const [projectID, setProjectID] = useState('');
  const [description, setDescription] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Initialize showPassword state to false
  const [errorMessage, setErrorMessage] = useState('');

  const toggleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword); // Toggle the value of showPassword
  };

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
        body: JSON.stringify({ action: 'create', projectID, description, password }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Add project successful');
        onClose(); // Close the popup after successful add
      } else {
        console.error('Add project failed:', data.error);
        setErrorMessage(data.error); // Set the error message received from the server
      }
    } catch (error) {
      console.error('Error creating project:', error);
      setErrorMessage('Error creating project'); // Set a generic error message
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>Project Creation</h2>
        <form onSubmit={handleSubmit}>
          {errorMessage && <p style={{ color: 'red', marginBottom: '10px' }}>{errorMessage}</p>}
          <TextField
            label="ProjectID"
            value={projectID}
            onChange={(e) => setProjectID(e.target.value)}
            fullWidth
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={4} // Adjust the number of rows as needed
            inputProps={{ maxLength: 150 }} // Set the character limit
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
          <Button onClick={toggleShowPassword}>
            {showPassword ? "Hide Password" : "Show Password"}
          </Button>
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