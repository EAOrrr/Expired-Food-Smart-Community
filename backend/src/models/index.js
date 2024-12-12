const User = require('./user')
const Product = require('./product')
const Order = require('./order')
const Cart = require('./cart')
const IdempotencyKey = require('./idempotencyKey')
const Review = require('./review')

// Associations
User.hasMany(Product, { foreignKey: 'SellerId', as: 'Products', onDelete: 'CASCADE' });
Product.belongsTo(User, { foreignKey: 'SellerId', as: 'Seller', onDelete: 'CASCADE' });

User.belongsToMany(Product, { through: Cart, foreignKey: 'UserId', otherKey: 'ProductId', as: 'CartProducts'});
// Product.belongsToMany(User, { through: Cart, foreignKey: 'ProductId', otherKey: 'UserId', as: 'CartUsers', onDelete: 'SET NULL' });

User.hasMany(Order, { foreignKey: 'BuyerId', as: 'Orders' });
Order.belongsTo(User, { foreignKey: 'BuyerId', as: 'Buyer' });

User.hasMany(Order, { foreignKey: 'SellerId', as: 'SellerOrders' });
Order.belongsTo(User, { foreignKey: 'SellerId', as: 'Seller' });

Product.hasMany(Order, { foreignKey: 'ProductId', as: 'Orders', onDelete: 'CASCADE' });
Order.belongsTo(Product, { foreignKey: 'ProductId', as: 'Product', onDelete: 'CASCADE' });

User.hasMany(Cart, { foreignKey: 'UserId', as: 'Carts', onDelete: 'CASCADE' });
Cart.belongsTo(User, { foreignKey: 'UserId', as: 'User', onDelete: 'CASCADE' });

Product.hasMany(Cart, { foreignKey: 'ProductId', as: 'Carts' });
Cart.belongsTo(Product, { foreignKey: 'ProductId', as: 'Product' });

User.hasMany(IdempotencyKey, { foreignKey: 'UserId', as: 'IdempotencyKeys', onDelete: 'CASCADE' });
IdempotencyKey.belongsTo(User, { foreignKey: 'UserId', as: 'User', onDelete: 'CASCADE' });

// Associations
User.hasMany(Review, { foreignKey: 'reviewerId', as: 'ReviewsGiven' });
User.hasMany(Review, { foreignKey: 'reviewedId', as: 'ReviewsReceived', onDelete: 'CASCADE' });
Review.belongsTo(User, { foreignKey: 'reviewerId', as: 'Reviewer' });
Review.belongsTo(User, { foreignKey: 'reviewedId', as: 'Reviewed', onDelete: 'CASCADE' });

Order.hasOne(Review, { foreignKey: 'orderId', as: 'Review'
  , onDelete: 'CASCADE' });
Review.belongsTo(Order, { foreignKey: 'orderId', as: 'Order', onDelete: 'CASCADE' });

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
  Review
}