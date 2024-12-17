import React, { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import userService from '../../services/user'
import ReviewCard from './ReviewCard'

const ReviewsReceived = () => {
  const [reviewsReceived, setReviewsReceived] = useState([])

  useEffect(() => {
    const fetchReviewsReceived = async () => {
      try {
        const receivedData = await userService.getInfo({ review: 'received' })
        if (receivedData.reviews && receivedData.reviews.received) {
          setReviewsReceived(receivedData.reviews.received)
        } else {
          console.error('No reviews received data found')
        }
      } catch (error) {
        console.error('Failed to fetch reviews received:', error)
      }
    }

    fetchReviewsReceived()
  }, [])

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
