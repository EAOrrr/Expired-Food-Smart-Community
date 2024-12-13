import React, { useEffect, useState } from 'react'
import { Box, Typography, Grid, Card, CardContent, Button, TextField, Select, MenuItem, Container } from '@mui/material'
import productsService from '../services/products'
import cartsService from '../services/carts'
import { useField } from '../hooks'
import { createNotification } from '../reducers/notificationReducer'
import { useDispatch } from 'react-redux'
import NavigationBarLargeScreen from './NavigationBar'

const ShoppingPage = () => {
  const [products, setProducts] = useState([])
  const notification = useField('notification')
  const [severity, setSeverity] = useState('success')
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await productsService.getAll()
        console.log('Fetched products:', products) // 添加日志
        setProducts(products)
      } catch (error) {
        console.error('Failed to fetch products:', error) // 添加错误日志
      }
    }
    fetchProducts()
  }, [])

  const handleClick = () => {
    console.log(notification)
    // 发布通知
    dispatch(createNotification(notification.value, severity))
  }

  const addToCart = async (productId) => {
    try {
      const newCartItem = await cartsService.create(productId, { quantity: 1 })
      dispatch(createNotification('商品已添加到购物车', 'success'))
    } catch (error) {
      console.error('Failed to add product to cart:', error)
      dispatch(createNotification('添加到购物车失败', 'error'))
    }
  }

  return (
    <>
      <NavigationBarLargeScreen />
      <Box sx={{ p: 3 }}>
        <Typography variant='h4' gutterBottom>
          商品列表
        </Typography>
        <Container>
          <TextField {...notification} />
          <Select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
          >
            <MenuItem value="success">Success</MenuItem>
            <MenuItem value="error">Error</MenuItem>
            <MenuItem value="warning">Warning</MenuItem>
          </Select>
          <Button onClick={handleClick}>设置通知</Button>
        </Container>
        <Grid container spacing={3}>
          {products.length > 0 ? (
            products.map(product => (
              <Grid item key={product.productId} xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Typography gutterBottom variant='h5' component='div'>
                      {product.name}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      {product.description}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      价格: ¥{product.price}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      库存: {product.stock}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      有效期: {product.expiryDate ? new Date(product.expiryDate).toLocaleDateString() : '无'}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      卖家ID: {product.sellerId}
                    </Typography>
                  </CardContent>
                  <Button size='small' onClick={() => addToCart(product.productId)}>添加到购物车</Button>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography variant='body2' color='text.secondary'>
              暂无商品
            </Typography>
          )}
        </Grid>
      </Box>
    </>
  )
}

export default ShoppingPage