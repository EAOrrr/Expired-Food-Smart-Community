import React, { useEffect, useState } from 'react'
import { Box, Typography, Grid, Card, CardContent, Button, Checkbox } from '@mui/material'
import
 cartsService from '../../services/carts'
import { createNotification } from '../../reducers/notificationReducer'
import { useDispatch } from 'react-redux'

/*
  * 购物车页面
  * TODO： 
  * 增减购物车商品数量
  * 删除购物车商品
*/

const Cart = () => {
  const [cart, setCart] = useState([])
  const [selectedCartItems, setSelectedCartItems] = useState([])
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cartItems = await cartsService.getAll()
        setCart(cartItems)
      } catch (error) {
        console.error('Failed to fetch cart items:', error)
      }
    }
    fetchCart()
  }, [])

  const handleCheckout = async () => {
    try {
      await cartsService.checkout(selectedCartItems)
      setCart(cart.filter(item => !selectedCartItems.includes(item.id)))
      setSelectedCartItems([])
      dispatch(createNotification('结算成功', 'success'))
    } catch (error) {
      console.error('Failed to checkout:', error)
      dispatch(createNotification('结算失败', 'error'))
    }
  }

  const handleSelectCartItem = (cartItemId) => {
    setSelectedCartItems(prevSelected =>
      prevSelected.includes(cartItemId)
        ? prevSelected.filter(id => id !== cartItemId)
        : [...prevSelected, cartItemId]
    )
  }

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Typography variant='h4' gutterBottom>
          购物车
        </Typography>
        <Grid container spacing={3}>
          {cart.length > 0 ? (
            cart.map(cartItem => (
              <Grid item key={cartItem.id} xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Checkbox
                      checked={selectedCartItems.includes(cartItem.id)}
                      onChange={() => handleSelectCartItem(cartItem.id)}
                    />
                    <Typography gutterBottom variant='h5' component='div'>
                      {cartItem.Product.name}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      数量: {cartItem.quantity}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography variant='body2' color='text.secondary'>
              购物车为空
            </Typography>
          )}
        </Grid>
        <Button onClick={handleCheckout} disabled={selectedCartItems.length === 0}>结算</Button>
      </Box>
    </>
  )
}

export default Cart