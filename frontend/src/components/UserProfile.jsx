import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import userService from '../services/user'

const UserProfile = () => {
  const { id } = useParams()
  const [userInfo, setUserInfo] = useState(null)
  const [reviewsGiven, setReviewsGiven] = useState([])
  const [reviewsReceived, setReviewsReceived] = useState([])

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

  if (!userInfo) {
    return <div>加载中...</div>
  }

  return (
    <div>
      <h1>{userInfo.username}</h1>
      <h2>个人信息</h2>
      <p>用户ID: {userInfo.userId}</p>

      <h2>收到的评论</h2>
      <ul>
        {reviewsReceived.map(review => (
          <li key={review.reviewId}>
            <p>评分: {review.rating}</p>
            <p>{review.content}</p>
            <p>类型: {review.type}</p>
          </li>
        ))}
      </ul>

      <h2>发出的评论</h2>
      <ul>
        {reviewsGiven.map(review => (
          <li key={review.reviewId}>
            <p>评分: {review.rating}</p>
            <p>{review.content}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default UserProfile
