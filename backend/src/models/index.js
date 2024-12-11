const User = require('./user')
const Product = require('./product')
const Order = require('./order')
const OrderProduct = require('./orderProduct')
const Cart = require('./cart')
const IdempotencyKey = require('./idempotencyKey')

// Associations
User.hasMany(Product, { foreignKey: 'SellerId', as: 'Products' });
Product.belongsTo(User, { foreignKey: 'SellerId', as: 'Seller' });

User.belongsToMany(Product, { through: Cart, foreignKey: 'UserId', otherKey: 'ProductId', as: 'CartProducts' });
Product.belongsToMany(User, { through: Cart, foreignKey: 'ProductId', otherKey: 'UserId', as: 'CartUsers' });

User.hasMany(Order, { foreignKey: 'BuyerId', as: 'Orders' });
Order.belongsTo(User, { foreignKey: 'BuyerId', as: 'Buyer' });

Order.belongsToMany(Product, { through: OrderProduct, foreignKey: 'OrderID', otherKey: 'ProductID', as: 'Products' });
Product.belongsToMany(Order, { through: OrderProduct, foreignKey: 'ProductID', otherKey: 'OrderID', as: 'Orders' });


User.hasMany(IdempotencyKey, { foreignKey: 'UserId', as: 'IdempotencyKeys' });
IdempotencyKey.belongsTo(User, { foreignKey: 'UserId', as: 'User' });

module.exports = {
  User,
  Product,
  Order,
  OrderProduct,
  Cart,
  IdempotencyKey
}