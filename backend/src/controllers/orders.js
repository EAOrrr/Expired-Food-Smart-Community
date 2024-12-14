const router = require('express').Router();
const { userExtractor } = require('../utils/middleware');
const { Order, Product, User, Cart, IdempotencyKey } = require('../models');
const { sequelize } = require('../utils/db');

router.get('/buy', userExtractor, async (req, res) => {
  const user = req.user
  const orders = await Order.findAll({
    where: {
      buyerId: user.userId
    },
    include: {
      model: Product,
      as: 'Product',
    }
  })
  res.json(orders)
})

router.get('/sell', userExtractor, async (req, res) => {
  const user = req.user
  const orders = await Order.findAll({
    where: {
      sellerId: user.userId
    },
    include: {
      model: Product,
      as: 'Product',
    }
  })
  res.json(orders)
})

// 直接购买商品
router.post('/product', userExtractor, async (req, res, next) => {
  const { idempotencyKey, productId, quantity } = req.body;

  if (!idempotencyKey) {
    return res.status(400).json({ error: 'Idempotency-Key is required' });
  }

  const t = await sequelize.transaction();
  try {
    const existingKey = await IdempotencyKey.findOne({ where: { key: idempotencyKey }, transaction: t });
    if (existingKey) {
      await t.rollback();
      return res.status(409).json({ error: 'Duplicate request' });
    }

    const user = req.user;

    // 获取商品信息
    const product = await Product.findByPk(productId, { transaction: t });
    if (!product) throw new Error('商品不存在');

    // 验证库存是否足够
    if (product.stock < quantity) {
      throw new Error('库存不足');
    }

    const totalPrice = product.price * quantity;

    // Check if user balance is sufficient
    if (user.balance < totalPrice) {
      throw new Error('余额不足'); // 'Insufficient balance'
    }

    // Deduct the total price from user balance
    await user.update({ balance: user.balance - totalPrice }, { transaction: t });

    // 减少商品库存
    await product.update({ stock: product.stock - quantity }, { transaction: t });

    // 创建订单
    const order = await Order.create({
      buyerId: user.userId,
      sellerId: product.sellerId,
      productId: product.productId,
      total: totalPrice,
      price: product.price,
      quantity: quantity,
      status: 'Pending',
    }, { transaction: t });

    // 保存Idempotency Key
    await IdempotencyKey.create({
      key: idempotencyKey,
      userId: user.userId,
      operation: 'POST /product',
      expiry: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours expiry
    }, { transaction: t });


    await t.commit();
    res.status(201).json(order);
  } catch (error) {
    await t.rollback();
    // throw(error)
    return res.status(400).json({ error: error.message });
  }
});

// 结算购物车
router.post('/cart', userExtractor, async (req, res) => {
  const { idempotencyKey, cartIds } = req.body;
  if (!idempotencyKey) {
    return res.status(400).json({ error: 'Idempotency-Key is required' });
  }

  if (!cartIds || cartIds.length === 0) {
    return res.status(400).json({ error: '购物车为空' });
  }

  const t = await sequelize.transaction();
  try {
    const existingKey = await IdempotencyKey.findOne({ where: { key: idempotencyKey }, transaction: t });
    if (existingKey) {
      await t.rollback();
      return res.status(409).json({ error: 'Duplicate request' });
    }

    const user = req.user;

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

    let totalPrice = 0;

    // 遍历购物车项，创建订单商品关联并更新库存
    for (const cart of carts) {
      const product = cart.Product;
      const quantity = cart.quantity;

      // 减少商品库存
      await product.update({ stock: product.stock - quantity }, { transaction: t });

      await Order.create({
        productId: product.productId,
        buyerId: user.userId,
        sellerId: product.sellerId,
        quantity: quantity,
        price: product.price,
        total: product.price * quantity,
      }, { transaction: t });


      totalPrice += product.price * quantity;

      // 删除已结算的购物车项
      await cart.destroy({ transaction: t });
    }

    // Check if user balance is sufficient
    if (user.balance < totalPrice) {
      throw new Error('余额不足'); // 'Insufficient balance'
    }

    // Deduct the total price from user balance
    await user.increment({balance: -totalPrice}, { transaction: t });
    // await user.update({ balance: user.balance - totalPrice }, { transaction: t });

    // 结算完成后保存Idempotency Key
    await IdempotencyKey.create({
      key: idempotencyKey,
      userId: user.userId,
      operation: 'POST /cart',
      expiry: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours expiry
    }, { transaction: t });

    await t.commit();
    res.status(201).json({ 
      message: '结算成功',
      buyerId: user.userId,
      totalPrice: totalPrice,
    });
  } catch (error) {
    if (!t.finished) await t.rollback();
    // throw(error)
    res.status(400).json({ error: error.message });
  }
});

  // 模拟快递状态变更
  // 1. 买家下单后，订单状态为 Pending
  // 2. 卖家接单后，订单状态为 Delivering，只能卖家操作
  // 3. 买家收到货后，订单状态为 Delivered，卖家收到钱，只能买家操作，（或者卖家发起时离订单上一次更新时间超过 7 天）
  // 4. 买家取消订单后，订单状态为 Cancelled，把钱退回买家账户，买家或卖家操作
  // 状态变更只能由买家或卖家操作，其他用户无权操作
  // 状态转换如下： 1 --> 2 --> 3
  //               |     |     |
  //               4     4     4
  // 使用事务保证状态变更的原子性

