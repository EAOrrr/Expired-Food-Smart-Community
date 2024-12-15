import React, { useEffect, useState } from 'react'
import { Box, Typography, Grid, Card, CardContent, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import cartsService from '../../services/carts'
import orderSerivce from '../../services/orders'
import { createNotification } from '../../reducers/notificationReducer'
import { useDispatch } from 'react-redux'
import Count from '../Count'
import { refetchUserInfo } from "../../reducers/userReducer";
import CheckoutTable from '../CheckoutTable'


// 1. Count 组件: [value, setValue] = useState(number), handleUpdate = (value) => boolean
// 2. 建议分开CartCard组件


const Cart = () => {
  const [cart, setCart] = useState([])
  const [selectedCartItems, setSelectedCartItems] = useState([])
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch()

  const fetchCart = async () => {
    try {
      const cartItems = await cartsService.getAll()
      setCart(cartItems)
    } catch (error) {
      console.error('Failed to fetch cart items:', error)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [])

  const handleCheckout = async () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleConfirmCheckout = async () => {
    if (selectedCartItems.length === 0) {
      dispatch(createNotification('请选择至少一个商品进行结算', 'error'))
      return
    }

    console.log('Selected cart items:', selectedCartItems)

    try {
      await orderSerivce.createByCart({ cartIds: selectedCartItems })
      setCart(cart.filter(item => !selectedCartItems.includes(item.cartId)))
      setSelectedCartItems([])
      dispatch(createNotification('结算成功', 'success'))
      dispatch(refetchUserInfo())
      setOpen(false)
    } catch (error) {
      console.error('Failed to checkout:', error)
      console.error('Error details:', error.response ? error.response.data : error.message)
      dispatch(createNotification('结算失败', 'error'))
      setOpen(false)
    }
  }

  const handleSelectCartItem = (cartItemId) => {
    setSelectedCartItems(prevSelected =>
      prevSelected.includes(cartItemId)
        ? prevSelected.filter(id => id !== cartItemId)
        : [...prevSelected, cartItemId]
    )
  }

  const handleUpdateQuantity = async (cartItemId, quantity) => {
    try {
      console.log(`Updating cart item ${cartItemId} with quantity ${quantity}`)
      if (quantity === 0) {
        await cartsService.remove(cartItemId)
        dispatch(createNotification('商品已从购物车移除', 'success'))
      } else {
        await cartsService.update(cartItemId, { quantity })
        dispatch(createNotification('购物车商品数量已更新', 'success'))
      }
      await fetchCart() // 更新购物车后重新获取数据
    } catch (error) {
      console.error('Failed to update cart item quantity:', error)
      dispatch(createNotification('更新购物车商品数量失败', 'error'))
    }
  }

  const CartCard = ({ cartItem, selectedCartItems, handleSelectCartItem, handleUpdateQuantity }) => (
    <Grid item key={cartItem.cartId} xs={12}>
      <Card>
        <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Checkbox
            checked={selectedCartItems.includes(cartItem.cartId)}
            onChange={() => handleSelectCartItem(cartItem.cartId)}
          />
          <Box sx={{ flexGrow: 1, ml: 2 }}>
            <Typography gutterBottom variant='h5' component='div'>
              {cartItem.Product.name}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              价格: ¥{cartItem.Product.price}
            </Typography>
          </Box>
          <Count count={cartItem.quantity} setCount={(count) => handleUpdateQuantity(cartItem.cartId, count)} handleNegative={() => handleUpdateQuantity(cartItem.cartId, 0)} />
        </CardContent>
      </Card>
    </Grid>
  )

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Typography variant='h4' gutterBottom>
          购物车
        </Typography>
        <Grid container spacing={3}>
          {cart.length > 0 ? (
            cart.map(cartItem => (
              <CartCard
                key={cartItem.cartId}
                cartItem={cartItem}
                selectedCartItems={selectedCartItems}
                handleSelectCartItem={handleSelectCartItem}
                handleUpdateQuantity={handleUpdateQuantity}
              />
            ))
          ) : (
            <Typography variant='body2' color='text.secondary'>
              购物车为空
            </Typography>
          )}
        </Grid>
        <Button onClick={handleCheckout} disabled={selectedCartItems.length === 0}>结算</Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>账单确认</DialogTitle>
          <DialogContent>
            <CheckoutTable products={cart.filter(item => selectedCartItems.includes(item.cartId)).map(item => ({ ...item.Product, quantity: item.quantity }))} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>取消</Button>
            <Button onClick={handleConfirmCheckout}>确认</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  )
}

export default Cart