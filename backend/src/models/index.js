const User = require('./user')
const Product = require('./product')
const Order = require('./order')
const Cart = require('./cart')
const IdempotencyKey = require('./idempotencyKey')
const Review = require('./review')
const Image = require('./image')
const Bill = require('./bill')
const Message = require('./message')

// 用户与商品之间的关系： 一个用户可以有多个商品，一个商品只能属于一个用户
User.hasMany(Product, { foreignKey: 'SellerId', as: 'Products', onDelete: 'CASCADE' });
Product.belongsTo(User, { foreignKey: 'SellerId', as: 'Seller', onDelete: 'CASCADE' });

// 用户与商品之间的关系： 一个用户可以有多个商品，一个商品只能属于一个用户
User.belongsToMany(Product, { through: Cart, foreignKey: 'UserId', otherKey: 'ProductId', as: 'CartProducts'});
// Product.belongsToMany(User, { through: Cart, foreignKey: 'ProductId', otherKey: 'UserId', as: 'CartUsers', onDelete: 'SET NULL' });

// 用户与订单之间的关系： 一个用户可以有多个订单，一个订单只能属于一个用户
User.hasMany(Order, { foreignKey: 'BuyerId', as: 'Orders' });
Order.belongsTo(User, { foreignKey: 'BuyerId', as: 'Buyer' });

// 用户与订单之间的关系： 一个用户可以有多个订单，一个订单只能属于一个用户
User.hasMany(Order, { foreignKey: 'SellerId', as: 'SellerOrders' });
Order.belongsTo(User, { foreignKey: 'SellerId', as: 'Seller' });

// 商品与订单之间的关系： 一个商品可以有多个订单，一个订单只能属于一个商品
Product.hasMany(Order, { foreignKey: 'ProductId', as: 'Orders', onDelete: 'SET NULL' });
Order.belongsTo(Product, { foreignKey: 'ProductId', as: 'Product', onDelete: 'SET NULL' });

// 用户与购物车之间的关系： 一个用户可以有多个购物车，一个购物车只能属于一个用户
User.hasMany(Cart, { foreignKey: 'UserId', as: 'Carts', onDelete: 'CASCADE' });
Cart.belongsTo(User, { foreignKey: 'UserId', as: 'User', onDelete: 'CASCADE' });

// 商品与购物车之间的关系： 一个商品可以有多个购物车，一个购物车只能属于一个商品
Product.hasMany(Cart, { foreignKey: 'ProductId', as: 'Carts', onDelete: 'SET NULL' });
Cart.belongsTo(Product, { foreignKey: 'ProductId', as: 'Product', onDelete: 'SET NULL' });


// 用户与幂等键之间的关系： 一个用户可以有多个幂等键，一个幂等键只能属于一个用户
User.hasMany(IdempotencyKey, { foreignKey: 'UserId', as: 'IdempotencyKeys', onDelete: 'CASCADE' });
IdempotencyKey.belongsTo(User, { foreignKey: 'UserId', as: 'User', onDelete: 'CASCADE' });

// 用户与消息之间的关系： 一个用户可以有多个消息，一个消息只能属于一个用户
User.hasMany(Message, { foreignKey: 'SenderId', as: 'SentMessages', onDelete: 'CASCADE' });
User.hasMany(Message, { foreignKey: 'ReceiverId', as: 'ReceivedMessages', onDelete: 'CASCADE' });
Message.belongsTo(User, { foreignKey: 'SenderId', as: 'Sender', onDelete: 'CASCADE' });
Message.belongsTo(User, { foreignKey: 'ReceiverId', as: 'Receiver', onDelete: 'CASCADE' });

// 用户与评论之间的关系： 一个用户可以有多个评论，一个评论只能属于一个用户
User.hasMany(Review, { foreignKey: 'reviewerId', as: 'ReviewsGiven' });
User.hasMany(Review, { foreignKey: 'reviewedId', as: 'ReviewsReceived', onDelete: 'CASCADE' });
Review.belongsTo(User, { foreignKey: 'reviewerId', as: 'Reviewer' });
Review.belongsTo(User, { foreignKey: 'reviewedId', as: 'Reviewed', onDelete: 'CASCADE' });

// 订单与评论之间的关系： 一个订单可以有多个评论，一个评论只能属于一个订单
Order.hasOne(Review, { foreignKey: 'orderId', as: 'Review', onDelete: 'CASCADE' });
Review.belongsTo(Order, { foreignKey: 'orderId', as: 'Order', onDelete: 'CASCADE' });

// 商品与图片之间的关系： 一个商品可以有多个图片，一个图片只能属于一个商品
Product.hasMany(Image, { foreignKey: 'productId', as: 'Images', onDelete: 'CASCADE' });
Image.belongsTo(Product, { foreignKey: 'productId', as: 'Product', onDelete: 'CASCADE' });

// 订单与账单之间的关系： 一个订单可以有一个账单，一个账单只能属于一个订单
User.hasMany(Bill, { foreignKey: 'userId', as: 'Bills', onDelete: 'CASCADE' });
Bill.belongsTo(User, { foreignKey: 'userId', as: 'User', onDelete: 'CASCADE' });

// 订单与账单之间的关系： 一个订单可以有一个账单，一个账单只能属于一个订单
Order.hasOne(Bill, { foreignKey: 'orderId', as: 'Bill', onDelete: 'CASCADE' });

// Hook to ensure order status is 'Delivered' before creating a review
Review.beforeCreate(async (review, options) => {
  const order = await Order.findByPk(review.orderId);
  if (order.status !== 'Delivered') {
    throw new Error('Order must be delivered to leave a review');
  }
});

// Hook to ensure productId exists before creating a order
Order.beforeCreate(async (order, options) => {
  const product = await Product.findByPk(order.productId);
  if (!product) {
    throw new Error('Product does not exist');
  }
});

Order.beforeUpdate(async (order, options) => {
  const validTransitions = {
    Pending: ['Delivering', 'Cancelled'],
    Delivering: ['Delivered', 'Cancelled'],
    Delivered: [],
  };
  const currentStatus = order._previousDataValues.status;
  const newStatus = order.status;

  if (!validTransitions[currentStatus]?.includes(newStatus)) {
    throw new Error(`Invalid status transition from ${currentStatus} to ${newStatus}`);
  }
});


// Hook to ensure productId exists before creating a cart
Cart.beforeCreate(async (cart, options) => {
  const product = await Product.findByPk(cart.productId);
  if (!product) {
    throw new Error('Product does not exist');
  }
});

module.exports = {
  User,
  Product,
  Order,
  Cart,
  IdempotencyKey,
  Review,
  Image,
  Bill,
  Message,
}