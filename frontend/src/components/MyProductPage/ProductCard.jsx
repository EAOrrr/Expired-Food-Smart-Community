import { Grid2 as Grid, Card, CardContent, Typography, CardActionArea, CardMedia, Dialog, DialogTitle, DialogContent, CardActions, Button } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import ProductForm from './ProductForm';
import productsService from '../../services/products';
import { useDispatch } from 'react-redux';
import { createNotification } from '../../reducers/notificationReducer';

// 商品卡片
/* TODO: 美化 */


const ProductCard = ({ product, onUpdate, onDelete }) => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch()
  

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEditProduct = async (formData) => {
    try {
      const updatedProduct = await productsService.update(product.productId, formData);
      setOpen(false);
      dispatch(createNotification('商品信息已更新', 'success'))
      onUpdate(updatedProduct)
    } catch (error) {
      console.error('Failed to update product:', error);
    }
  };

  const handleDeleteProduct = async () => {
    try {
      await productsService.remove(product.productId);
      dispatch(createNotification('商品已删除', 'success'))
      onDelete(product.productId)
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  }

  return (
    <Grid item="true" id={product.productId} size={{ xs: 12, md: 4 }}>
      <Card>
        <CardActionArea onClick={handleOpen}>
        <CardMedia
          component='img'
          image={product.Images.length > 0
            ? `/api/images/${product.Images.find(i => i.isCover).imageId}`
            : '/src/assets/default.jpg'
          }
          sx={{ height: 140, objectFit: 'contain' }}
          />
        <CardContent>
          <Typography variant='h5' component='div'>
            {product.name}
          </Typography>
          <Typography variant='subtitle' color='text.secondary'>
            {product.description}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            价格: ¥{product.price}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            有效期: {product.expiryDate ? new Date(product.expiryDate).toLocaleDateString() : '无'}
          </Typography>
        </CardContent>
        </CardActionArea>
        <CardActions>
          <Button onClick={handleDeleteProduct} color='error'>
            删除
          </Button>
        </CardActions>
      </Card>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>编辑商品</DialogTitle>
        <DialogContent>
          <ProductForm product={product} onSubmit={handleEditProduct} />
        </DialogContent>
      </Dialog>
    </Grid>
  );
};

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default ProductCard;