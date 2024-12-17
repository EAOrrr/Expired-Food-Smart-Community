import React, { useState } from 'react'
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, CircularProgress } from '@mui/material'
import { useField } from '../../hooks'
import { useDispatch, useSelector } from 'react-redux'
import PasswordTextField from '../PasswordTextField'
import { createNotification } from '../../reducers/notificationReducer'
import { updateUser } from '../../reducers/userReducer'
import userService from '../../services/user'
import { green } from '@mui/material/colors'

const EditProfileDialog = ({ open, handleClose }) => {
  const dispatch = useDispatch()
  const userInfo = useSelector(state => state.user.info)
  const username = useField('用户名', 'text', userInfo.username)
  const phone = useField('电话号码', 'text', userInfo.phone)
  const address = useField('住址', 'text', userInfo.address)
  
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [loading, setLoading] = useState(false)

  const handleUpdateProfile = async () => {
    if (password !== passwordConfirm) {
      console.error('两次密码输入不一致')
      dispatch(createNotification('两次密码输入不一致', 'error'))
      return
    }
    if (password.length < 6) {
      console.error('密码长度至少为6位')
      dispatch(createNotification('密码长度至少为6位', 'error'))
      return
    }

    try {
      setLoading(true)
      const updatedUser = await userService.update({ username: username.value, phone: phone.value, address: address.value, password })
      // setLoading(false)
      // dispatch(createNotification('个人信息更新成功', 'success'))
      // dispatch(updateUser(updatedUser))
      // setPassword('')
      // setPasswordConfirm('')
      // handleClose()
      setTimeout(() => {
        setLoading(false)
        dispatch(createNotification('个人信息更新成功', 'success'))
        dispatch(updateUser(updatedUser))
        setPassword('')
        setPasswordConfirm('')
        handleClose()
      }, 2000)
    } catch (error) {
      setLoading(false)
      dispatch(createNotification('个人信息更新失败', 'error'))
      setPassword('')
      setPasswordConfirm('')
      console.error('Failed to update user info:', error)
    }
  }


  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>修改个人信息</DialogTitle>
      <DialogContent>
        <TextField {...username} fullWidth margin="normal" />
        <TextField {...phone} fullWidth margin="normal" />
        <TextField {...address} fullWidth margin="normal" />
        <PasswordTextField label="密码" value={password} onChange={setPassword}  />
        <PasswordTextField label="确认密码" value={passwordConfirm} onChange={setPasswordConfirm} />
        {loading && (
          <CircularProgress
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: '-12px',
              marginLeft: '-12px',
            }}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} sx={{ fontFamily: 'Noto Serif SC' }} disabled={loading}>取消</Button>
        <Button onClick={handleUpdateProfile} sx={{ fontFamily: 'Noto Serif SC' }} disabled={loading}>保存</Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditProfileDialog
