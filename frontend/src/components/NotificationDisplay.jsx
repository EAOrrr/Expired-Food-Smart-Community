import { TextField, Select, MenuItem, Container } from "@mui/material";
import { useField } from "../hooks";
import { createNotification } from "../reducers/notificationReducer";
import { useDispatch } from "react-redux";
import { useState } from "react";

const NotificationDisplay = () => {
  const notification = useField('notification')
  const [severity, setSeverity] = useState('success')
  // useDispatch hook
  const dispatch = useDispatch()

  const handleClick = () => {
    console.log(notification)
    // 发布通知
    dispatch(createNotification(notification.value, severity))
  }

  return (
    <Container>
      <TextField {...notification} />
      <Select
        value={severity}
        onChange={(e) => setSeverity(e.target.value)}
      >
        <MenuItem value="success">Success</MenuItem>
        <MenuItem value="error">Error</MenuItem>
        <MenuItem value="warning">Warning</MenuItem>
      </Select>
      <button onClick={handleClick}>设置通知</button>
    </Container>
  )
}

export default NotificationDisplay;

