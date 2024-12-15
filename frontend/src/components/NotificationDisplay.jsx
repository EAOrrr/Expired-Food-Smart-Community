import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';

import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import Count from './Count';

const NumberInput = () => {
  const [number, setNumber] = useState(0);

  const handleChange = (event) => {
    setNumber(event.target.value);
  };

  return (
    <>
    <Count count={number} setCount={setNumber} />
    <TextField
      label="Number"
      type="number"
      value={number}
      onChange={handleChange}
      InputLabelProps={{
        shrink: true,
      }}
      variant="outlined"
    />
    </>
  );
};

export default NumberInput;