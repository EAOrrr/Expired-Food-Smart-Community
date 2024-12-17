import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Box, Typography, List, Tab, Tabs } from '@mui/material'
import ordersService from '../../services/orders'
import reviewService from '../../services/review'
import OrderCard from '../OrderCard'
import OrderList from './OrderList'

/*
  * 订单页面
  * TODO：拓展：订单状态筛选、订单分开展示
*/
const Order = () => {

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Noto Serif SC', fontWeight: 'bold' }}>我的订单</Typography>
            <OrderList />
        </Box>
    )
}

export default Order
