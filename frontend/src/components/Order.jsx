import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Box, Typography, List, ListItem, ListItemText, Divider, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Rating } from '@mui/material'
import ordersService from '../services/orders'
import reviewService from '../services/review'

const Order = () => {
    const user = useSelector(state => state.user)
    const [buyOrders, setBuyOrders] = useState([])
    const [sellOrders, setSellOrders] = useState([])
    const [open, setOpen] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [reviewContent, setReviewContent] = useState('')
    const [reviewRating, setReviewRating] = useState(0)

    useEffect(() => {
        const fetchOrders = async () => {
            if (user.info) {
                const buyOrders = await ordersService.getAllBuyOrders()
                const sellOrders = await ordersService.getAllSellOrders()
                setBuyOrders(buyOrders)
                setSellOrders(sellOrders)
            }
        }
        fetchOrders()
    }, [user])

    const handleClickOpen = (order) => {
        setSelectedOrder(order)
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
        setSelectedOrder(null)
        setReviewContent('')
        setReviewRating(0)
    }

    const handleSubmitReview = async () => {
        if (selectedOrder) {
            const review = {
                content: reviewContent,
                rating: reviewRating,
                orderId: selectedOrder.id
            }
            await reviewService.create(review)
            handleClose()
        }
    }

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h4" gutterBottom>我的订单</Typography>
            <Typography variant="h6" gutterBottom>购买订单</Typography>
            {buyOrders.length === 0 ? (
                <Typography variant="body1">暂无购买订单</Typography>
            ) : (
                <List>
                    {buyOrders.map(order => (
                        <React.Fragment key={order.id}>
                            <ListItem>
                                <ListItemText primary={`商品: ${order.Products.name}`} secondary={`数量: ${order.quantity} 总价: ${order.total} 状态: ${order.status}`} />
                                <Button variant="outlined" onClick={() => handleClickOpen(order)}>评价</Button>
                            </ListItem>
                            <Divider />
                        </React.Fragment>
                    ))}
                </List>
            )}
            <Typography variant="h6" gutterBottom>销售订单</Typography>
            {sellOrders.length === 0 ? (
                <Typography variant="body1">暂无销售订单</Typography>
            ) : (
                <List>
                    {sellOrders.map(order => (
                        <React.Fragment key={order.id}>
                            <ListItem>
                                <ListItemText primary={`商品: ${order.Product.name}`} secondary={`数量: ${order.quantity} 总价: ${order.total} 状态: ${order.status}`} />
                                <Button variant="outlined" onClick={() => handleClickOpen(order)}>评价</Button>
                            </ListItem>
                            <Divider />
                        </React.Fragment>
                    ))}
                </List>
            )}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>评价订单</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        请为订单 {selectedOrder?.Products.name} 进行评价。
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="评价内容"
                        fullWidth
                        variant="standard"
                        value={reviewContent}
                        onChange={(e) => setReviewContent(e.target.value)}
                    />
                    <Rating
                        name="rating"
                        value={reviewRating}
                        onChange={(event, newValue) => {
                            setReviewRating(newValue)
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>取消</Button>
                    <Button onClick={handleSubmitReview}>提交</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default Order
