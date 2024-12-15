import { Box, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import PropTypes from 'prop-types'

const Picture = ({ imageUrl, handleDelete }) => {
  const onDelete = () => {
    handleDelete()
  }

  return (
    <Box  sx={{
      width: 200, // 设置图片容器的宽度
      height: 100, // 设置图片容器的高度
      overflow: 'hidden', // 隐藏超出的部分
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    }}>
      <img
        src={imageUrl}
        alt='cover'
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'cover', // 适应容器，保持裁剪比例
        }} />
      <IconButton
        sx={{
          position: 'absolute',
          top: 8, // 距离顶部 8px
          right: 8, // 距离右侧 8px
          color: 'primary', // 设置图标颜色为白色（可以根据需要调整）
          backgroundColor: 'rgba(0, 0, 0, 0)', // 半透明的背景色，增强对比度
          '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.3)', // 鼠标悬停时，背景色变得更加明显
          },
        }}
        onClick={onDelete} // 点击时触发删除封面的函数}
      >
        <CloseIcon /> {/* X 图标 */}
      </IconButton>
    </Box>
  )
}
Picture.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  handleDelete: PropTypes.func.isRequired,
}

export default Picture