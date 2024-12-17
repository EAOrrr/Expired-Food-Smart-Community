import React, { useEffect, useState } from 'react'
import { Box, Typography, Grid, Card, CardContent, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import cartsService from '../../services/carts'
import orderSerivce from '../../services/orders'
import { createNotification } from '../../reducers/notificationReducer'
import { useDispatch } from 'react-redux'
import Count from '../Count'
import { refetchUserInfo } from "../../reducers/userReducer";
import CheckoutTable from '../CheckoutTable'
import CartCard from './CartCard'
import { useNavigate } from 'react-router-dom'


// 1. Count 组件: [value, setValue] = useState(number), handleUpdate = (value) => boolean
// 2. 建议分开CartCard组件


const Cart = () => {
  const [cart, setCart] = useState([])
  const [selectedCartItems, setSelectedCartItems] = useState([])
  const [open, setOpen] = useState(false)
  const [confirmDisabled, setConfirmDisabled] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

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
      setConfirmDisabled(true)
      await orderSerivce.createByCart({ cartIds: selectedCartItems })
      setCart(cart.filter(item => !selectedCartItems.includes(item.cartId)))
      setSelectedCartItems([])
      dispatch(createNotification('结算成功', 'success'))
      dispatch(refetchUserInfo())
      setOpen(false)
      setConfirmDisabled(false)

      navigate('/orders')
    } catch (error) {
      setConfirmDisabled(false)
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

  const handleUpdateQuantity = (cartItemId, quantity) => {
    try {
      console.log(`Updating cart item ${cartItemId} with quantity ${quantity}`)
      setCart(prevCart =>
        prevCart.map(item =>
          item.cartId === cartItemId ? { ...item, quantity } : item
        ).filter(item => item.quantity > 0)
      )
      dispatch(createNotification(quantity === 0 ? '商品已从购物车移除' : '购物车商品数量已更新', 'success'))
      if (quantity === 0) {
        cartsService.remove(cartItemId)
      } else {
        cartsService.update(cartItemId, { quantity })
      }
      dispatch(refetchUserInfo())
    } catch (error) {
      console.error('Failed to update cart item quantity:', error)
      dispatch(createNotification('更新购物车商品数量失败', 'error'))
    }
  }

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Typography variant='h4' gutterBottom sx={{ fontFamily: 'Noto Serif SC', fontWeight: 'bold' }}>
          我的购物车
        </Typography>
          {cart.length > 0 ? (
            cart.map(cartItem => (
              <CartCard
                key={cartItem.cartId}
                cartItem={cartItem}
                selectedCartItems={selectedCartItems}
                handleSelectCartItem={handleSelectCartItem}
                handleUpdateQuantity={(value) => handleUpdateQuantity(cartItem.cartId, value)}
              />
            ))
          ) : (
            <Typography variant='body2' color='text.secondary' sx={{ fontFamily: 'Noto Serif SC', fontWeight: 'bold' }}>
              购物车为空
            </Typography>
          )}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button variant="contained" onClick={handleCheckout} disabled={selectedCartItems.length === 0} sx={{ fontFamily: 'Noto Serif SC', fontWeight: 'bold' }}>
            结算
          </Button>
        </Box>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle sx={{ fontFamily: 'Noto Serif SC', fontWeight: 'bold' }}>账单确认</DialogTitle>
          <DialogContent>
            <CheckoutTable products={cart.filter(item => selectedCartItems.includes(item.cartId)).map(item => ({ ...item.Product, quantity: item.quantity }))} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} sx={{ fontFamily: 'Noto Serif SC', fontWeight: 'bold' }}>取消</Button>
            <Button disabled={confirmDisabled} onClick={handleConfirmCheckout} sx={{ fontFamily: 'Noto Serif SC', fontWeight: 'bold' }}>确认</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  )
}

export default Cart