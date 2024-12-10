const { Model, DataTypes, UUIDV4} = require('sequelize')
const { sequelize } = require('../utils/db')

class User extends Model {}

User.init({
  userId: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: UUIDV4()
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isNumeric: true
    }
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  underscored: true,
  modelName: 'user'
})

module.exports = User