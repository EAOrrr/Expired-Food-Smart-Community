import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import productsService from "../../services/products";
import cartsService from "../../services/carts";
import ordersService from "../../services/orders";
import { createNotification } from "../../reducers/notificationReducer";
import Count from "../Count";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Table, TableBody, TableCell, TableContainer, TableRow, Paper } from "@mui/material";
import { useDispatch } from "react-redux";

/*
TODO:
1. 卖家信息 + 跳转卖家个人信息页面
2. 增减商品数量，选择 加入购物车 or 直接购买
3. 拓展：排版
*/

const ProductPage = () => {
  const id = useParams().id;
  const dispatch = useDispatch()
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

  const handleConfirmPurchase = async () => {
    // Add logic to handle purchase confirmation
    try {
      const newOrder = await ordersService.createByProduct({ productId: product.productId, quantity: count });
      console.log('Order created:', newOrder);
      dispatch(createNotification('订单已生成', 'success'));
      setOpen(false);
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
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>商品名称</TableCell>
                <TableCell>{product.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>单价</TableCell>
                <TableCell>¥{product.price}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>数量</TableCell>
                <TableCell>{count}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>总价</TableCell>
                <TableCell>¥{product.price * count}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>取消</Button>
        <Button onClick={handleConfirmPurchase}>确认</Button>
      </DialogActions>
    </Dialog>
  );

  console.log(cart)
  console.log(product)
  return (
    <div>
      <h1>Product Page</h1>
      {product ? (
        <div key={product.productId}>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p>价格: ¥{product.price}</p>
          <p>库存: {product.stock}</p>
          <p>有效期: {product.expiryDate ? new Date(product.expiryDate).toLocaleDateString() : '无'}</p>
          <p>卖家ID: {product.sellerId}</p>
          <Count count={count} setCount={setCount} />
          <Button onClick={handleAddToCart}>加入购物车</Button>
          <Button onClick={handlePurchase}>直接购买</Button>
          <DialogCheckout />
          {product.Images.map((image) => {
            return (
            <img key={image.ImageId} src={`/api/images/${image.imageId}`} />
            )
          })}
        </div>
      ) : (
        <p>商品不存在</p>
      )}
    </div>
  );
}

export default ProductPage;