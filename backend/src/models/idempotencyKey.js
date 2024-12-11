const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');

class IdempotencyKey extends Model {}

IdempotencyKey.init({
  key: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'user_id',
    },
    onDelete: 'CASCADE',
  },
  operation: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expiry: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  underscored: true,
  modelName: 'idempotency_key'
});

module.exports = IdempotencyKey;