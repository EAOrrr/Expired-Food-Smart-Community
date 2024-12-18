const router = require('express').Router();
const { userExtractor, userExtractorAllowingNull } = require('../utils/middleware');
const { Product, Image, User, Cart, Message } = require('../models');
const multer = require('multer');
const upload = multer();

router.get('/', userExtractorAllowingNull, async (req, res) => {
  const { userId, status } = req.query;
  // if (req.user && (!req.user.isAdmin && status !== 'active')) {
  //   return res.status(403).json({ error: 'no permission' });
  // }

  if (status && status !== 'active' && status !== 'pending' && status !== 'fail') {
    return res.status(400).json({ error: 'invalid status' });
  }

  const products = await Product.findAll({
    include: [{
      model: User,
      as: 'Seller',
      attributes: ['username', 'phone', 'address']
    },
    {
      model: Image,
      as: 'Images',
      attributes: ['imageId', 'isCover'],
      required: false
    }],
    attributes: {
      exclude: ['sellerId']
    },
    where: [
      status ? { status } : {},
      userId ? { sellerId: userId } : {}
    ]
  });
  res.json(products);
})

router.post('/', userExtractor, upload.fields([
  { name: 'cover', maxCount: 1 },
  { name: 'images', maxCount: 5 }
]), async (req, res) => {
  const { files, body } = req;

  delete body.status

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

  const createdProduct = await Product.findByPk(product.productId, {
    include: [
      {
        model: Image,
        as: 'Images',
        attributes: ['imageId', 'isCover']
      }
    ]
  });

  res.status(201).json(createdProduct);
})

router.get('/:id', userExtractor, async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByPk(id, {
    include: [
      { model: Image, as: 'Images', attributes: ['imageId', 'isCover'] },
      { model: Cart, as: 'Carts',  where: { userId: req.user.userId }, required: false },
    { model: User, as: 'Seller', attributes: ['username', 'userId'] }
    ]
  });
  if (!product) {
    return res.status(404).end();
  }
  
  res.json(product);
})


router.put('/:id', userExtractor, upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'images', maxCount: 8 }]), async (req, res) => {
  const { id } = req.params;
  const { name, price, description, stock, expiryDate, deletedImages, status } = req.body;
  const files = req.files;

  const product = await Product.findByPk(id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  if (product.sellerId !== req.user.userId) {
    return res.status(403).json({ error: 'no permission' });
  }

  // 更新产品信息
  product.name = name || product.name;
  product.price = price || product.price;
  product.description = description || product.description;
  product.stock = stock || product.stock;
  product.expiryDate = expiryDate || product.expiryDate;
  product.status = 'pending';
  await product.save();

  // 删除指定的图片
  if (Array.isArray(deletedImages) && deletedImages.length > 0) {
    await Image.destroy({ where: { imageId: deletedImages, productId: id } });
  }

  const existingImagesCount = await Image.count({ where: { productId: id } });
  
  if (!files) {
    return res.json(product);
  }

  // 更新封面图片
  if (files.cover) {
    const coverFile = files.cover[0];
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

  // res.json(product);
  const updatedProduct = await Product.findByPk(id, {
      include: [
        {
          model: Image,
          as: 'Images',
          attributes: ['imageId', 'isCover']
        }
      ]
    });

    res.json(updatedProduct);
});

router.put('/:id/status', userExtractor, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'no permission' });
  }
  const { id } = req.params;
  const { status } = req.body;
  const product = await Product.findByPk(id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  product.status = status || product.status;
  if (status !== 'active' && status !== 'fail') {
    return res.status(400).json({ error: 'invalid status' });
  }
  await product.save();
  const content = status === 'active'
    ? `你的商品 ${product.name} 通过审核，已上架`
    : `你的商品 ${product.name} 未通过审核，请重新编辑`;
  await Message.create({
    senderId: req.user.userId,
    receiverId: product.sellerId,
    content: content,
  })
  return res.json(product);

})


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
