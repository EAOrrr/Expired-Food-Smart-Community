const User = require('./user')
const Product = require('./product')
const Order = require('./order')
const Cart = require('./cart')
const IdempotencyKey = require('./idempotencyKey')

// Associations
User.hasMany(Product, { foreignKey: 'SellerId', as: 'Products', onDelete: 'CASCADE' });
Product.belongsTo(User, { foreignKey: 'SellerId', as: 'Seller', onDelete: 'CASCADE' });

User.belongsToMany(Product, { through: Cart, foreignKey: 'UserId', otherKey: 'ProductId', as: 'CartProducts' });
Product.belongsToMany(User, { through: Cart, foreignKey: 'ProductId', otherKey: 'UserId', as: 'CartUsers' });

User.hasMany(Order, { foreignKey: 'BuyerId', as: 'Orders' });
Order.belongsTo(User, { foreignKey: 'BuyerId', as: 'Buyer' });

User.hasMany(Order, { foreignKey: 'SellerId', as: 'SellerOrders' });
Order.belongsTo(User, { foreignKey: 'SellerId', as: 'Seller' });

Product.hasMany(Order, { foreignKey: 'ProductId', as: 'Orders' });
Order.belongsTo(Product, { foreignKey: 'ProductId', as: 'Product' });

User.hasMany(Cart, { foreignKey: 'UserId', as: 'Cart', onDelete: 'CASCADE' });
Cart.belongsTo(User, { foreignKey: 'UserId', as: 'User' });

Product.hasMany(Cart, { foreignKey: 'ProductId', as: 'Carts', onDelete: 'CASCADE' });
Cart.belongsTo(Product, { foreignKey: 'ProductId', as: 'Product'});

User.hasMany(IdempotencyKey, { foreignKey: 'UserId', as: 'IdempotencyKeys' });
IdempotencyKey.belongsTo(User, { foreignKey: 'UserId', as: 'User' });

module.exports = {
  User,
  Product,
  Order,
  Cart,
  IdempotencyKey
}