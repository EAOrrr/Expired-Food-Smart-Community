import React, { useEffect, useState } from 'react'
import { Box, Typography, CircularProgress } from '@mui/material'
import userService from '../../services/user'
import ReviewCard from './ReviewCard'
import { useDispatch } from 'react-redux'
import { createNotification } from '../../reducers/notificationReducer'
import ErrorIcon from '@mui/icons-material/Error'

const ReviewsReceived = () => {
  const dispatch = useDispatch()
  const [reviewsReceived, setReviewsReceived] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchReviewsReceived = async () => {
      try {
        setLoading(true)
        const receivedData = await userService.getInfo({ review: 'received' })
        if (receivedData.reviews && receivedData.reviews.received) {
          setReviewsReceived(receivedData.reviews.received)
          setError(false)
        } else {
          console.error('No reviews received data found')
          dispatch(createNotification('获取评论失败', 'error'))
          setError(true)
        }
        setLoading(false)
      } catch (error) {
        setLoading(false)
        setError(true)
        console.error('Failed to fetch reviews received:', error)
        dispatch(createNotification('获取评论失败', 'error'))
      }
    }

    fetchReviewsReceived()
  }, [dispatch])

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
        <Typography variant="h6" sx={{ ml: 2, fontFamily: 'Noto Serif SC' }}>获取评论失败</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      {reviewsReceived.length > 0 ? (
        reviewsReceived.map(review => (
          <ReviewCard key={review.reviewId} review={review} />
        ))
      ) : (
        <Typography variant="body1" sx={{ fontFamily: 'Noto Serif SC' }}>没有收到的评论</Typography>
      )}
    </Box>
  )
}

export default ReviewsReceived
