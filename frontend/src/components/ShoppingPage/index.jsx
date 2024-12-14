import { useEffect, useState } from 'react'
import { Box, Typography, Grid2 as Grid } from '@mui/material'
import productsService from '../../services/products'
import cartsService from '../../services/carts'
import { createNotification } from '../../reducers/notificationReducer'
import { useDispatch } from 'react-redux'
import ProductCard from './ProductCard'

const ShoppingPage = () => {
  const [products, setProducts] = useState([])
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
      <Box sx={{ p: 3 }}>
        <Typography variant='h4' gutterBottom>
          商品列表
        </Typography>
        <Grid container spacing={3}>
          {products.length > 0 ? (
            products.map(product => (
              <ProductCard key={product.productId} product={product} addToCart={addToCart} />
              
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