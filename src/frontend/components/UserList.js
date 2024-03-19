import React from 'react';
import { Typography } from '@mui/material';

const UserList = () => {
  const users = ['User1', 'User2', 'User3'];

  return (
    <div>
      <Typography color="text.secondary">
        List of authorized users: {users.join(', ')}
      </Typography>
    </div>
  );
};

export default UserList;