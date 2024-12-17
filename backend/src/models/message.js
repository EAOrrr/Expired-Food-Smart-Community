const { Model, DataTypes, UUIDV4} = require('sequelize')
const { sequelize } = require('../utils/db')

class Message extends Model {}

Message.init({
  messageId: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: UUIDV4()
  },
  senderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users', // name of the target model
      key: 'user_id', // key in the target model
    }
  },
  receiverId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users', // name of the target model
      key: 'user_id', // key in the target model
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  sequelize,
  underscored: true,
  modelName: 'message'
});

module.exports = Message