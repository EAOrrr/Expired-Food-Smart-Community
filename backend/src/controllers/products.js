const router = require('express').Router();
const { userExtractor } = require('../utils/middleware');
const { Product, Image, User, Cart } = require('../models');
const multer = require('multer');
const upload = multer();

router.get('/', async (req, res) => {
  const products = await Product.findAll({
    include: [{
      model: User,
      as: 'Seller',
      attributes: ['username', 'phone', 'address']
    },
    {
      model: Image,
      as: 'Images',
      attributes: ['imageId'],
      where: { isCover: true },
      required: false
    }],
    attributes: {
      exclude: ['sellerId']
    }
  });
  res.json(products);
})

router.post('/', userExtractor, upload.fields([
  { name: 'cover', maxCount: 1 },
  { name: 'images', maxCount: 5 }
]), async (req, res) => {
  const { files, body } = req;

  const product = await Product.create({
    ...body,
    sellerId: req.user.userId
  });

  if (files) {
    if (files.cover) {
      const coverFile = files.cover[0];
      await Image.create({
        data: coverFile.buffer,
        mimeType: coverFile.mimetype,
        productId: product.productId,
        isCover: true
      });
    }

    if (files.images) {
      const images = files.images.map(imageFile => ({
        data: imageFile.buffer,
        mimeType: imageFile.mimetype,
        productId: product.productId
      }));
      await Image.bulkCreate(images);
    }
  }

  res.status(201).json(product);
})

router.get('/:id', userExtractor, async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByPk(id, {
    include: [
      { model: Image, as: 'Images', attributes: ['imageId'] },
      { model: Cart, as: 'Carts',  where: { userId: req.user.userId }, required: false }
    ]
  });
  if (!product) {
    return res.status(404).end();
  }
  
  res.json(product);
})

// router.put('/:id', userExtractor, async (req, res) => {
//   const { body, params } = req;
//   const product = await Product.findByPk(params.id);
//   if (!product) {
//     return res.status(404).end();
//   }
//   if (product.sellerId !== req.user.userId) {
//     return res.status(403).json({ error: 'no permission' });
//   }
//   await product.update(body);
//   res.json(product);
// })


router.put('/:id', userExtractor, upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'images', maxCount: 8 }]), async (req, res) => {
  const { id } = req.params;
  const { name, price, description, stock, expiryDate } = req.body;
  const files = req.files;

  const product = await Product.findByPk(id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  // 更新产品信息
  product.name = name || product.name;
  product.price = price || product.price;
  product.description = description || product.description;
  product.stock = stock || product.stock;
  product.expiryDate = expiryDate || product.expiryDate;
  await product.save();

  const existingImagesCount = await Image.count({ where: { productId: id } });

  // 更新封面图片
  if (files.cover) {
    const existingCover = await Image.findOne({ where: { productId: id, isCover: true } });
    if (existingCover) {
      existingCover.data = coverFile.buffer;
      existingCover.mimeType = coverFile.mimetype;
      await existingCover.save();
    } else {
      await Image.create({
        data: coverFile.buffer,
        mimeType: coverFile.mimetype,
        productId: product.productId,
        isCover: true
      });
    }
  }

  // 更新其他图片
  if (files.images) {
    const newImagesCount = files.images.length;
    if (existingImagesCount + newImagesCount > 8) {
      return res.status(400).json({ error: 'too many images' });
    }
    const images = files.images.map(imageFile => ({
      data: imageFile.buffer,
      mimeType: imageFile.mimetype,
      productId: product.productId,
      isCover: false
    }));
    await Image.bulkCreate(images);
  }

  res.json(product);
});


router.delete('/:id', userExtractor, async (req, res) => {
  const { params } = req;
  const product = await Product.findByPk(params.id);
  if (!product) {
    return res.status(404).end();
  }
  if (product.sellerId !== req.user.userId) {
    return res.status(403).json({ error: 'no permission' });
  }
  await product.destroy();
  res.status(204).end();
})

module.exports = router;
