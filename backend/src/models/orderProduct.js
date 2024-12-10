
const { Model, DataTypes, UUIDV4 } = require('sequelize');
const { sequelize } = require('../utils/db');

class OrderProduct extends Model {}

OrderProduct.init({
  orderProductId: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: UUIDV4()
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'orders', // name of the target model
      key: 'order_id', // key in the target model
    }
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
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  }
}, {
  sequelize,
  underscored: true,
  modelName: 'orderProduct'
});

module.exports = OrderProduct;