import { Grid2 as Grid, Card, CardContent, Typography, Button, CardActionArea, CardMedia, CardActions } from '@mui/material';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, addToCart }) => {
  console.log(product)
  return (
    <Grid item id={product.productId}  size={{ xs: 12, md: 4 }}>
      <Card>
        <CardActionArea component={Link} to={`/products/${product.productId}`}>
        <CardMedia
          component='img'
          image={product.coverImageId
            ? `/api/images/${product.coverImageId}`
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
            库存: {product.stock}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            有效期: {product.expiryDate ? new Date(product.expiryDate).toLocaleDateString() : '无'}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            卖家名字: {product.Seller.username}
          </Typography>
        </CardContent>
        </CardActionArea>
        <CardActions>
        <Button size='small' onClick={() => addToCart(product.productId)}>添加到购物车</Button>
        </CardActions>
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