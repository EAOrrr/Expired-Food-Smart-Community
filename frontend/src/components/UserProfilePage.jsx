import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Box, Typography, Card, CardContent, Tabs, Tab } from '@mui/material'
import userService from '../services/user'

const UserProfile = () => {
  const { id } = useParams()
  const [userInfo, setUserInfo] = useState(null)
  const [reviewsGiven, setReviewsGiven] = useState([])
  const [reviewsReceived, setReviewsReceived] = useState([])
  const [tabIndex, setTabIndex] = useState(0)

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await userService.getUserInfo(id)
        console.log(data)
        setUserInfo(data)
        setReviewsReceived(data.ReviewsReceived)
      } catch (error) {
        console.error('Failed to fetch user info:', error)
      }
    }

    const fetchReviewsGiven = async () => {
      try {
        const givenData = await userService.getInfo({ review: 'given' })
        if (givenData.reviews && givenData.reviews.given) {
          setReviewsGiven(givenData.reviews.given)
        } else {
          console.error('No reviews given data found')
        }
      } catch (error) {
        console.error('Failed to fetch reviews given:', error)
      }
    }

    fetchUserInfo()
    fetchReviewsGiven()
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
      <Tabs value={tabIndex} onChange={handleTabChange} sx={{ marginBottom: 2 }}>
        <Tab label="个人信息" sx={{ fontFamily: 'Noto Serif SC', fontWeight: 'bold' }} />
        <Tab label="收到的评论" sx={{ fontFamily: 'Noto Serif SC', fontWeight: 'bold' }} />
        <Tab label="发出的评论" sx={{ fontFamily: 'Noto Serif SC', fontWeight: 'bold' }} />
      </Tabs>
      {tabIndex === 0 && (
        <Box sx={{ p: 3 }}>
          <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: 3, fontFamily: 'Noto Serif SC' }}>
            <CardContent>
              <Typography variant="body1" sx={{ fontFamily: 'Noto Serif SC' }}>用户名：{userInfo.username}</Typography>
              <Typography variant="body1" sx={{ fontFamily: 'Noto Serif SC' }}>用户ID: {userInfo.userId}</Typography>
            </CardContent>
          </Card>
        </Box>
      )}
      {tabIndex === 1 && (
        <Box sx={{ p: 3 }}>
          {reviewsReceived.length > 0 ? (
            reviewsReceived.map(review => (
              <Card key={review.reviewId} variant="outlined" sx={{ borderRadius: 2, boxShadow: 3, fontFamily: 'Noto Serif SC', marginBottom: 2 }}>
                <CardContent>
                  <Typography variant="body1" sx={{ fontFamily: 'Noto Serif SC' }}>评分: {review.rating}</Typography>
                  <Typography variant="body1" sx={{ fontFamily: 'Noto Serif SC' }}>评论：{review.content}</Typography>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography variant="body1" sx={{ fontFamily: 'Noto Serif SC' }}>没有收到的评论</Typography>
          )}
        </Box>
      )}
      {tabIndex === 2 && (
        <Box sx={{ p: 3 }}>
          {reviewsGiven.length > 0 ? (
            reviewsGiven.map(review => (
              <Card key={review.reviewId} variant="outlined" sx={{ borderRadius: 2, boxShadow: 3, fontFamily: 'Noto Serif SC', marginBottom: 2 }}>
                <CardContent>
                  <Typography variant="body1" sx={{ fontFamily: 'Noto Serif SC' }}>评分: {review.rating}</Typography>
                  <Typography variant="body1" sx={{ fontFamily: 'Noto Serif SC' }}>评论：{review.content}</Typography>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography variant="body1" sx={{ fontFamily: 'Noto Serif SC' }}>没有发出的评论</Typography>
          )}
        </Box>
      )}
    </Box>
  )
}

export default UserProfile
