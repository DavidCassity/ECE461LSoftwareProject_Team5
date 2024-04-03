import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, TextField } from '@mui/material';
//import UserList from './UserList';
import Counter from './Counter';

const ProjectCard = ({ projectID: propProjectID, ownerID: propOwnerID, members: propMembers, checkOut: propCheckOut, availability: propAvailability, capacity: propCapacity, userID: propUserID }) => {
  const [projectID, setProjectID] = useState(propProjectID);
  const [ownerID, setOwnerID] = useState(propOwnerID);
  const [members, setMembers] = useState(propMembers);
  const [checkOut, setCheckOut] = useState(propCheckOut);
  const [availability, setAvailability] = useState(propAvailability);
  const [capacity, setCapacity] = useState(propCapacity);
  const [userID, setUserID] = useState(propUserID);

  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');

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
        setAvailability(prevAvailability => {
          const newAvailability = [...prevAvailability]; // Create a copy of the array
          newAvailability[index] += intValue; // Update the value at the specified index
          return newAvailability; // Return the updated array
        });
        setCheckOut(prevCheckOut => {
          const newCheckOut = { ...prevCheckOut }; // Create a shallow copy of the checkout object
          const newArray = [...newCheckOut[userID]]; // Create a copy of the array associated with the user ID
          newArray[index] -= intValue; // Update the value at the specified index in the array
          newCheckOut[userID] = newArray; // Update the array associated with the user ID
          return newCheckOut; // Return the updated checkout object
        });
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
          setAvailability(prevAvailability => {
            const newAvailability = [...prevAvailability]; // Create a copy of the array
            newAvailability[index] -= intValue; // Update the value at the specified index
            return newAvailability; // Return the updated array
          });
          setCheckOut(prevCheckOut => {
            const newCheckOut = { ...prevCheckOut }; // Create a shallow copy of the checkout object
            const newArray = [...newCheckOut[userID]]; // Create a copy of the array associated with the user ID
            newArray[index] += intValue; // Update the value at the specified index in the array
            newCheckOut[userID] = newArray; // Update the array associated with the user ID
            return newCheckOut; // Return the updated checkout object
          });
        }
      }

  }

  return (
    <Card style={{ marginBottom: '20px', position: 'relative' }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {projectID}
        </Typography>
 
        <p>Members: {members.join(', ')}</p>

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

      </CardContent>
    </Card>
  );
};

export default ProjectCard;