import React, { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import userService from '../../services/user'
import ReviewCard from './ReviewCard'

const ReviewsGiven = () => {
  const [reviewsGiven, setReviewsGiven] = useState([])

  useEffect(() => {
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

    fetchReviewsGiven()
  }, [])

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
