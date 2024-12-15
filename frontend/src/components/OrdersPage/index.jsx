import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Box, Typography, List, ListItem, ListItemText, Divider, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Rating } from '@mui/material'
import ordersService from '../../services/orders'
import reviewService from '../../services/review'
import OrderCard from './OrderCard'

/*
  * 订单页面
  * TODO：拓展：订单状态筛选、订单分开展示
*/
const Order = () => {
    const user = useSelector(state => state.user)
    const [buyOrders, setBuyOrders] = useState([])
    const [sellOrders, setSellOrders] = useState([])
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [reviewContent, setReviewContent] = useState('')
    const [reviewRating, setReviewRating] = useState(0)
    const [open, setOpen] = useState(false)

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
    console.log(buyOrders)
    console.log(sellOrders)
    console.log('sellproduct', sellOrders && sellOrders.map(order => order.Product.name))
    // return (<></>)

    return (
        <div>
            <h1>我的订单</h1>
            <Typography variant="h6" gutterBottom>购买订单</Typography>
            {buyOrders.length === 0 ? (
                <Typography variant="body1">暂无购买订单</Typography>
            ) : (
                <List>
                    {buyOrders.map(order => (
                        <OrderCard key={order.id} order={order} />
                    ))}
                </List>
            )}
            <Typography variant="h6" gutterBottom>销售订单</Typography>
            {sellOrders.length === 0 ? (
                <Typography variant="body1">暂无销售订单</Typography>
            ) : (
                <List>
                    {sellOrders.map(order => (
                        <OrderCard key={order.id} order={order} />
                    ))}
                </List>
            )}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>创建评论</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="评论内容"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={reviewContent}
                        onChange={(e) => setReviewContent(e.target.value)}
                    />
                    <Rating
                        name="rating"
                        value={reviewRating}
                        onChange={(e, newValue) => setReviewRating(newValue)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>取消</Button>
                    <Button onClick={handleSubmitReview}>提交</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default Order
