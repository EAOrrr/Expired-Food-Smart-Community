import { Grid2 as Grid, Card, CardContent, Typography, Button, CardActionArea, CardMedia, CardActions } from '@mui/material';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// 商品卡片
/* TODO: 美化 */


const ProductCard = ({ product }) => {
  return (
    <Grid item id={product.productId}  size={{ xs: 12, md: 4 }}>
      <Card sx={{ height: '100%' }}>
        <CardActionArea component={Link} to={`/products/${product.productId}`}>
        <CardMedia
          component='img'
          image={product.Images.length > 0
            ? `/api/images/${product.Images[0].imageId}`
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
      </Card>
    </Grid>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    productId: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    price: PropTypes.number.isRequired,
    stock: PropTypes.number.isRequired,
    expiryDate: PropTypes.string,
    sellerId: PropTypes.string.isRequired,
  }).isRequired,
  addToCart: PropTypes.func.isRequired,
};

export default ProductCard;