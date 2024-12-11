const router = require('express').Router();
const { userExtractor } = require('../utils/middleware');
const { Order, OrderProduct, Product, User, Cart } = require('../models');
const { sequelize } = require('../utils/db');

router.get('/', userExtractor, async (req, res) => {
  const user = req.user
  const orders = await Order.findAll({
    where: {
      buyerId: user.userId
    },
    include: {
      model: Product,
      as: 'Products',
      through: {
        model: OrderProduct,
        as: 'OrderProduct'
      }
    }
  })
  res.json(orders)
})

// 直接购买商品
router.post('/buy', userExtractor, async (req, res, next) => {
  const user = req.user;
  const { productId, quantity } = req.body;

  const t = await sequelize.transaction();
  try {
    // 获取商品信息
    const product = await Product.findByPk(productId, { transaction: t });
    if (!product) throw new Error('商品不存在');

    // 验证库存是否足够
    if (product.stock < quantity) {
      throw new Error('库存不足');
    }

    // 减少商品库存
    await product.update({ stock: product.stock - quantity }, { transaction: t });

    // 创建订单
    const order = await Order.create({
      buyerId: user.userId,
      totalPrice: product.price * quantity,
      status: 'Pending',
    }, { transaction: t });

    // 创建订单商品关联
    await OrderProduct.create({
      orderId: order.orderId,
      productId: product.productId,
      quantity: quantity,
      subtotal: product.price * quantity,
      price: product.price,
    }, { transaction: t });

    await t.commit();
    res.status(201).json(order);
  } catch (error) {
    await t.rollback();
    return res.status(400).json({ error: error.message });
  }
});

// 结算购物车
router.post('/checkout', userExtractor, async (req, res) => {
  const user = req.user;
  const { cartIds } = req.body;
  if (!cartIds || cartIds.length === 0) {
    return res.status(400).json({ error: '购物车为空' });
  }

  const t = await sequelize.transaction();
  try {
    // 获取购物车项
    const carts = await Cart.findAll({
      where: {
        cartId: cartIds,
        userId: user.userId,
      },
      include: [{
        model: Product,
        as: 'Product'
      }],
      transaction: t
    });

    if (carts.length === 0) throw new Error('购物车为空');

    // 验证所有商品库存是否足够
    for (const cart of carts) {
      const product = cart.Product;
      const quantity = cart.quantity;

      if (product.stock < quantity) {
        throw new Error(`商品 ${product.name} 库存不足`);
      }
    }

    // 创建订单
    const order = await Order.create({
      buyerId: user.userId,
      totalPrice: 0, // 稍后计算总价
      status: 'Pending',
    }, { transaction: t });

    let totalPrice = 0;

    // 遍历购物车项，创建订单商品关联并更新库存
    for (const cart of carts) {
      const product = cart.Product;
      const quantity = cart.quantity;

      // 减少商品库存
      await product.update({ stock: product.stock - quantity }, { transaction: t });

      await OrderProduct.create({
        orderId: order.orderId,
        productId: product.productId,
        quantity: quantity,
        price: product.price,
        subtotal: product.price * quantity,
      }, { transaction: t });

      totalPrice += product.price * quantity;

      // 删除已结算的购物车项
      await cart.destroy({ transaction: t });
    }

    // 更新订单总价
    await order.update({ totalPrice }, { transaction: t });

    await t.commit();
    res.status(201).json(order);
  } catch (error) {
    await t.rollback();
    // throw(error)
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', userExtractor, async (req, res) => {
  const user = req.user
  const orderId = req.params.id
  const { status } = req.body
  const order = await Order.findOne({
    where: {
      orderId: orderId,
      buyerId: user.userId
    }
  })
  if (!order) {
    return res.status(404).json({ error: 'order not found' })
  }
  order.status = status
  await order.save()
  res.json(order)
})

router.delete('/:id', userExtractor, async (req, res) => {
  const user = req.user
  const orderId = req.params.id
  const order = await Order.findOne({
    where: {
      orderId: orderId,
      buyerId: user.userId
    }
  })
  if (!order) {
    return res.status(404).json({ error: 'order not found' })
  }
  await order.destroy()
  res.status(204).end()
})

module.exports = router;