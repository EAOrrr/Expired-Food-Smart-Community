const router = require('express').Router();
const { userExtractor } = require('../utils/middleware');
const { Product } = require('../models');

router.get('/', async (req, res) => {
  const products = await Product.findAll();
  res.json(products);
})

router.post('/', userExtractor, async (req, res) => {
  // console.log(req.user.id)
  const product = await Product.create({
    ...req.body,
    sellerId: req.user.userId
  });
  res.status(201).json(product);
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
