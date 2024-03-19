import React, { useState } from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';
import UserList from './UserList';
import Counter from './Counter';

const ProjectCard = ({ projectName }) => {
  const [hwSet1Count, setHWSet1Count] = useState(0);
  const [hwSet2Count, setHWSet2Count] = useState(0);
  const [isJoined, setIsJoined] = useState(false);

  const handleToggleJoin = () => {
    setIsJoined(!isJoined);
  };

  return (
    <Card style={{ marginBottom: '20px', position: 'relative' }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {projectName}
        </Typography>
        
        <UserList />

        <Counter
          onCheckIn={(newCount) => setHWSet1Count(newCount)}
          onCheckOut={(newCount) => setHWSet1Count(newCount)}
          count={hwSet1Count}
          label="HWSet1"
        />

        <Counter
          onCheckIn={(newCount) => setHWSet2Count(newCount)}
          onCheckOut={(newCount) => setHWSet2Count(newCount)}
          count={hwSet2Count}
          label="HWSet2"
        />

        <Button
          variant="contained"
          onClick={handleToggleJoin}
          style={{ position: 'absolute', bottom: '10px', right: '10px', padding: '10px', fontSize: '1rem' }}
        >
          {isJoined ? 'Leave' : 'Join'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;