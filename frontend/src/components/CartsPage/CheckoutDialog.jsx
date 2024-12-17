import React from 'react'
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, CircularProgress } from '@mui/material'
import CheckoutTable from '../CheckoutTable'

const CheckoutDialog = ({ open, onClose, onConfirm, cart, selectedCartItems, confirmDisabled }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ fontFamily: 'Noto Serif SC', fontWeight: 'bold' }}>账单确认</DialogTitle>
      <DialogContent>
        <CheckoutTable products={cart.filter(item => selectedCartItems.includes(item.cartId)).map(item => ({ ...item.Product, quantity: item.quantity }))} />
        {confirmDisabled && (
          <CircularProgress
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: '-12px',
              marginLeft: '-12px',
            }}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ fontFamily: 'Noto Serif SC', fontWeight: 'bold' }}>取消</Button>
        <Button disabled={confirmDisabled} onClick={onConfirm} sx={{ fontFamily: 'Noto Serif SC', fontWeight: 'bold' }}>确认</Button>
      </DialogActions>
    </Dialog>
  )
}

export default CheckoutDialog
