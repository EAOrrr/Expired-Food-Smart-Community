import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const Count = ({ count, setCount, handleUpdate }) => {
  const handleIncrement = () => {
    setCount(parseInt(count) + 1);
  }

  const handleDecrement = () => {
    const value = parseInt(count) - 1;
    if (handleUpdate) {
      const shouldSet = handleUpdate(value);
      if (!shouldSet) {
        return;
      }
    }
    setCount(value);
  }

  const handleChange = (event) => {
    const value = event.target.value;
    setCount(parseInt(value))
  }

  return (
    <Box display="flex" alignItems="center">
      <IconButton onClick={handleDecrement} disabled={count <= 0}>
        <RemoveIcon fontSize='small' color={count <= 0 ? 'disabled': 'primary'}/>
      </IconButton>
      <Typography
        component="span"
        sx={{
          cursor: 'pointer',
          '&:hover': {
            borderBottom: '1px solid',
          },
        }}
      >
        <input
          type="number"
          value={count}
          onChange={handleChange}
          style={{
            border: 'none',
            background: 'none',
            textAlign: 'center',
            width: '3ch',
            MozAppearance: 'textfield',
            appearance: 'textfield',
          }}
        />
        <style>{`
          input::-webkit-outer-spin-button,
          input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
        `}</style>
      </Typography>
      <IconButton onClick={handleIncrement}>
        <AddIcon fontSize='small' color='primary'/>
      </IconButton>
    </Box>
  );
};

export default Count;