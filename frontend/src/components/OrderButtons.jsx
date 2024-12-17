import React from 'react';
import { Box, Button } from '@mui/material';

const Buttons = ({ status, userRole, handleUpdateOrderStatus, handleClickOpen }) => {
  const minWidth = { minWidth: '120px' }; // Ensure minimum width for alignment

  if (userRole === 'buyer') {
    switch (status) {
      case 'Pending':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', ...minWidth }}>
            <Button variant="outlined" onClick={() => handleUpdateOrderStatus('Cancelled')} sx={{ fontFamily: 'Noto Serif SC', mb: 1 }}>取消订单</Button>
          </Box>
        );
      case 'Delivering':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', ...minWidth }}>
            <Button variant="outlined" onClick={() => handleUpdateOrderStatus('Cancelled')} sx={{ fontFamily: 'Noto Serif SC', mb: 1 }}>取消订单</Button>
            <Button variant="outlined" onClick={() => handleUpdateOrderStatus('Delivered')} sx={{ fontFamily: 'Noto Serif SC' }}>确认收货</Button>
          </Box>
        );
      case 'Delivered':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', ...minWidth }}>
            <Button variant="outlined" onClick={() => handleClickOpen()} sx={{ fontFamily: 'Noto Serif SC' }}>评价卖家</Button>
          </Box>
        );
      default:
        return <Box sx={{ display: 'flex', flexDirection: 'column', ...minWidth }}></Box>;
    }
  } else if (userRole === 'seller') {
    switch (status) {
      case 'Pending':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', ...minWidth }}>
            <Button variant="outlined" onClick={() => handleUpdateOrderStatus('Delivering')} sx={{ fontFamily: 'Noto Serif SC', mb: 1 }}>发货</Button>
            <Button variant="outlined" onClick={() => handleUpdateOrderStatus('Cancelled')} sx={{ fontFamily: 'Noto Serif SC' }}>取消订单</Button>
          </Box>
        );
      case 'Delivering':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', ...minWidth }}>
            <Button variant="outlined" onClick={() => handleUpdateOrderStatus('Cancelled')} sx={{ fontFamily: 'Noto Serif SC' }}>取消订单</Button>
          </Box>
        );
      case 'Delivered':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', ...minWidth }}>
            <Button variant="outlined" onClick={() => handleClickOpen()} sx={{ fontFamily: 'Noto Serif SC' }}>评价买家</Button>
          </Box>
        );
      default:
        return <Box sx={{ display: 'flex', flexDirection: 'column', ...minWidth }}></Box>;
    }
  } else {
    return <Box sx={{ display: 'flex', flexDirection: 'column', ...minWidth }}></Box>;
  }
};

export default Buttons;