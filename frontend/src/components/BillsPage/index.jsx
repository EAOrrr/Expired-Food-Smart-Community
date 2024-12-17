import React, { useEffect, useState } from 'react'
// import userService from '../services/user'
import billService from '../../services/bills'
import userService from '../../services/user'
import Loading from '../Loading'
import { useDispatch, useSelector } from 'react-redux'
import BillCard from './BillCard'
import { Container, Typography, List, Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, CircularProgress } from '@mui/material'
import { createNotification } from '../../reducers/notificationReducer'
import { updateUser } from '../../reducers/userReducer'
import ErrorIcon from '@mui/icons-material/Error'

const BillsPage = () => {
  const [bills, setBills] = useState([])
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState(0)
  const [depositing, setDepositing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const user = useSelector(state => state.user.info)
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchBills = async () => {
      try {
        setLoading(true)
        const bills = await billService.getAll()
        setBills(bills)
        setError(false)
      } catch (error) {
        console.error('Failed to fetch bills:', error)
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchBills()
  }, [])
  
  const handleDeposit = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleConfirm = async () => {
    // Handle deposit logic here
    // console.log('存钱金额:', amount)
    if (amount <= 0) {
      dispatch(createNotification('存钱失败: 金额无效', 'error'))
      setOpen(false)
      return
    }
    try {
      setDepositing(true)
      const userBalanceAfterDeposit = await userService.deposit(amount)
      setDepositing(false)
      console.log('存钱成功:', userService)
      dispatch(createNotification('存钱成功', 'success'))
      dispatch(updateUser(userBalanceAfterDeposit))
      setBills([...bills, {
        amount: parseFloat(amount).toFixed(2),
        operation: 'deposit',
        createdAt: new Date().toISOString()
      }].sort((a, b) => ((new Date(b.createdAt) - new Date(a.createdAt)) || a.billId > b.billId)))
    } catch (error) {
      console.log('存钱失败:', error)
      dispatch(createNotification('存钱失败', 'error'))
      switch (error.response.status) {
        case 400:
          dispatch(createNotification('存钱失败: 金额无效', 'error'))
          break
        case 401:
          dispatch(createNotification('存钱失败: 未登录', 'error'))
          break
        case 429:
          dispatch(createNotification('存钱失败: 操作过于频繁', 'error'))
          break
        case 500:
          dispatch(createNotification('存钱失败: 服务器错误', 'error'))
          break
        default:
          dispatch(createNotification('存钱失败: 未知错误', 'error'))
      }
    }
    setOpen(false)
    setDepositing(false)
  }

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
        <Typography variant="h6" sx={{ ml: 2, fontFamily: 'Noto Serif SC' }}>获取账单失败</Typography>
      </Box>
    )
  }

  if (!user) {
    return <Loading message='用户账单加载中'/>
  }

  return (
    <Container sx={{ fontFamily: 'Noto Serif SC' }}>
      <h1>我的账单</h1>
      <Box flexDirection='row' display='flex' justifyContent='flex-start'>
        <Typography variant="h6" gutterBottom fontFamily='Noto Serif SC'>当前余额: {user.balance}</Typography>
        <Button disabled={depositing} variant="contained" color="primary" onClick={handleDeposit} sx={{ marginBottom: 2, ml: 3 }}>
          存钱
        </Button>
      </Box>
      <List>
        {bills.map(bill => (
          <BillCard key={bill.billId} bill={bill} />
        ))}
      </List>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>存钱</DialogTitle>
        <DialogContent>
          <DialogContentText>
            请输入存款金额:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="金额"
            type="number"
            fullWidth
            variant="standard"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>取消</Button>
          <Button onClick={handleConfirm}>确认</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default BillsPage