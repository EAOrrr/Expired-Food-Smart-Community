import React, { useEffect, useState } from 'react'
import { Box, Typography, CircularProgress } from '@mui/material'
import userService from '../../services/user'
import ReviewCard from './ReviewCard'
import { useDispatch } from 'react-redux'
import { createNotification } from '../../reducers/notificationReducer'
import ErrorIcon from '@mui/icons-material/Error'

const ReviewsGiven = () => {
  const dispatch = useDispatch()
  const [reviewsGiven, setReviewsGiven] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchReviewsGiven = async () => {
      try {
        setLoading(true)
        const givenData = await userService.getInfo({ review: 'given' })
        if (givenData.reviews && givenData.reviews.given) {
          setReviewsGiven(givenData.reviews.given)
          setError(false)
        } else {
          console.error('No reviews given data found')
          dispatch(createNotification('获取评论失败', 'error'))
          setError(true)
        }

        setLoading(false)

      } catch (error) {
        setLoading(false)
        setError(true)
        console.error('Failed to fetch reviews given:', error)
        dispatch(createNotification('获取评论失败', 'error'))
      }
    }

    fetchReviewsGiven()
  }, [dispatch])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '75vh' }}>
        <CircularProgress size={60} />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '75vh'}}>
        <ErrorIcon sx={{ fontSize: 60 , color: 'red' }} />
        <Typography variant="h6" sx={{ ml: 2, fontFamily: 'Noto Serif SC' }}>获取评论失败</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      {reviewsGiven.length > 0 ? (
        reviewsGiven.map(review => (
          <ReviewCard key={review.reviewId} review={review} />
        ))
      ) : (
        <Typography variant="body1" sx={{ fontFamily: 'Noto Serif SC' }}>没有给出的评论</Typography>
      )}
    </Box>
  )
}

export default ReviewsGiven
