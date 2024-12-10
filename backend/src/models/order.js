const { Model, DataTypes, UUIDV4 } = require('sequelize');
const { sequelize } = require('../utils/db');

class Order extends Model {}

Order.init({
  orderId: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: UUIDV4()
  },
  buyerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users', // name of the target model
      key: 'user_id', // key in the target model
    }
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Shipped', 'Delivered'),
    allowNull: false,
  },
  shippingInfo: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  sequelize,
  underscored: true,
  modelName: 'order'
});

module.exports = Order;
