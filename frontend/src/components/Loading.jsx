import {
  Box,
  CircularProgress,
  Typography
} from '@mui/material'

const Loading = ({ message }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CircularProgress />
      <Typography variant="h6">{message}</Typography>
    </Box>
  )
}

export default Loading