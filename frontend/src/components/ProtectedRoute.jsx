import { CircularProgress, Typography, Box, Container } from '@mui/material'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import Header from './Header'
import Loading from './Loading'

const ProtectedRoute = ({ children }) => {
  const user = useSelector(state => state.user)
  if (user.loading) {
    return <Loading message='检查登录状态' />
  }
  if (!user.loading && !user.info) {
    return <Navigate to='/login' />
  }

  return (
    <div>
      <Header />
      <Container>
        {children}
      </Container>
    </div>
  )
}

export default ProtectedRoute