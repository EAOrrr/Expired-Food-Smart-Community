import { useEffect, useState } from 'react'
import { Box, Typography, Grid2 as Grid } from '@mui/material'
import productsService from '../../services/products'
import cartsService from '../../services/carts'
import { createNotification } from '../../reducers/notificationReducer'
import { useDispatch } from 'react-redux'
import ProductCard from './ProductCard'
import ProductList from './ProductList'

/*
  * 商品页面
  * TODO： 
  * 拓展：直接在这里把商品加入购物车 或者 把 addcart移动到ProductCard组件中
*/

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
        dispatch(createNotification('获取商品失败', 'error'))
      }
    }
    fetchProducts()
  }, [dispatch])



  return (
    <>
      <Box sx={{ p: 3 }}>
        <Typography variant='h4' gutterBottom>
          商品列表
        </Typography>
        <ProductList products={products} />
      </Box>
    </>
  )
}

export default ShoppingPage