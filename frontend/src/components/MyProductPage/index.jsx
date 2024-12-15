import { useEffect, useState } from "react";
import productsService from "../../services/products";
import { useSelector } from "react-redux";
import { Grid2, Typography, Button, Dialog, DialogTitle, DialogContent } from "@mui/material";
import ProductCard from "./ProductCard";
import ProductForm from "./ProductForm";

const MyProductPage = () => {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const user = useSelector(state => state.user.info);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await productsService.getAll({
          userId: user.userId
        });
        setProducts(products);
      } catch (error) {
        console.error('Failed to fetch my products:', error);
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
      // Refresh products list
      // const products = await productsService.getAll({ userId: user.userId });
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

  return (
    <div>
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
              <ProductCard key={product.productId} product={product} onUpdate={handleUpdateProduct} />
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