
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
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'products', // name of the target model
      key: 'product_id', // key in the target model
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  sellerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users', // name of the target model
      key: 'user_id', // key in the target model
    }
  },
  buyerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users', // name of the target model
      key: 'user_id', // key in the target model
    }
  },
  status: {
    // type: DataTypes.ENUM('Pending', 'Delivering', 'Delivered', 'Cancelled'),
    type: DataTypes.STRING,
    validate: {
      isIn: [['Pending', 'Delivering', 'Delivered', 'Cancelled']]
    },
    allowNull: false,
    defaultValue: 'Pending'
  }
}, {
  sequelize,
  underscored: true,
  modelName: 'order'
});

module.exports = Order;