import { Alert } from '@mui/material'
import { useSelector } from 'react-redux'
import NavigateBar from './NavigationBar'

const Header = () => {
  const notification = useSelector(state => state.notification)
  return (
    <div>
      <NavigateBar />
      {notification.message
        ? <Alert severity={notification.type}>{notification.message}</Alert>
        : null
      }

    </div>
  )
}

export default Header