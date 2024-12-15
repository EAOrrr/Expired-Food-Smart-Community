import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Box, Typography, List, Tab, Tabs, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import OrderCard from './OrderCard'
import ordersService from '../../services/orders'

const Selector = ({ value, onChange, options }) => (
    <FormControl>
        <InputLabel>订单状态</InputLabel>
        <Select
            value={value}
            onChange={onChange}
            label="订单状态"
            sx={{ minWidth: 120 }}
        >
            {options.map(option => (
                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
            ))}
        </Select>
    </FormControl>
)

const OrderList = () => {
    const user = useSelector(state => state.user)
    const [buyOrders, setBuyOrders] = useState([])
    const [sellOrders, setSellOrders] = useState([])
    const [tabIndex, setTabIndex] = useState(0)
    const [buyFilter, setBuyFilter] = useState('all')
    const [sellFilter, setSellFilter] = useState('all')

    const fetchOrders = async () => {
        if (user.info) {
            const buy = await ordersService.getAllBuyOrders()
            const sell = await ordersService.getAllSellOrders()
            setBuyOrders(buy)
            setSellOrders(sell)
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [user])

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue)
    }

    const handleBuyFilterChange = (event) => {
        setBuyFilter(event.target.value)
    }

    const handleSellFilterChange = (event) => {
        setSellFilter(event.target.value)
    }

    const filteredBuyOrders = buyFilter === 'all' ? buyOrders : buyOrders.filter(order => order.status === buyFilter)
    const filteredSellOrders = sellFilter === 'all' ? sellOrders : sellOrders.filter(order => order.status === sellFilter)

    const buyOptions = [
        { value: 'all', label: '全部' },
        { value: 'Pending', label: '待发货' },
        { value: 'Delivering', label: '已发货' },
        { value: 'Delivered', label: '已收货' },
        { value: 'Cancelled', label: '已取消' }
    ]

    const sellOptions = [
        { value: 'all', label: '全部' },
        { value: 'Pending', label: '待发货' },
        { value: 'Delivering', label: '已发货' },
        { value: 'Delivered', label: '已收货' },
        { value: 'Cancelled', label: '已取消' }
    ]

    // Add this function to update a single order's status
    const updateOrderStatus = (orderId, newStatus, type) => {
        const updateOrders = (orders) =>
            orders.map(order =>
                order.orderId === orderId ? { ...order, status: newStatus } : order
            );

        if (type === 'buy') {
            setBuyOrders(prevOrders => updateOrders(prevOrders));
        } else if (type === 'sell') {
            setSellOrders(prevOrders => updateOrders(prevOrders));
        }
    };

    return (
        <Box>
            <Tabs value={tabIndex} onChange={handleTabChange} aria-label="order tabs">
                <Tab label="我的购买" />
                <Tab label="我的销售" />
            </Tabs>
            {tabIndex === 0 && (
                <Box sx={{ padding: 2 }}>
                    <Selector value={buyFilter} onChange={handleBuyFilterChange} options={buyOptions} />
                    <List>
                        {filteredBuyOrders.map(order => (
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
            {tabIndex === 1 && (
                <Box sx={{ padding: 2 }}>
                    <Selector value={sellFilter} onChange={handleSellFilterChange} options={sellOptions} />
                    <List>
                        {filteredSellOrders.map(order => (
                            <OrderCard
                                key={order.id}
                                order={order}
                                userRole="seller"
                                updateOrderStatus={updateOrderStatus}
                                orderType="sell"
                            />
                        ))}
                    </List>
                </Box>
            )}
        </Box>
    )
}

export default OrderList
