import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'

import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { 
  Alert,
} from '@mui/material'

import { useField } from '../hooks'
import { createNotification } from '../reducers/notificationReducer'

import userService from '../services/user'
import PasswordTextField from './PasswordTextField'


const SignUp = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const user = useSelector(state => state.user)
  if (user.info && !user.loading) {
    navigate('/')
  }

  const notification = useSelector(state => state.notification)
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [signUpLoading, setSignUpLoading] = useState(false)

  const username = useField('用户名')
  const address = useField('地址')
  const phone = useField('电话')



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
      setSignUpLoading(true)
      await userService.create(userInfo)
      dispatch(createNotification('注册成功', 'success'))
      setSignUpLoading(false)
      navigate('/login')
    }
    catch (exception) {
      if (exception.isAxiosError) {
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
              <TextField {...username} fullWidth required margin='none' size='small' />
              <PasswordTextField label='密码' value={password} onChange={setPassword} />
              <PasswordTextField label='确认密码' value={passwordConfirm} onChange={setPasswordConfirm} />
              <TextField {...address} fullWidth required margin='dense' size='small'/>
              <TextField {...phone} fullWidth required margin='dense' size='small'/>
              <Button type='submit' variant="contained" fullWidth sx={{ mt: 2, mb: 2 }} disabled={signUpLoading}>
                <Typography variant='button' fontFamily='Noto Serif SC'>注册新账号</Typography>
              </Button>
              <Typography 
                variant='body2' 
                fontFamily='Noto Serif SC'
                component={Link}
                to='/login'
                sx={{ 
                  display: 'block', 
                  textAlign: 'center', 
                  color: 'gray', 
                  textDecoration: 'none',
                }}
              >
              返回登陆页面
              </Typography>
          </Box>
        </Box>
      </Container>
    </div>
  )
}

export default SignUp