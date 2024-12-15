import React, { useEffect, useState } from 'react'
import userService from '../services/user'

const Profile = () => {
  const [userInfo, setUserInfo] = useState(null)
  const [reviewsGiven, setReviewsGiven] = useState([])
  const [reviewsReceived, setReviewsReceived] = useState([])

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
        console.log(givenData)
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

  if (!userInfo) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1>{userInfo.username}</h1>
      <h2>Personal Information</h2>
      <p>Phone: {userInfo.phone}</p>
      <p>Address: {userInfo.address}</p>

      <h2>Reviews Given</h2>
      <ul>
        {reviewsGiven.map(review => (
          <li key={review.reviewId}>
            <p>Rating: {review.rating}</p>
            <p>{review.content}</p>
          </li>
        ))}
      </ul>

      <h2>Reviews Received</h2>
      <ul>
        {reviewsReceived.map(review => (
          <li key={review.reviewId}>
            <p>Rating: {review.rating}</p>
            <p>{review.content}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Profile
