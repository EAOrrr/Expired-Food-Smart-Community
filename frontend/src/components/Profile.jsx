import React, { useEffect, useState } from 'react'
import { Tabs, Tab, Box, Typography, Card, CardContent } from '@mui/material'
import userService from '../services/user'

const Profile = () => {
  const [userInfo, setUserInfo] = useState(null)
  const [reviewsGiven, setReviewsGiven] = useState([])
  const [reviewsReceived, setReviewsReceived] = useState([])
  const [tabIndex, setTabIndex] = useState(0)

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await userService.getInfo()
        setUserInfo(data)
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
              <Typography variant="body1" sx={{ fontFamily: 'Noto Serif SC' }}>电话号码：{userInfo.phone}</Typography>
              <Typography variant="body1" sx={{ fontFamily: 'Noto Serif SC' }}>住址：{userInfo.address}</Typography>
            </CardContent>
          </Card>
        </Box>
      )}
      {tabIndex === 1 && (
        <Box sx={{ p: 3 }}>
          {reviewsGiven.map(review => (
            <Card key={review.reviewId} variant="outlined" sx={{ borderRadius: 2, boxShadow: 3, fontFamily: 'Noto Serif SC', marginBottom: 2 }}>
              <CardContent>
                <Typography variant="body1" sx={{ fontFamily: 'Noto Serif SC' }}>评分：{review.rating}</Typography>
                <Typography variant="body1" sx={{ fontFamily: 'Noto Serif SC' }}>评论：{review.content}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
      {tabIndex === 2 && (
        <Box sx={{ p: 3 }}>
          {reviewsReceived.map(review => (
            <Card key={review.reviewId} variant="outlined" sx={{ borderRadius: 2, boxShadow: 3, fontFamily: 'Noto Serif SC', marginBottom: 2 }}>
              <CardContent>
                <Typography variant="body1" sx={{ fontFamily: 'Noto Serif SC' }}>评分：{review.rating}</Typography>
                <Typography variant="body1" sx={{ fontFamily: 'Noto Serif SC' }}>评论：{review.content}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  )
}

export default Profile