router.put('/:id', userExtractor, async (req, res) => {
  const user = req.user;
  const orderId = req.params.id;
  const { status } = req.body;

  const t = await sequelize.transaction();
  try {
    const order = await Order.findByPk(orderId, { transaction: t });
    if (!order) {
      await t.rollback();
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if user is buyer or seller
    if (user.userId !== order.buyerId && user.userId !== order.sellerId) {
      await t.rollback();
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Define valid status transitions
    const validTransitions = {
      Pending: ['Delivering', 'Cancelled'],
      Delivering: ['Delivered', 'Cancelled'],
      Delivered: [],
      Cancelled: []
    };
    console.log(validTransitions[order.status], status)
    if (!validTransitions[order.status].includes(status)) {
      await t.rollback();
      return res.status(400).json({ error: 'Invalid status transition' });
    }

    // Enforce role-based status changes
    const roleRequired = {
      'Delivering': 'seller',
      'Delivered': 'both',
      'Cancelled': 'both'
    };

    const requiredRole = roleRequired[status];
    if (requiredRole === 'seller' && user.userId !== order.sellerId) {
      await t.rollback();
      return res.status(403).json({ error: 'Only seller can change status to Delivering' });
    } else if (requiredRole === 'buyer' && user.userId !== order.buyerId) {
      await t.rollback();
      return res.status(403).json({ error: 'Only buyer can change status to Delivered' });
    }

    // delivered 特殊判断
    // 如果是卖家发起，且订单状态为 Delivering， 距离上次更新时间未超过 7 天，不允许发起
    // 买家发起时，不受时间限制
    // （该情况暂未测试）
    if (status === 'Delivered' && user.userId === order.sellerId && order.status === 'Delivering') {
      const now = new Date();
      const diff = now - order.updatedAt;
      const days = diff / (1000 * 60 * 60 * 24);
      console.log('\n\n', days, '\n\n')
      if (days < 7) {
        await t.rollback();
        return res.status(400).json({ error: 'Seller can only change status to Delivered after 7 days' });
      }
    }

    // Update order status
    order.status = status;
    await order.save({ transaction: t });

    // Handle side effects
    if (status === 'Delivered') {
      // Transfer money to seller
      const seller = await User.findByPk(order.sellerId, { transaction: t });
      await seller.increment('balance', { by: order.total, transaction: t });
    } else if (status === 'Cancelled') {
      // Refund buyer
      const buyer = await User.findByPk(order.buyerId, { transaction: t });
      await buyer.increment('balance', { by: order.total, transaction: t });
      // restore product stock
      const product = await Product.findByPk(order.productId, { transaction: t });
      product.stock += order.quantity;
      await product.increment('stock', { by: order.quantity, transaction: t });
    }

    await t.commit();
    res.json(order);
  } catch (error) {
    if (!t.finished)  await t.rollback();
    res.status(400).json({ error: error.message });
  }
});


module.exports = router;