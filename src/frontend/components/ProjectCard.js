import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const ProjectCard = ({ projectID, ownerID, members, description, checkOut, availability, capacity, userID, updateAvailability, updateProjects }) => {
  const [showConfirmation, setShowConfirmation] = useState(false); // State variable for controlling dialog visibility
  const [actionConfirmed, setActionConfirmed] = useState(false);const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    console.log("Project ID:", projectID);
    console.log("Project Description:", description);
    console.log("Owner ID:", ownerID);
    console.log("Members:", members);
    console.log("Check Out:", checkOut);
    console.log("Availability:", availability);
    console.log("Capacity:", capacity);
    console.log("User ID:", userID);
    setIsOwner(userID === ownerID);
  }, [projectID, description, ownerID, members, checkOut, availability, capacity, userID, ownerID]);


  const handleUpdateAvailability = (index, newAvailability, projectID, userID, newCheckOut) => {
    updateAvailability(index, newAvailability, projectID, userID, newCheckOut);
  }

  const checkinHardware = async (index, value) => {
    const intValue = parseInt(value, 10);
    if (isNaN(intValue) || intValue > capacity[index] || intValue < 0) {
      return;
    }

    const response = await fetch(`/projects/${index}/${value}/false`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({projectID}),
    });

    const data = await response.json();
    if (data.authenticated) {
      console.log("Authenticated");
      if(!data.error) {
        console.log("No error");
        setMessage(data.message);
        setShowMessage(true);
        console.log("Before sending to update availability", index, availability[index] + intValue, projectID, userID, checkOut[userID][index] - intValue);
        handleUpdateAvailability(index, availability[index] + intValue, projectID, userID, checkOut[userID][index] - intValue);
      }
    }

  }

  const checkoutHardware = async (index, value) => {
    const intValue = parseInt(value, 10);
    if (isNaN(intValue) || intValue > capacity[index] || intValue < 0) {
      return;
    }

    const response = await fetch(`/projects/${index}/${value}/true`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({projectID}),
      });

      const data = await response.json();
      if (data.authenticated) {
        console.log("Authenticated");
        if(!data.error) {
          console.log("No error");
          setMessage(data.message);
          setShowMessage(true);
          handleUpdateAvailability(index, availability[index] - intValue, projectID, userID, checkOut[userID][index] + intValue);
        }
      }

  }

  const leaveProject = async () => {
    try {
      const response = await fetch(`/leave/${projectID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userID }),
      });
      if (response.ok) {
        updateProjects();
      } else {
        console.error('Failed to leave the project');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const deleteProject = async () => {
    try {
      const response = await fetch(`/projects/${projectID}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        updateProjects();
      } else {
        console.error('Failed to delete the project');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleLeaveProject = () => {
    setActionConfirmed(true); // Confirm the action
    setShowConfirmation(true); // Open the confirmation dialog
  };
  
  const handleDeleteProject = () => {
    setActionConfirmed(true); // Confirm the action
    setShowConfirmation(true); // Open the confirmation dialog
  };
  

  const handleCloseConfirmation = () => {
    setShowConfirmation(false); // Close the confirmation dialog
    setActionConfirmed(false); // Reset confirmation status
  };

  const handleConfirmAction = async () => {
    console.log("Confirm action triggered");
    // Perform action (leave/delete project) if confirmed
    if (actionConfirmed) {
      console.log("Action confirmed");
      if (isOwner) {
        await deleteProject();
      } else {
        await leaveProject();
      }
    }
    // Reset confirmation status and close the confirmation dialog
    setActionConfirmed(false);
    setShowConfirmation(false);
  };  

  return (
    <Card style={{ marginBottom: '20px', position: 'relative', border: '1.5px solid #eee' }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {projectID}
        </Typography>
        <p>Members: {members.join(', ')}</p>
        <p>Description: {description}</p>

        <div>
          <Typography variant="subtitle1" component="div">
            HWSet1: {availability[0]}/{capacity[0]}
          </Typography>
          <Typography variant="body1">
            You've checked out {checkOut[userID][0]}.
          </Typography>
          <TextField
            label="Enter value"
            value={value1}
            onChange={(e) => setValue1(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={() => checkinHardware(0, value1)}>
            Check In
          </Button>
          <Button variant="contained" color="secondary" onClick={() => checkoutHardware(0, value1)}>
            Check Out
          </Button>
        </div>

        <div>
          <Typography variant="subtitle1" component="div">
            HWSet2: {availability[1]}/{capacity[1]}
          </Typography>
          <Typography variant="body1">
            You've checked out {checkOut[userID][1]}.
          </Typography>
          <TextField
            label="Enter value"
            value={value2}
            onChange={(e) => setValue2(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={() => checkinHardware(1, value2)}>
            Check In
          </Button>
          <Button variant="contained" color="secondary" onClick={() => checkoutHardware(1, value2)}>
            Check Out
          </Button>
        </div>
        {isOwner ? (
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteProject}
            style={{ position: 'absolute', top: 0, right: 0, marginTop: '10px', marginRight: '10px' }}
          >
            Delete
          </Button>
        ) : (
          <Button
            variant="contained"
            color="error"
            onClick={handleLeaveProject}
            style={{ position: 'absolute', top: 0, right: 0, marginTop: '10px', marginRight: '10px' }}
          >
            Leave
          </Button>
        )}
      </CardContent>

      <Dialog open={showConfirmation} onClose={handleCloseConfirmation}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to {isOwner ? 'delete' : 'leave'} this project?</Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleCloseConfirmation}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleConfirmAction}>Yes, I'm sure</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default ProjectCard;