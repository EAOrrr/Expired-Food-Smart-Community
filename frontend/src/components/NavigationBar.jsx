import {
  Box,
  IconButton,
  Typography,
  Button,
  AppBar,
  Container,
  Toolbar,
  Avatar,
  Tooltip,
  MenuItem,
  Menu
} from '@mui/material'
import { deepPurple } from '@mui/material/colors';
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../reducers/userReducer'
import { useState } from 'react';
import PropTypes from 'prop-types';

const pages = [
  // { label: '首页', href: '/' },
  { label: '商品查看', href: '/shopping' },
  { label: '我的购物车', href: '/carts' },
  { label: '我的订单', href: '/orders' },
  { label: '其他功能', href: '/other' }
]
const settings = [
  { label: '个人信息', href: '/profile' },
  { label: '查看余额', href: '/bills' },
  { label: '设置', href: '/settings' }
]

const UserInfo = ({ user }) => {
  const dispatch = useDispatch()
  const [anchorElUser, setAnchorElUser] = useState(null);
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  }; 
  if (!user) return null
  return (
    <Box sx={{ display: 'flex', flexGrow: 0 }}>
      <Tooltip title="个人信息">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar sx={{ bgcolor: deepPurple[500] }}>
            {user.username[0]}
          </Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: '45px' }}
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        {settings.map((setting) => (
          <MenuItem
            component={Link}
            key={setting.label}
            onClick={handleCloseUserMenu}
            to={setting.href}
          >
            <Typography sx={{ textAlign: 'center' }}>{setting.label}</Typography>
          </MenuItem>
        ))}
        <MenuItem
          onClick={() => {
            dispatch(logout())
            handleCloseUserMenu()
          }}
        >
          <Typography sx={{ textAlign: 'center' }}>退出登录</Typography>
        </MenuItem>
      </Menu>
    </Box>
  )
}

UserInfo.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired
  })
}

const LoginButton = () => (
  <Button component={Link} to='/login' sx={{ color: 'white' }}>
    登录
  </Button>
)

const NavigationBar = () => {
  const user = useSelector(state => state.user)

  return (
    <AppBar position='static'>
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          <Box sx={{
            display: 'flex', 
            flexGrow: 1
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
          <Box sx={{ flexGrow: 0 }} />
          {user.info
            ? <UserInfo user={user.info}/>
            : <LoginButton />}
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default NavigationBar