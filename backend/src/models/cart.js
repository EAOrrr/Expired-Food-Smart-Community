const { Model, DataTypes, UUIDV4 } = require('sequelize');
const { sequelize } = require('../utils/db');

class Cart extends Model {}

Cart.init({
  cartId: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: UUIDV4()
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users', // name of the target model
      key: 'user_id', // key in the target model
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
  addedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  }
}, {
  sequelize,
  underscored: true,
  modelName: 'cart'
});

module.exports = Cart;