import { Grid2, Typography } from "@mui/material"
import ProductCard from "./ProductCard"
import { useLocation } from "react-router-dom";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
}

const ProductList = ({ products }) => {
  const query = useQuery();
  const search = query.get("search") || "";

  const filteredProducts = search === ''
  ? products
  :  products.filter(product =>
      product.name.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <Grid2 container spacing={2} sx={{ height: '100%' }}>
      {filteredProducts.length > 0 ? (
        filteredProducts.map(product => (
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