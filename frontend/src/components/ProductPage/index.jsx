import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import productsService from "../../services/products";

/*
TODO:
1. 卖家信息 + 跳转卖家个人信息页面
2. 增减商品数量，选择 加入购物车 or 直接购买
3. 拓展：排版
*/

const ProductPage = () => {
  const id = useParams().id;
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await productsService.getOne(id);
        setProduct(product);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      }
    }
    fetchProduct();
  }, [id]);
  console.log(product)
  return (
    <div>
      <h1>Product Page</h1>
      {product ? (
        <div>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p>价格: ¥{product.price}</p>
          <p>库存: {product.stock}</p>
          <p>有效期: {product.expiryDate ? new Date(product.expiryDate).toLocaleDateString() : '无'}</p>
          <p>卖家ID: {product.sellerId}</p>
          {product.Images.map((image, index) => {
            return (
            <img src={`/api/images/${image.imageId}`} key={image.ImageId}/>
            )
          })}
        </div>
      ) : (
        <p>商品不存在</p>
      )}
    </div>
  );
}

export default ProductPage;