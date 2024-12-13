const router = require('express').Router();
const { userExtractor } = require('../utils/middleware');
const { Cart, Product, User } = require('../models');

router.get('/', userExtractor, async (req, res) => {
  const user = req.user
  // const products = await user.getCartProducts()
  // const carts = await Cart.findAll({
  //   where: {
  //     userId: user.userId
  //   },
  //   include: {
  //     model: Product,
  //     as: 'Product'
  //   }
  // })
  // res.json(carts)
  const carts = await user.getCarts({
    include: {
      model: Product,
      as: 'Product'
    }
  })

  res.json(carts)
})

router.post('/:productid', userExtractor, async (req, res) => {
  const user = req.user
  const productId = req.params.productid
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

router.put('/:cartid', userExtractor, async (req, res) => {
  const user = req.user
  const cartId = req.params.cartid
  const { quantity } = req.body
  if (!quantity || quantity < 1) {
    return res.status(400).json({ error: 'quantity must be at least 1' })
  }
  const cart = await Cart.findByPk(cartId)
  if (!cart) {
    return res.status(404).json({ error: 'product not found in cart' })
  }
  if (cart.userId !== user.userId) {
    return res.status(403).json({ error: 'no permission' })
  }
  cart.quantity = quantity
  await cart.save()
  res.json(cart)
})

router.delete('/:cartid', userExtractor, async (req, res) => {
  const user = req.user
  const cartId = req.params.cartid
  const cart = await Cart.findByPk(cartId)
  if (!cart) {
    return res.status(404).json({ error: 'product not found in cart' })
  }
  if (cart.userId !== user.userId) {
    return res.status(403).json({ error: 'no permission' })
  }
  await cart.destroy()
  res.status(204).end()
})

module.exports = router