import React, { useState } from 'react'
import { Grid, Card, CardContent, Checkbox, Box, Typography } from '@mui/material'
import Count from '../Count'

const CartCard = ({ cartItem, selectedCartItems, handleSelectCartItem, handleUpdateQuantity }) => {
  if (!cartItem) return null
  const [value, setValue] = useState((cartItem && cartItem.quantity) || 0)
  console.log(value)

  const handleUpdate = (newValue) => {
    // setValue(newValue)
    handleUpdateQuantity(newValue)
    return true
  }

  return (
    <Grid item xs={12}>
      <Card variant="outlined" sx={{ marginBottom: 1, borderRadius: 2, boxShadow: 3, fontFamily: 'Noto Serif SC' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Checkbox
              checked={selectedCartItems.includes(cartItem.cartId)}
              onChange={() => handleSelectCartItem(cartItem.cartId)}
            />
            <Box sx={{ flexGrow: 1, ml: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Noto Serif SC' }}>{cartItem.Product.name}</Typography>
              <Typography variant="body1" gutterBottom sx={{ fontFamily: 'Noto Serif SC' }}>价格: ¥{cartItem.Product.price}</Typography>
            </Box>
            <Count
              count={value}
              setCount={setValue}
              handleUpdate={handleUpdate}
            />
          </Box>
        </CardContent>
      </Card>
    </Grid>
  )
}

export default CartCard