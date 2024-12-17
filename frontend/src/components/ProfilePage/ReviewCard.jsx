import React from 'react'
import { Card, CardContent, Typography, Avatar, Box, Rating } from '@mui/material'

const ReviewCard = ({ review }) => {
  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : ''
  }

  return (
    <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: 3, fontFamily: 'Noto Serif SC', marginBottom: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ marginRight: 2 }}>{getInitials(review.Reviewer.username)}</Avatar>
            <Box>
              <Typography variant="body1" sx={{ fontFamily: 'Noto Serif SC' }}>{review.Reviewer.username}</Typography>
              <Typography variant="body2" color="textSecondary" sx={{ fontFamily: 'Noto Serif SC' }}>{new Date(review.createdAt).toLocaleDateString()}</Typography>
            </Box>
          </Box>
          <Rating value={review.rating} readOnly />
        </Box>
        <Typography variant="body1" sx={{ fontFamily: 'Noto Serif SC' }}>{review.content}</Typography>
      </CardContent>
    </Card>
  )
}

export default ReviewCard
