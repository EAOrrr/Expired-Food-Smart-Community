import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle, 
  TextField, 
  Box, 
  Divider,
  Rating // Import Rating
} from '@mui/material';
import ordersService from '../../services/orders';
import reviewService from '../../services/review';
import { refetchUserInfo, updateUser } from '../../reducers/userReducer';
import { createNotification } from '../../reducers/notificationReducer';
import { useDispatch } from 'react-redux';
import { AxiosError } from 'axios';

const OrderCard = ({ order, userRole, updateOrderStatus, orderType }) => {
  console.log(userRole)
    const [open, setOpen] = useState(false);
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(0); // Add rating state
    const dispatch = useDispatch();

    const handleClickOpen = (order) => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleReviewChange = (event) => {
        setReview(event.target.value);
    };

    const handleRatingChange = (event, newValue) => {
        setRating(newValue); // Handler for rating change
    };

    const handleSubmitReview = async () => {
        // Handle review submission logic here
        try {
          console.log(`Review for order ${order.orderId}: ${review}, Rating: ${rating}`);
          await reviewService.create({ orderId: order.orderId, content: review, rating }); // Include rating
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
        await ordersService.update(order.orderId, { status });
        dispatch(refetchUserInfo());
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

    const Buttons = ({ status }) => {
      if (userRole === 'buyer') {
        switch (status) {
          case 'Pending':
              return (
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Button variant="outlined" onClick={() => handleUpdateOrderStatus('Cancelled')} sx={{ fontFamily: 'Noto Serif SC', mb: 1 }}>取消订单</Button>
                  </Box>
              );
          case 'Delivering':
              return (
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Button variant="outlined" onClick={() => handleUpdateOrderStatus('Cancelled')} sx={{ fontFamily: 'Noto Serif SC', mb: 1 }}>取消订单</Button>
                      <Button variant="outlined" onClick={() => handleUpdateOrderStatus('Delivered')} sx={{ fontFamily: 'Noto Serif SC' }}>确认收货</Button>
                  </Box>
              );
          case 'Delivered':
              return (
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Button variant="outlined" onClick={() => handleClickOpen(order)} sx={{ fontFamily: 'Noto Serif SC' }}>评价卖家</Button>
                  </Box>
              );
          default:
              return null;
        }
      } else if (userRole === 'seller') {
        switch (status) {
          case 'Pending':
              return (
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Button variant="outlined" onClick={() => handleUpdateOrderStatus('Delivering')} sx={{ fontFamily: 'Noto Serif SC', mb: 1 }}>发货</Button>
                      <Button variant="outlined" onClick={() => handleUpdateOrderStatus('Cancelled')} sx={{ fontFamily: 'Noto Serif SC' }}>取消订单</Button>
                  </Box>
              );
          case 'Delivering':
              return (
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Button variant="outlined" onClick={() => handleUpdateOrderStatus('Cancelled')} sx={{ fontFamily: 'Noto Serif SC' }}>取消订单</Button>
                  </Box>
              );
          case 'Delivered':
              return (
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Button variant="outlined" onClick={() => handleClickOpen(order)} sx={{ fontFamily: 'Noto Serif SC' }}>评价买家</Button>
                  </Box>
              );
          default:
              return null;
        }
      } else {
        return null;
      }
    }


    return (
        <>
            <Card variant="outlined" sx={{ marginBottom: 1, borderRadius: 2, boxShadow: 3, fontFamily: 'Noto Serif SC' }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Noto Serif SC' }}>商品: {order.Product.name}</Typography>
                            <Typography variant="body1" gutterBottom sx={{ fontFamily: 'Noto Serif SC' }}>数量: {order.quantity}</Typography>
                            <Typography variant="body1" gutterBottom sx={{ fontFamily: 'Noto Serif SC' }}>总价: {order.total}</Typography>
                            <Typography variant="body1" gutterBottom sx={{ fontFamily: 'Noto Serif SC' }}>状态: {getStatusText(order.status)}</Typography>
                        </Box>
                        <Box flexGrow={1} flexDirection='flex-start'/>
                        <Divider orientation="vertical" flexItem/>
                        <Box sx={{ml : 4}}>
                          <Buttons status={order.status} />
                        </Box>
                    </Box>
                </CardContent>
            </Card>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>评价订单</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                      {userRole === 'buyer' ? '请评价卖家' : '请评价买家'}
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="评价"
                        type="text"
                        fullWidth
                        value={review}
                        multiline
                        onChange={handleReviewChange}
                    />
                    <Rating
                        name="rating"
                        value={rating}
                        onChange={handleRatingChange}
                        precision={0.5}
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" sx={{ fontFamily: 'Noto Serif SC' }}>
                        取消
                    </Button>
                    <Button onClick={handleSubmitReview} color="primary" sx={{ fontFamily: 'Noto Serif SC' }}>
                        提交
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default OrderCard;