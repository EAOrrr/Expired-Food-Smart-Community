import React, { useState } from 'react';
import {
    Tabs,
    Tab,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Typography,
    Modal,
    Box,
    Grid,
    Button,
    ButtonGroup,
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';

const mockOrders = [
    {
        id: 1,
        type: 'buy',
        status: 'pendingPayment',
        seller: 'seller1',
        buyer: 'user1',
        items: [{ name: '苹果', quantity: 2, price: 5 }],
        total: 10,
        createdAt: '2024-03-08 10:00',
    },
    {
        id: 2,
        type: 'buy',
        status: 'shipped',
        seller: 'seller2',
        buyer: 'user1',
        items: [{ name: '牛奶', quantity: 1, price: 6 }],
        total: 6,
        createdAt: '2024-03-07 15:00',
    },
    {
        id: 3,
        type: 'sell',
        status: 'pendingShipment',
        seller: 'user1',
        buyer: 'buyer1',
        items: [{ name: '面包', quantity: 3, price: 4 }],
        total: 12,
        createdAt: '2024-03-06 12:00',
    },
    {
        id: 4,
        type: 'sell',
        status: 'completed',
        seller: 'user1',
        buyer: 'buyer2',
        items: [{ name: '香蕉', quantity: 4, price: 3 }],
        total: 12,
        createdAt: '2024-03-05 09:00',
    }
];

const statusOptions = {
    buy: ['pendingPayment', 'shipped', 'received', 'completed'],
    sell: ['pendingShipment', 'shipped', 'completed'],
};

function OrderList() {
    const [tabValue, setTabValue] = useState(0);
    const [buyFilter, setBuyFilter] = useState('pendingPayment');
    const [sellFilter, setSellFilter] = useState('pendingShipment');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleBuyFilterChange = (event) => {
        setBuyFilter(event.target.value);
    };

    const handleSellFilterChange = (event) => {
        setSellFilter(event.target.value);
    };


    const handleOrderClick = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };
    const filteredOrders = (tabValue === 0 ? mockOrders.filter(order => order.type === 'buy' && order.status === buyFilter) : mockOrders.filter(order => order.type === 'sell' && order.status === sellFilter))

    return (
        <div>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="order tabs">
                <Tab label="我的购买" />
                <Tab label="我的销售" />
            </Tabs>
            {tabValue === 0 && (
                <Box sx={{ padding: 2 }}>
                    <Grid container spacing={2} alignItems="center" justifyContent="flex-start">
                        <Grid item>
                            <FormControl>
                                <InputLabel>订单状态</InputLabel>
                                <Select
                                    value={buyFilter}
                                    onChange={handleBuyFilterChange}
                                    label="订单状态"
                                >
                                    {statusOptions.buy.map(status => (
                                        <MenuItem key={status} value={status}>{status}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>

                    <List>
                        {filteredOrders.map(order => (
                            <ListItem key={order.id} button onClick={() => handleOrderClick(order)}>
                                <ListItemAvatar>
                                    <Avatar>
                                        <ImageIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={`订单号: ${order.id}`}
                                    secondary={`创建于: ${order.createdAt}`}
                                />
                            </ListItem>
                        ))}
                    </List>

                </Box>
            )}

            {tabValue === 1 && (
                <Box sx={{ padding: 2 }}>
                    <Grid container spacing={2} alignItems="center" justifyContent="flex-start">
                        <Grid item>
                            <FormControl>
                                <InputLabel>订单状态</InputLabel>
                                <Select
                                    value={sellFilter}
                                    onChange={handleSellFilterChange}
                                    label="订单状态"
                                >
                                    {statusOptions.sell.map(status => (
                                        <MenuItem key={status} value={status}>{status}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                    </Grid>
                    <List>
                        {filteredOrders.map(order => (
                            <ListItem key={order.id} button onClick={() => handleOrderClick(order)}>
                                <ListItemAvatar>
                                    <Avatar>
                                        <ImageIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={`订单号: ${order.id}`}
                                    secondary={`创建于: ${order.createdAt}`}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}

            <Modal open={isModalOpen} onClose={handleModalClose}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                }}>
                    {selectedOrder && (
                        <>
                            <Typography variant="h6">订单详情</Typography>
                            <Typography>订单号：{selectedOrder.id}</Typography>
                            <Typography>类型：{selectedOrder.type === 'buy' ? '购买' : '销售'}</Typography>
                            <Typography>状态：{selectedOrder.status}</Typography>
                            <Typography>总额：{selectedOrder.total}</Typography>
                            <Typography>创建时间: {selectedOrder.createdAt}</Typography>
                            <Typography>商品：</Typography>
                            {selectedOrder.items.map((item, index) => (
                                <Typography key={index}>
                                    {item.name} x {item.quantity}  (单价：{item.price} )
                                </Typography>
                            ))}

                            <Button onClick={handleModalClose} sx={{ mt: 2 }}>关闭</Button>
                        </>
                    )}
                </Box>
            </Modal>
        </div>
    );
}

export default OrderList;