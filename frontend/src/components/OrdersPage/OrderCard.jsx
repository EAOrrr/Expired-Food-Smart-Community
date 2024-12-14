import React, { useState } from 'react';
import { 
  ListItem, 
  ListItemText, 
  Button, 
  Divider, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle, 
  TextField 
} from '@mui/material';
/*
  * TODO:
  * 美化订单卡片 + 评价对话框
*/
const OrderCard = ({ order }) => {
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

    return (
        <>
            <ListItem>
                <ListItemText 
                    primary={`商品: ${order.Product.name}`} 
                    secondary={`数量: ${order.quantity} 总价: ${order.total} 状态: ${order.status}`} 
                />
                <Button variant="outlined" onClick={() => handleClickOpen(order)}>评价</Button>
            </ListItem>
            <Divider />
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
                    <Button onClick={handleClose} color="primary">
                        取消
                    </Button>
                    <Button onClick={handleSubmitReview} color="primary">
                        提交
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default OrderCard;