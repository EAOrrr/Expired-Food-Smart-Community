import { Grid2, Typography } from "@mui/material"
import ProductCard from "./ProductCard"

const ProductList = ({ products }) => {
  return (
    <Grid2 container spacing={2} sx={{ height: '100%' }}>
      {products.length > 0 ? (
        products.map(product => (
          <ProductCard key={product.productId} product={product} />
        ))
      ) : (
        <Typography variant='body2' color='text.secondary'>
          暂无商品
        </Typography>
      )}
    </Grid2>
  )
}

export default ProductList