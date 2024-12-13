const { Model, DataTypes, UUIDV4 } = require('sequelize');
const { sequelize } = require('../utils/db');

class Review extends Model {}

Review.init({
  reviewId: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: UUIDV4(),
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
  reviewerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'user_id',
    },
  },
  reviewedId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'user_id',
    },
  },
  type: {
    // type: DataTypes.ENUM('buyerToSeller', 'sellerToBuyer'),
    type: DataTypes.STRING,
    validate: {
      isIn: [['buyerToSeller', 'sellerToBuyer']],
    },
    allowNull: false,
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'orders',
      key: 'order_id',
    },
    // unique: true, // Ensure each order can only be reviewed once
  },
}, {
  sequelize,
  underscored: true,
  modelName: 'review',
  indexes: [
    {
      unique: true,
      fields: ['orderId', 'type'],
    },
  ],
});


module.exports = Review;