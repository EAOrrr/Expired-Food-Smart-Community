import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Box, Typography, Card, CardContent, Tabs, Tab, Avatar, Rating } from '@mui/material'
import userService from '../../services/user'
import ReviewCard from '../ProfilePage/ReviewCard'

const UserProfile = () => {
  const { id } = useParams()
  const [userInfo, setUserInfo] = useState(null)

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userData = await userService.getUserInfo(id)
        console.log(userData)
        setUserInfo(userData)
      } catch (error) {
        console.error('Failed to fetch user info:', error)
      }
    }

    fetchUserInfo()
  }, [id])

  

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue)
  }

  if (!userInfo) {
    return <div>加载中...</div>
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Noto Serif SC', fontWeight: 'bold' }}>商家信息</Typography>
        <Box sx={{ p: 3 }}>
          <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: 3, fontFamily: 'Noto Serif SC' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ width: 100, height: 100, fontSize: 40, borderRadius: 2, backgroundColor: 'primary.main', color: 'primary.contrastText' }}>
                  {userInfo.username.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ ml: 2 }}>
                  <Typography variant="body1" sx={{ fontFamily: 'Noto Serif SC' }}>用户名：{userInfo.username}</Typography>
                  <Typography variant="body1" sx={{ fontFamily: 'Noto Serif SC' }}>电话：{userInfo.phone}</Typography>
                  <Typography variant='body1' sx={{ fontFamily: 'Noto Serif SC' }}>
                    {userInfo.averageRating ? `平均评分：${parseFloat(userInfo.averageRating).toFixed(1)}` : '暂无评分'} 
                    {userInfo.averageRating ? <Rating value={userInfo.averageRating} readOnly /> : null}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
            <Box mt={3} fontFamily={'Noto Serif SC'}>
              <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Noto Serif SC', fontWeight: 'bold' }}>用户收到的评论如下：</Typography>
              {
                userInfo.ReviewsReceived && userInfo.ReviewsReceived.length > 0
                  ? userInfo.ReviewsReceived.map(review => (
                   <ReviewCard key={review.id} review={review} />
                  ))
                  : '暂无评论'
              }
            </Box>
        </Box>
    </Box>
  )
}

export default UserProfile
