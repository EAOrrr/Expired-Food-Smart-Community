import { useEffect, useState } from 'react'
import { Box, Typography, Grid2 as Grid } from '@mui/material'
import productsService from '../../services/products'
import cartsService from '../../services/carts'
import { createNotification } from '../../reducers/notificationReducer'
import { useDispatch } from 'react-redux'
import ProductCard from './ProductCard'
import ProductList from './ProductList'
import CircularProgress from '@mui/material/CircularProgress'
import ErrorIcon from '@mui/icons-material/Error'

/*
  * 商品页面
  * TODO： 
  * 拓展：直接在这里把商品加入购物车 或者 把 addcart移动到ProductCard组件中
*/

const ShoppingPage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const products = await productsService.getAll()
        setProducts(products)
        setError(false)
      } catch (error) {
        console.error('Failed to fetch products:', error)
        dispatch(createNotification('获取商品失败', 'error'))
        setError(true)
      }
      setLoading(false)
    }
    fetchProducts()
  }, [dispatch])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <ErrorIcon sx={{ fontSize: 60, color: 'red' }} />
        <Typography variant="h6" sx={{ ml: 2, fontFamily: 'Noto Serif SC' }}>获取商品失败</Typography>
      </Box>
    )
  }

  return (
    <>
      <Box sx={{ fontFamily: 'Noto Serif SC' }}>
        <h1> 
          商品列表
        </h1>
        <ProductList products={products} />
      </Box>
    </>
  )
}

export default ShoppingPage