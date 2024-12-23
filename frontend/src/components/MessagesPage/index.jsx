import React, { useEffect, useState } from 'react'
import messageService from '../../services/messages'
import Loading from '../Loading'
import { useDispatch, useSelector } from 'react-redux'
import BillCard from './BillCard'
import { Container, Typography, List, Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, CircularProgress } from '@mui/material'
import ErrorIcon from '@mui/icons-material/Error'


const BillsPage = () => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const user = useSelector(state => state.user.info)
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchBills = async () => {
      try {
        setLoading(true)
        const messages = await messageService.getAll()
        setMessages(messages)
        setError(false)
      } catch (error) {
        console.error('Failed to fetch messages:', error)
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchBills()
  }, [])
  

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
        <Typography variant="h6" sx={{ ml: 2, fontFamily: 'Noto Serif SC' }}>获取消息失败</Typography>
      </Box>
    )
  }

  if (!user) {
    return <Loading message='用户账单加载中'/>
  }

  if (messages.length === 0) {
    return (
      <Container sx={{ fontFamily: 'Noto Serif SC' }}>
        <Typography variant="h6" sx={{ fontFamily: 'Noto Serif SC' }}>暂无消息</Typography>
      </Container>
    )
  }

  return (
    <Container sx={{ fontFamily: 'Noto Serif SC' }}>
      <h1>我的账单</h1>
      <List>
        {messages.map(bill => (
          <BillCard key={bill.billId} bill={bill} />
        ))}
      </List>
    </Container>
  )
}

export default BillsPage