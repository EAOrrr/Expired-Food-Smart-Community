import { Grid, Card, CardContent, Typography, Button } from '@mui/material';
import PropTypes from 'prop-types';

const ProductCard = ({ product, addToCart }) => {
  console.log(product)
  return (
    <Grid item key={product.productId} xs={12} sm={6} md={4}>
      <Card>
        <CardContent>
          <Typography gutterBottom variant='h5' component='div'>
            {product.name}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
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
        <Button size='small' onClick={() => addToCart(product.productId)}>添加到购物车</Button>
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