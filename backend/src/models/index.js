const User = require('./user')
const Product = require('./product')
const Order = require('./order')
const OrderProduct = require('./orderProduct')
const Cart = require('./cart')

// Associations
User.hasMany(Product, { foreignKey: 'SellerId', as: 'Products' });
Product.belongsTo(User, { foreignKey: 'SellerId', as: 'Seller' });

User.hasMany(Order, { foreignKey: 'BuyerID', as: 'Orders' });
Order.belongsTo(User, { foreignKey: 'BuyerID', as: 'Buyer' });

Order.belongsToMany(Product, { through: OrderProduct, foreignKey: 'OrderID', otherKey: 'ProductID', as: 'Products' });
Product.belongsToMany(Order, { through: OrderProduct, foreignKey: 'ProductID', otherKey: 'OrderID', as: 'Orders' });

User.hasOne(Cart, { foreignKey: 'UserID', as: 'Cart' });
Cart.belongsTo(User, { foreignKey: 'UserID', as: 'User' });

Cart.belongsToMany(Product, { through: 'CartProduct', foreignKey: 'CartID', otherKey: 'ProductID', as: 'Products' });
Product.belongsToMany(Cart, { through: 'CartProduct', foreignKey: 'ProductID', otherKey: 'CartID', as: 'Carts' });

module.exports = {
  User,
  Product,
  Order,
  OrderProduct,
  Cart
}