import React, { useState } from 'react';
import { Typography, TextField, Button } from '@mui/material';

const Counter = ({ onCheckIn, onCheckOut, count, label }) => {
  const [qtyInput, setQtyInput] = useState(0);

  const handleCheckIn = () => {
    const newCount = count - parseInt(qtyInput, 10);
    if (newCount >= 0) {
      onCheckIn(newCount);
      setQtyInput(0);
    }
  };

  const handleCheckOut = () => {
    const newCount = count + parseInt(qtyInput, 10);
    if (newCount <= 100) {
      onCheckOut(newCount);
      setQtyInput(0);
    }
  };

  return (
    <div>
      <Typography variant="body1" gutterBottom>
        {label}: {count}/100
      </Typography>
      <TextField
        type="number"
        label="Enter qty"
        variant="outlined"
        value={qtyInput}
        onChange={(e) => setQtyInput(e.target.value)}
        inputProps={{ min: '0', max: '100', step: '1' }}
      />
      <Button variant="contained" onClick={handleCheckIn} style={{ margin: '5px' }}>
        Check In
      </Button>
      <Button variant="contained" onClick={handleCheckOut} style={{ margin: '5px' }}>
        Check Out
      </Button>
    </div>
  );
};

export default Counter;  