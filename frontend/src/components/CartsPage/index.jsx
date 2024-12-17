import React, { useEffect, useState } from 'react'
import { Box, Typography, Button, CircularProgress } from '@mui/material'
import cartsService from '../../services/carts'
import orderSerivce from '../../services/orders'
import { createNotification } from '../../reducers/notificationReducer'
import { useDispatch } from 'react-redux'
import { refetchUserInfo } from "../../reducers/userReducer";
import CartCard from './CartCard'
import { useNavigate } from 'react-router-dom'
import ErrorIcon from '@mui/icons-material/Error'
import CheckoutDialog from './CheckoutDialog'

const Cart = () => {
  const [cart, setCart] = useState([])
  const [selectedCartItems, setSelectedCartItems] = useState([])
  const [open, setOpen] = useState(false)
  const [confirmDisabled, setConfirmDisabled] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const fetchCart = async () => {
    try {
      setLoading(true)
      const cartItems = await cartsService.getAll()
      setCart(cartItems)
      setError(false)
    } catch (error) {
      console.error('Failed to fetch cart items:', error)
      setError(true)
    } finally {
      setLoading(false)
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
      setLoading(true)
      await orderSerivce.createByCart({ cartIds: selectedCartItems })
      setCart(cart.filter(item => !selectedCartItems.includes(item.cartId)))
      setSelectedCartItems([])
      dispatch(createNotification('结算成功', 'success'))
      dispatch(refetchUserInfo())
      setOpen(false)
      setConfirmDisabled(false)
      setLoading(false)

      navigate('/orders')
    } catch (error) {
      setConfirmDisabled(false)
      setLoading(false)
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'center' }}>
        <CircularProgress size={60} />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'center'}}>
        <ErrorIcon sx={{ fontSize: 60 , color: 'red' }} />
        <Typography variant="h6" sx={{ ml: 2, fontFamily: 'Noto Serif SC' }}>获取购物车失败</Typography>
      </Box>
    )
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
        <CheckoutDialog
          open={open}
          onClose={handleClose}
          onConfirm={handleConfirmCheckout}
          cart={cart}
          selectedCartItems={selectedCartItems}
          confirmDisabled={confirmDisabled}
        />
      </Box>
    </>
  )
}

export default Cart