import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'

import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Alert,
  IconButton } from '@mui/material'

import { useField } from '../hooks'
import { createNotification } from '../reducers/notificationReducer'

import userService from '../services/user'


const SignUp = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const user = useSelector(state => state.user)
  if (user.info && !user.loading) {
    navigate('/posts')
  }

  const notification = useSelector(state => state.notification)
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const username = useField('用户名')
  const address = useField('地址')
  const phone = useField('电话')

  const handleClickShowPassword = () => setShowPassword((show) => !show)
  const handleClickShowPasswordConfirm = () => setShowPasswordConfirm((show) => !show)

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  const handlePasswordConfirmChange = (event) => {
    setPasswordConfirm(event.target.value)
  }

  const handleMouseDownPassword = (event) => {
    event.preventDefault()
  }

  const handleSignUp = async (event) => {
    event.preventDefault()
    if (password !== passwordConfirm) {
      dispatch(createNotification('两次密码输入不一致', 'error'))
      return
    }
    if (password.length < 6) {
      dispatch(createNotification('密码长度至少为6位', 'error'))
      return
    }
    if (!/^\d+$/.test(phone.value)) {
      dispatch(createNotification('电话号码只能为数字', 'error'))
      return
    }
    try {
      const userInfo = {
        username: username.value,
        password,
        address: address.value,
        phone: phone.value
      }
      await userService.create(userInfo)
      dispatch(createNotification('注册成功', 'success'))
      navigate('/login')
    }
    catch (exception) {
      console.log(exception)
      if (exception.isAxiosError) {
        console.log('Axios error')
        console.log(exception.response.data.error)
        dispatch(createNotification(exception.response.data.error, 'error'))
      }
      else {
        dispatch(createNotification('注册失败', 'error'))
      }
    }
  }

  return (
    <div>
      <Container maxWidth='xs' component='main'>
        <CssBaseline />
        <Box sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          {notification.message &&
           <Alert
             severity={notification.type}
             sx={{ width: 300, position:'absolute' }}
           >
             {notification.message}
           </Alert>
          }

        </Box>
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* <h2>十五分钟生活圈临期食品智慧社区</h2> */}
          <Typography component='h1' variant='h4' fontFamily='Noto Serif SC' sx={{textAlign: 'center', mb:2}}>
          <strong>十五分钟生活圈临期食品智慧社区</strong>
          </Typography>
          <Typography component='h1' variant='h5' fontFamily='Noto Serif SC'>
          注册账号
          </Typography>
          <Box component='form' onSubmit={handleSignUp} sx={{ mt: 1 }} width={250}>
            <div>
              <TextField {...username} fullWidth required margin='none' size='small' />
            </div>
            <div>
              <FormControl margin='dense' variant="outlined" fullWidth size='small'>
                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  value={password}
                  onChange={handlePasswordChange}
                  type={showPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>
              <FormControl margin='dense' variant="outlined" fullWidth size='small'>
                <InputLabel htmlFor="outlined-adornment-password-confirm">确认密码</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password-confirm"
                  value={passwordConfirm}
                  onChange={handlePasswordConfirmChange}
                  type={showPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPasswordConfirm}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPasswordConfirm ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>
              <TextField {...address} fullWidth required margin='dense' size='small'/>
              <TextField {...phone} fullWidth required margin='dense' size='small'/>
              {/* <TextField {...password} fullWidth required margin='dense'/> */}
            </div>
            <div>
              <Button type='submit' variant="contained" fullWidth sx={{ mt: 2, mb: 2 }}>
                <Typography variant='button' fontFamily='Noto Serif SC'>注册新账号</Typography>
              </Button>
            </div>
              
            
          </Box>
        </Box>
      </Container>
    </div>
  )
}

export default SignUp