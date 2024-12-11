const router = require('express').Router();
const { userExtractor } = require('../utils/middleware');
const { Cart, Product, User } = require('../models');

router.get('/me', userExtractor, async (req, res) => {
  const user = req.user
  const products = await user.getCartProducts()
  res.json(products)
})

router.post('/:id', userExtractor, async (req, res) => {
  const user = req.user
  const productId = req.params.id
  const { quantity } = req.body
  const product = await Product.findByPk(productId)
  if (!product) {
    return res.status(404).json({ error: 'product not found' })
  }
  const cart = await Cart.findOne({
    where: {
      userId: user.userId,
      productId: productId
    }
  })
  if (cart) {
    return res.status(400).json({ error: 'product already in cart' })
  }
  const newCart = await Cart.create({
    userId: user.userId,
    productId: productId,
    quantity: quantity
  })
  res.status(201).json(newCart)
})

router.put('/:id', userExtractor, async (req, res) => {
  const user = req.user
  const productId = req.params.id
  const { quantity } = req.body
  if (!quantity || quantity < 1) {
    return res.status(400).json({ error: 'quantity must be at least 1' })
  }
  const cart = await Cart.findOne({
    where: {
      userId: user.userId,
      productId: productId
    }
  })
  if (!cart) {
    return res.status(404).json({ error: 'product not found in cart' })
  }
  cart.quantity = quantity
  await cart.save()
  res.json(cart)
})

router.delete('/:id', userExtractor, async (req, res) => {
  const user = req.user
  const productId = req.params.id
  const cart = await Cart.findOne({
    where: {
      userId: user.userId,
      productId: productId
    }
  })
  if (!cart) {
    return res.status(404).json({ error: 'product not found in cart' })
  }
  await cart.destroy()
  res.status(204).end()
})

module.exports = router