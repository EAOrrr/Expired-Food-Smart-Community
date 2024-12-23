import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Box, List, Tab, Tabs, Typography, CircularProgress } from '@mui/material'
import OrderCard from '../OrderCard'
import ordersService from '../../services/orders'
import ErrorIcon from '@mui/icons-material/Error'

// Remove Selector component

const BuyOrderList = () => {
    const user = useSelector(state => state.user)
    const [buyOrders, setBuyOrders] = useState([])
    const [tabIndex, setTabIndex] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    // Remove sellFilter state
    // const [sellFilter, setSellFilter] = useState('all')

    const fetchOrders = async () => {
        try {
            setLoading(true)
            if (user.info) {
                const buy = await ordersService.getAllBuyOrders()
                setBuyOrders(buy)
                setError(false)
            }
        } catch (error) {
            console.error('Failed to fetch orders:', error)
            setError(true)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [user])

    // Remove handleSellFilterChange
    // const handleSellFilterChange = (event) => {
    //     setSellFilter(event.target.value)
    // }

    // Add new state for order status
    const [orderStatus, setOrderStatus] = useState('all')

    // Update filteredSellOrders to use orderStatus
    const filteredSellOrders = orderStatus === 'all' ? buyOrders : buyOrders.filter(order => order.status === orderStatus)

    // Remove sellOptions
    // const sellOptions = [
    //     { value: 'all', label: '全部' },
    //     { value: 'Pending', label: '待发货' },
    //     { value: 'Delivering', label: '已发货' },
    //     { value: 'Delivered', label: '已收货' },
    //     { value: 'Cancelled', label: '已取消' }
    // ]

    const handleOrderStatusChange = (event, newValue) => {
        setOrderStatus(newValue)
    }

    // Add this function to update a single order's status
    const updateOrderStatus = (orderId, newStatus, type) => {
        const updateOrders = (orders) =>
            orders.map(order =>
                order.orderId === orderId ? { ...order, status: newStatus } : order
            );

        if (type === 'sell') {
            setBuyOrders(prevOrders => updateOrders(prevOrders));
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'center' }}>
                <CircularProgress size={60} />
            </Box>
        )
    }

    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'center'}}>
                <ErrorIcon sx={{ fontSize: 60 , color: 'red' }} />
                <Typography variant="h6" sx={{ ml: 2, fontFamily: 'Noto Serif SC' }}>获取订单失败</Typography>
            </Box>
        )
    }

    if (buyOrders.length === 0) {
        return (
            <Box p={3}>
                <Typography variant='h4' gutterBottom sx={{ fontFamily: 'Noto Serif SC', fontWeight: 'bold' }}>
                    我的购买订单
                </Typography>
                <Typography variant="h6" sx={{ fontFamily: 'Noto Serif SC' }}>暂无订单</Typography>
            </Box>
        )
    }

    return (
        <Box p={3}>
          <Typography variant='h4' gutterBottom sx={{ fontFamily: 'Noto Serif SC', fontWeight: 'bold' }}>
          我的购买订单
          </Typography>
            {tabIndex === 0 && (
                <Box sx={{ padding: 2 }}>
                    {/* Add Tabs for order status */}
                    <Tabs value={orderStatus} onChange={handleOrderStatusChange} aria-label="status tabs" sx={{ marginBottom: 2 }}>
                        <Tab label="全部" value="all" />
                        <Tab label="待发货" value="Pending" />
                        <Tab label="已发货" value="Delivering" />
                        <Tab label="已收货" value="Delivered" />
                        <Tab label="已取消" value="Cancelled" />
                    </Tabs>
                    <List>
                        {filteredSellOrders.map(order => (
                            <OrderCard
                                key={order.id}
                                order={order}
                                userRole="buyer"
                                updateOrderStatus={updateOrderStatus}
                                orderType="buy"
                            />
                        ))}
                    </List>
                </Box>
            )}
        </Box>
    )
}

export default BuyOrderList