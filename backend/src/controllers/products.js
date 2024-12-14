const router = require('express').Router();
const { userExtractor } = require('../utils/middleware');
const { Product, Image, User } = require('../models');
const multer = require('multer');
const upload = multer();

router.get('/', async (req, res) => {
  const products = await Product.findAll({
    include: {
      model: User,
      as: 'Seller',
      attributes: ['username', 'phone', 'address']
    },
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
      // for (const imageFile of files.images) {
      //   await Image.create({
      //     data: imageFile.buffer,
      //     mimeType: imageFile.mimetype,
      //     productId: product.productId
      //   });
      // }
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

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByPk(id, {
    include: [
      { model: Image, as: 'Images', attributes: ['imageId'] },
    ]
  });
  if (!product) {
    return res.status(404).end();
  }
  res.json(product);
})

router.put('/:id', userExtractor, async (req, res) => {
  const { body, params } = req;
  const product = await Product.findByPk(params.id);
  if (!product) {
    return res.status(404).end();
  }
  if (product.sellerId !== req.user.userId) {
    return res.status(403).json({ error: 'no permission' });
  }
  await product.update(body);
  res.json(product);
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
