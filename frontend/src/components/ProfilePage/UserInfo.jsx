import React, { useState } from 'react'
import { Box, Typography, Button, Container, Paper } from '@mui/material'
import EditProfileDialog from './EditProfileDialog'
import { useSelector } from 'react-redux'

const UserInfo = () => {
  const userInfo = useSelector(state => state.user.info)
  const [open, setOpen] = useState(false)

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  if (!userInfo) {
    return <div>Loading...</div>
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" sx={{ fontFamily: 'Noto Serif SC', mb: 3 }}>个人信息</Typography>
        <Typography variant="h6" sx={{ fontFamily: 'Noto Serif SC', mb: 2 }}>用户名：{userInfo.username}</Typography>
        <Typography variant="h6" sx={{ fontFamily: 'Noto Serif SC', mb: 2 }}>电话号码：{userInfo.phone}</Typography>
        <Typography variant="h6" sx={{ fontFamily: 'Noto Serif SC', mb: 2 }}>住址：{userInfo.address}</Typography>
        <Button variant="outlined" onClick={handleOpen} sx={{ fontFamily: 'Noto Serif SC', mt: 3 }}>修改信息</Button>
        <EditProfileDialog
          open={open}
          handleClose={handleClose}
        />
      </Paper>
    </Container>
  )
}

export default UserInfo
