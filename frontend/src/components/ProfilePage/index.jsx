import React, { useEffect, useState } from 'react'
import { Tabs, Tab, Box, Typography } from '@mui/material'
import userService from '../../services/user'
import UserInfo from './UserInfo'
import ReviewsGiven from './ReviewsGiven'
import ReviewsReceived from './ReviewsReceived'

const Profile = () => {
  const [userInfo, setUserInfo] = useState(null)
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

    fetchUserInfo()
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
      {tabIndex === 0 && <UserInfo userInfo={userInfo} />}
      {tabIndex === 1 && <ReviewsGiven />}
      {tabIndex === 2 && <ReviewsReceived />}
    </Box>
  )
}

export default Profile
