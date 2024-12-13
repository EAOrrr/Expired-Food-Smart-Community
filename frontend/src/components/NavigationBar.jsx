import {
  Box,
  IconButton,
  Typography,
  Button,
  Badge,
  AppBar,
  Container,
  Toolbar,
  Avatar

} from '@mui/material'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../reducers/userReducer'

const pages = [
  // { label: '首页', href: '/' },
  { label: '商品查看', href: '/shopping' },
  { label: '我的购物车', href: '/cart' },
  { label: '我的订单', href: '/orders' },
  { label: '其他功能', href: '/other' }
]


const NavigationBarLargeScreen = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)

  const UserInfo = () => (
    <Box sx={{display: 'flex'}}>
      <Box sx={{mr: 1, flexDirection: 'row'}}>
        <Link to='/profile' style={{ textDecoration: 'none' }}>
            <Avatar>H</Avatar>
        </Link>
      </Box>
      <Button onClick={() => dispatch(logout())}>
        <Typography variant='inherit' textAlign='center' color='white'>退出登录</Typography>
      </Button>
    </Box>
  )

  const LoginButton = () => (
    <Button component={Link} to='/login' sx={{ color: 'white' }}>
      登录
    </Button>
  )
  
  return (
    <AppBar position='static'>
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          <Box sx={{
            display: 'flex' 
          }}>
            {pages.map(page => (
              <Button
                key={page.label}
                component={Link}
                to={page.href}
                sx={{ mx: 1, color: 'white', display: 'block' }}
              >
                {page.label}
              </Button>
            ))}
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{
            display: 'flex' 
          }}>
            {user.info
            ? <UserInfo />
            : <LoginButton />}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default NavigationBarLargeScreen