const { Model, DataTypes, UUIDV4} = require('sequelize')
const { sequelize } = require('../utils/db')

class Product extends Model {}

Product.init({
  productId: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: UUIDV4()
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  expiryDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('Active', 'Inactive'),
    defaultValue: 'Active',
    allowNull: false,
  },
  sellerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users', // name of the target model
      key: 'user_id', // key in the target model
    }
  }
}, {
  sequelize,
  underscored: true,
  modelName: 'product'
});

module.exports = Product