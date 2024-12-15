import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import productsService from "../../services/products";
import cartsService from "../../services/carts";
import ordersService from "../../services/orders";
import { createNotification } from "../../reducers/notificationReducer";
import { refetchUserInfo, updateUser } from "../../reducers/userReducer";
import Count from "../Count";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Box, IconButton, Avatar, Typography, Container, Grid, Paper } from "@mui/material";
import { useDispatch } from "react-redux";
import { deepOrange } from "@mui/material/colors";
import CheckoutTable from "../CheckoutTable";
import CarouselSlide from "./CarouselSlide";

/*
TODO:
1. 卖家信息 + 跳转卖家个人信息页面
2. 增减商品数量，选择 加入购物车 or 直接购买
3. 拓展：排版
*/

const ProductPage = () => {
  const id = useParams().id;
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null);
  const [cart, setCart] = useState(null);
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await productsService.getOne(id);
        const cart = product.Carts.length > 0 ? product.Carts[0] : null;
        setProduct(product);
        setCart(cart);
        setCount(cart ? cart.quantity : 0);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      }
    }
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      if (!cart) {
        const newCartItem = await cartsService.create(product.productId, { quantity: count })
        setCart(newCartItem)
        dispatch(createNotification('商品已添加到购物车', 'success'))
      } else {
        const updatedCartItem = await cartsService.update(cart.cartId, { quantity: count })
        setCart(updatedCartItem)
        dispatch(createNotification('购物车商品数量已更新', 'success'))
      }
    } catch (error) {
      console.error('Failed to add product to cart:', error)
      dispatch(createNotification('添加到购物车失败', 'error'))
    }
  }

  const handlePurchase = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdateValue = (value) => {
    return value >= 1
  }

  const handleConfirmPurchase = async () => {
    // Add logic to handle purchase confirmation
    try {
      const newOrder = await ordersService.createByProduct({ productId: product.productId, quantity: count });
      console.log('Order created:', newOrder);
      setOpen(false);
      dispatch(createNotification('订单已生成', 'success'));
      dispatch(refetchUserInfo());
      // dispatch(updateUser({ balance: - newOrder.total}));
      navigate('/orders');
    } catch (error) {
      console.error('Failed to create order:', error);
      dispatch(createNotification('订单生成失败', 'error'));
      setOpen(false);
    }
  };

  const DialogCheckout = () => (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>账单确认</DialogTitle>
      <DialogContent>
        <CheckoutTable products={[{ ...product, quantity: count }]} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>取消</Button>
        <Button onClick={handleConfirmPurchase}>确认</Button>
      </DialogActions>
    </Dialog>
  );

  console.log(cart)
  console.log(product)
  if (!product) {
    return (
      <Container>
        <Typography>商品不存在</Typography>
      </Container>
    );
  }
  return (
    <Container style={{ fontFamily: 'Noto Serif SC' }}>
      <h1>商品详情</h1>
        <Paper elevation={3} style={{ padding: '20px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h4">{product.name}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>{product.description}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>价格: ¥{product.price}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>库存: {product.stock}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>有效期: {product.expiryDate ? new Date(product.expiryDate).toLocaleDateString() : '无'}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" alignItems="center">
                <Typography>卖家: {product.Seller.username}</Typography>
                <IconButton component={Link} to={`/users/${product.Seller.userId}`}>
                  <Avatar sx={{ bgcolor: deepOrange[500], marginLeft: '10px' }}>
                    {product.Seller.username[0]}
                  </Avatar>
                </IconButton>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Count count={count} setCount={setCount} handleUpdate={handleUpdateValue}/>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" onClick={handleAddToCart} style={{ marginRight: '10px' }}>加入购物车</Button>
              <Button variant="contained" color="secondary" onClick={handlePurchase}>直接购买</Button>
            </Grid>
            <Grid item xs={12}>
              <DialogCheckout />
            </Grid>
          </Grid>
          <CarouselSlide items={product.Images}/>
        </Paper>
    </Container>
  );
}

export default ProductPage;