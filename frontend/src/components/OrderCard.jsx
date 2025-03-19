import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Divider
} from '@mui/material';
import ordersService from '../services/orders';
import reviewService from '../services/review';
import { refetchUserInfo, updateUser } from '../reducers/userReducer';
import { createNotification } from '../reducers/notificationReducer';
import { useDispatch } from 'react-redux';
import { AxiosError } from 'axios';
import OrderButtons from './OrderButtons'; // Import Buttons component
import RatingDialog from './RatingDialog'; // Import RatingDialog component

const SellOrderCard = ({ order, userRole, updateOrderStatus, orderType }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  console.log(order)
  const imageSrc = order.Product.Images && order.Product.Images.length > 0
    ? `/api/images/${order.Product.Images[0].imageId}`
    : '/src/assets/default.jpg';
  console.log(imageSrc)
  const handleClickOpen = (order) => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmitReview = async (review, rating) => {
    try {
      console.log(`Review for order ${order.orderId}: ${review}, Rating: ${rating}`);
      await reviewService.create({ orderId: order.orderId, content: review, rating });
      setOpen(false);
      dispatch(createNotification('评价成功', 'success'));
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(`Failed to submit review for order ${order.orderId}`);
        if (error.response?.status === 429) {
          dispatch(createNotification('您已经评价过了', 'error'));
          return;
        }
      }
      console.log(error);
      dispatch(createNotification('操作失败', 'error'));
    }
  };

  const handleUpdateOrderStatus = async (status) => {
    try {
      console.log(`Changing order ${order.orderId} status to ${status}`);
      setLoading(true);
      await ordersService.update(order.orderId, { status });
      dispatch(refetchUserInfo());
      setLoading(false);
      dispatch(createNotification(getNotificationMessage(status), 'success'));
      updateOrderStatus(order.orderId, status, orderType); // Update local state
      console.log(`Order ${order.orderId} status changed to ${status}`);
    } catch (error) {
      console.error(`Failed to change order ${order.orderId} status to ${status}`);
      console.log(error);
      dispatch(createNotification('操作失败', 'error'));
    }
  };

  const getNotificationMessage = (status) => {
    switch (status) {
      case 'Delivering':
        return '发货成功';
      case 'Delivered':
        return '确认收货成功';
      case 'Cancelled':
        return '订单取消成功';
      default:
        return '操作成功';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'Pending':
        return '待发货';
      case 'Delivering':
        return '待收货';
      case 'delivered':
        return '已完成';
      case 'Cancelled':
        return '已取消';
      default:
        return status;
    }
  };

  return (
    <>
      <Card variant="outlined" sx={{ marginBottom: 1, borderRadius: 2, boxShadow: 3, fontFamily: 'Noto Serif SC' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box component='img' src={imageSrc} alt={order.Product.name} style={{ width: 100, height: 100, objectFit: 'contain', borderRadius: 2 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, ml: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Noto Serif SC' }}>
                商品: {order.Product.name}
              </Typography>
              <Typography variant="body2" gutterBottom sx={{ fontFamily: 'Noto Serif SC' }}>数量: {order.quantity}</Typography>
              <Typography variant="body2" gutterBottom sx={{ fontFamily: 'Noto Serif SC' }}>总价: {order.total}</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginRight: 2 }}>
              <Typography variant="body2" sx={{ color: 'gray' }}>
                状态: {getStatusText(order.status)}
              </Typography>
              <Typography variant="body2" sx={{ color: 'gray' }}>
                创建时间: {new Date(order.createdAt).toLocaleString()}
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem sx={{ alignSelf: 'stretch', marginLeft: 2 }}/>
            <Box sx={{ml : 4}}>
              <OrderButtons 
                status={order.status} 
                userRole={userRole} 
                handleUpdateOrderStatus={handleUpdateOrderStatus} 
                handleClickOpen={handleClickOpen} 
              />
            </Box>
          </Box>
        </CardContent>
      </Card>
      <RatingDialog
        open={open}
        handleClose={handleClose}
        handleSubmitReview={handleSubmitReview}
        userRole={userRole}
        loading={loading}
      />
    </>
  );
};

export default SellOrderCard;