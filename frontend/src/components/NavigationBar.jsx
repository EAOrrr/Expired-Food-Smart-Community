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
  Menu,
  TextField,
  InputAdornment,
  alpha,
  useTheme
} from '@mui/material'
import { deepPurple } from '@mui/material/colors';
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../reducers/userReducer'
import { useState } from 'react';
import PropTypes from 'prop-types';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';

const pages = [
  { label: '首页', href: '/' },
]

const adminPage = [
  { label: '管理商品', href: '/admin' },
  { label: '发布信息', href: '/admin/publish' },
]

const settings = [
  { label: '个人信息', href: '/profile' },
  { label: '查看余额', href: '/bills' },
  { label: '我的购物车', href: '/carts' },
  { label: '我的销售订单', href: '/sell-orders' },
  { label: '我的购买订单', href: '/buy-orders' },
  { label: '我的商品', href: '/my-products' },
  { label: '我的消息', href: '/messages' },
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
      <Tooltip title="消息">
        <IconButton component={Link} to='/messages' sx={{ color: 'white' }}>
          <NotificationsIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="购物车">
        <IconButton component={Link} to='/carts' sx={{ color: 'white' }}>
          <ShoppingCartIcon />
        </IconButton>
      </Tooltip>
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
  const theme = useTheme()
  const [search, setSearch] = useState('')

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      window.location.href = `/?search=${search}`;
    }
  };

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
            {user.info && user.info.isAdmin && adminPage.map(page => (
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
          <TextField
            id="input-with-icon-textfield"
            placeholder='输入商品的关键词'
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton component={Link} to={`/?search=${search}`}>
                      <SearchIcon sx={{ color: 'white' }} /> {/* Set icon color to white */}
                    </IconButton>
                  </InputAdornment>
                ),
                style: { color: 'white' } // Set text color to white
              },
            }}
            variant="standard"
            sx={{
              backgroundColor: alpha(theme.palette.common.white, 0.15),
              '&:hover': {
                backgroundColor: alpha(theme.palette.common.white, 0.25),
              },
              mr: 2
            }}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            type='search'
            onKeyPress={handleKeyPress}
          />
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