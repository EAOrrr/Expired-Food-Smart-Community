const { sequelize } = require('../utils/db')
const { DataTypes, Model, UUIDV4 } = require('sequelize')

class Image extends Model {}

Image.init({
  imageId: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: UUIDV4(),
  },

  data: {
    type: DataTypes.BLOB('long'),
    allowNull: false,
  },

  mimeType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'products',
      key: 'productId',
    }
  }
}, {
  sequelize,
  underscored: true,
  modelName: 'image'
})

module.exports = Image
