import { useEffect, useState } from "react";
import productsService from "../../services/products";
import { useSelector } from "react-redux";
import { Grid2, Typography, Button, Dialog, DialogTitle, DialogContent, Box, CircularProgress } from "@mui/material";
import ProductCard from "./ProductCard";
import ProductForm from "./ProductForm";
import ErrorIcon from '@mui/icons-material/Error';

const MyProductPage = () => {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const user = useSelector(state => state.user.info);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const products = await productsService.getAll({
          userId: user.userId
        });
        setProducts(products);
        setError(false);
      } catch (error) {
        console.error('Failed to fetch my products:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [user]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreateProduct = async (formData) => {
    try {
      const newProduct = await productsService.create(formData);
      setOpen(false);
      setProducts(products.concat(newProduct));
    } catch (error) {
      console.error('Failed to create product:', error);
    }
  };

  const handleUpdateProduct = (updatedProduct) => {
    setProducts(products.map(product =>
      product.productId === updatedProduct.productId ? updatedProduct : product
    ))
  }

  const handleDeleteProduct = async (productId) => {
    setProducts(products.filter(product => product.productId !== productId));
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'center' }}>
        <CircularProgress size={60} />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'center'}}>
        <ErrorIcon sx={{ fontSize: 60 , color: 'red' }} />
        <Typography variant="h6" sx={{ ml: 2, fontFamily: 'Noto Serif SC' }}>获取商品失败</Typography>
      </Box>
    )
  }

  return (
    <div style={{ fontFamily: 'Noto Serif SC' }}>
      <h1>我的商品</h1>
      <Button variant="contained" onClick={handleOpen}>创建商品</Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>创建商品</DialogTitle>
        <DialogContent>
          <ProductForm onSubmit={handleCreateProduct} />
        </DialogContent>
      </Dialog>
      <Grid2 container spacing={2}>
          {products.length > 0 ? (
            products.map(product => (
              <ProductCard 
                key={product.productId} 
                product={product} 
                onUpdate={handleUpdateProduct} 
                onDelete={handleDeleteProduct}
              />
            ))
          ) : (
            <Typography variant='body2' color='text.secondary'>
              暂无商品
            </Typography>
          )}
        </Grid2>
    </div>
  );
}

export default MyProductPage;