const User = require('./user')
const Product = require('./product')
const Order = require('./order')
const Cart = require('./cart')
const IdempotencyKey = require('./idempotencyKey')

// Associations
User.hasMany(Product, { foreignKey: 'SellerId', as: 'Products', onDelete: 'CASCADE' });
Product.belongsTo(User, { foreignKey: 'SellerId', as: 'Seller', onDelete: 'CASCADE' });

User.belongsToMany(Product, { through: Cart, foreignKey: 'UserId', otherKey: 'ProductId', as: 'CartProducts', onDelete: 'CASCADE' });
// Product.belongsToMany(User, { through: Cart, foreignKey: 'ProductId', otherKey: 'UserId', as: 'CartUsers', onDelete: 'SET NULL' });

User.hasMany(Order, { foreignKey: 'BuyerId', as: 'Orders', onDelete: 'SET NULL' });
Order.belongsTo(User, { foreignKey: 'BuyerId', as: 'Buyer', onDelete: 'SET NULL' });

User.hasMany(Order, { foreignKey: 'SellerId', as: 'SellerOrders', onDelete: 'SET NULL' });
Order.belongsTo(User, { foreignKey: 'SellerId', as: 'Seller', onDelete: 'SET NULL' });

Product.hasMany(Order, { foreignKey: 'ProductId', as: 'Orders', onDelete: 'CASCADE' });
Order.belongsTo(Product, { foreignKey: 'ProductId', as: 'Product', onDelete: 'CASCADE' });

User.hasMany(Cart, { foreignKey: 'UserId', as: 'Cart', onDelete: 'CASCADE' });
Cart.belongsTo(User, { foreignKey: 'UserId', as: 'User', onDelete: 'CASCADE' });

Product.hasMany(Cart, { foreignKey: 'ProductId', as: 'Carts', onDelete: 'SET NULL' });
Cart.belongsTo(Product, { foreignKey: 'ProductId', as: 'Product', onDelete: 'SET NULL' });

User.hasMany(IdempotencyKey, { foreignKey: 'UserId', as: 'IdempotencyKeys', onDelete: 'CASCADE' });
IdempotencyKey.belongsTo(User, { foreignKey: 'UserId', as: 'User', onDelete: 'CASCADE' });

module.exports = {
  User,
  Product,
  Order,
  Cart,
  IdempotencyKey
}