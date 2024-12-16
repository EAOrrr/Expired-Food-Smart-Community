import React, { useEffect, useState } from 'react'
import { Tabs, Tab, Box, Typography, Card, CardContent, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import userService from '../services/user'

const Profile = () => {
  const [userInfo, setUserInfo] = useState(null)
  const [reviewsGiven, setReviewsGiven] = useState([])
  const [reviewsReceived, setReviewsReceived] = useState([])
  const [tabIndex, setTabIndex] = useState(0)
  const [open, setOpen] = useState(false)
  const [username, setUsername] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await userService.getInfo()
        setUserInfo(data)
        setUsername(data.username)
        setPhone(data.phone)
        setAddress(data.address)
      } catch (error) {
        console.error('Failed to fetch user info:', error)
      }
    }

    const fetchReviews = async () => {
      try {
        const givenData = await userService.getInfo({ review: 'given' })
        if (givenData.reviews && givenData.reviews.given) {
          setReviewsGiven(givenData.reviews.given)
        } else {
          console.error('No reviews given data found')
        }

        const receivedData = await userService.getInfo({ review: 'received' })
        if (receivedData.reviews && receivedData.reviews.received) {
          setReviewsReceived(receivedData.reviews.received)
        } else {
          console.error('No reviews received data found')
        }
      } catch (error) {
        console.error('Failed to fetch reviews:', error)
      }
    }

    fetchUserInfo()
    fetchReviews()
  }, [])

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue)
  }

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleUpdateProfile = async () => {
    try {
      const updatedUser = await userService.update({ username, phone, address, password })
      setUserInfo(updatedUser)
      setOpen(false)
    } catch (error) {
      console.error('Failed to update user info:', error)
    }
  }

  if (!userInfo) {
    return <div>Loading...</div>
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Noto Serif SC', fontWeight: 'bold' }}>个人信息</Typography>
      <Tabs value={tabIndex} onChange={handleTabChange} sx={{ marginBottom: 2 }}>
        <Tab label="个人信息" sx={{ fontFamily: 'Noto Serif SC', fontWeight: 'bold' }} />
        <Tab label="给出的评论" sx={{ fontFamily: 'Noto Serif SC', fontWeight: 'bold' }} />
        <Tab label="收到的评论" sx={{ fontFamily: 'Noto Serif SC', fontWeight: 'bold' }} />
      </Tabs>
      {tabIndex === 0 && (
        <Box sx={{ p: 3 }}>
          <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: 3, fontFamily: 'Noto Serif SC' }}>
            <CardContent>
              <Typography variant="body1" sx={{ fontFamily: 'Noto Serif SC' }}>用户名：{userInfo.username}</Typography>
              <Typography variant="body1" sx={{ fontFamily: 'Noto Serif SC' }}>电话号码：{userInfo.phone}</Typography>
              <Typography variant="body1" sx={{ fontFamily: 'Noto Serif SC' }}>住址：{userInfo.address}</Typography>
              <Button variant="outlined" onClick={handleOpen} sx={{ fontFamily: 'Noto Serif SC', marginTop: 2 }}>修改信息</Button>
            </CardContent>
          </Card>
        </Box>
      )}
      {tabIndex === 1 && (
        <Box sx={{ p: 3 }}>
          {reviewsGiven.length > 0 ? (
            reviewsGiven.map(review => (
              <Card key={review.reviewId} variant="outlined" sx={{ borderRadius: 2, boxShadow: 3, fontFamily: 'Noto Serif SC', marginBottom: 2 }}>
                <CardContent>
                  <Typography variant="body1" sx={{ fontFamily: 'Noto Serif SC' }}>评分：{review.rating}</Typography>
                  <Typography variant="body1" sx={{ fontFamily: 'Noto Serif SC' }}>评论：{review.content}</Typography>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography variant="body1" sx={{ fontFamily: 'Noto Serif SC' }}>没有给出的评论</Typography>
          )}
        </Box>
      )}
      {tabIndex === 2 && (
        <Box sx={{ p: 3 }}>
          {reviewsReceived.length > 0 ? (
            reviewsReceived.map(review => (
              <Card key={review.reviewId} variant="outlined" sx={{ borderRadius: 2, boxShadow: 3, fontFamily: 'Noto Serif SC', marginBottom: 2 }}>
                <CardContent>
                  <Typography variant="body1" sx={{ fontFamily: 'Noto Serif SC' }}>评分：{review.rating}</Typography>
                  <Typography variant="body1" sx={{ fontFamily: 'Noto Serif SC' }}>评论：{review.content}</Typography>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography variant="body1" sx={{ fontFamily: 'Noto Serif SC' }}>没有收到的评论</Typography>
          )}
        </Box>
      )}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>修改个人信息</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="用户名"
            type="text"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="dense"
            label="电话号码"
            type="text"
            fullWidth
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <TextField
            margin="dense"
            label="住址"
            type="text"
            fullWidth
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <TextField
            margin="dense"
            label="密码"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{ fontFamily: 'Noto Serif SC' }}>取消</Button>
          <Button onClick={handleUpdateProfile} sx={{ fontFamily: 'Noto Serif SC' }}>保存</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Profile
