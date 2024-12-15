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
  Box 
} from '@mui/material';
import ordersService from '../../services/orders';

const OrderCard = ({ order, userRole }) => {
    const [open, setOpen] = useState(false);
    const [review, setReview] = useState('');

    const handleClickOpen = (order) => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleReviewChange = (event) => {
        setReview(event.target.value);
    };

    const handleSubmitReview = () => {
        // Handle review submission logic here
        console.log(`Review for order ${order.id}: ${review}`);
        setOpen(false);
    };

    const handleChangeStatus = async () => {
        const newStatus = order.status === 'Pending' ? 'Delivering' : 'Delivered';
        await ordersService.update(order.id, { status: newStatus });
        console.log(`Order ${order.id} status changed to ${newStatus}`);
    };

    const handleCancelOrder = async () => {
        await ordersService.update(order.id, { status: 'Cancelled' });
        console.log(`Order ${order.id} status changed to Cancelled`);
    };

    const handleConfirmDelivery = async () => {
        await ordersService.update(order.id, { status: 'Delivered' });
        console.log(`Order ${order.id} status changed to Delivered`);
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

    const renderButtons = () => {
        if (order.status === 'Pending') {
            if (userRole === 'buyer') {
                return (
                    <Button variant="outlined" onClick={handleCancelOrder} sx={{ fontFamily: 'Noto Serif SC' }}>取消订单</Button>
                );
            } else if (userRole === 'seller') {
                return (
                    <>
                        <Button variant="outlined" onClick={handleCancelOrder} sx={{ fontFamily: 'Noto Serif SC' }}>取消订单</Button>
                        <Button variant="outlined" onClick={handleChangeStatus} sx={{ fontFamily: 'Noto Serif SC', marginLeft: 1 }}>完成发货</Button>
                    </>
                );
            }
        } else if (order.status === 'Delivering') {
            if (userRole === 'buyer') {
                return (
                    <>
                        <Button variant="outlined" onClick={handleCancelOrder} sx={{ fontFamily: 'Noto Serif SC' }}>取消订单</Button>
                        <Button variant="outlined" onClick={handleConfirmDelivery} sx={{ fontFamily: 'Noto Serif SC', marginLeft: 1 }}>确认收货</Button>
                    </>
                );
            } else if (userRole === 'seller') {
                return (
                    <Button variant="outlined" onClick={handleCancelOrder} sx={{ fontFamily: 'Noto Serif SC' }}>取消订单</Button>
                );
            }
        }
        return null;
    };

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
                        <Box>
                            <Button variant="outlined" onClick={() => handleClickOpen(order)} sx={{ fontFamily: 'Noto Serif SC' }}>评价</Button>
                            {renderButtons()}
                        </Box>
                    </Box>
                </CardContent>
            </Card>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>评价订单</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        请为您的交易方。（分清卖家和卖家）
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="评价"
                        type="text"
                        fullWidth
                        value={review}
                        onChange={handleReviewChange}
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