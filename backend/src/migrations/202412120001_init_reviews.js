const { DataTypes, UUIDV4 } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('reviews', {
      review_id: {
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
      reviewer_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'user_id',
        },
      },
      reviewed_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'user_id',
        },
      },
      type: {
        type: DataTypes.STRING,
        validate: {
          isIn: [['buyerToSeller', 'sellerToBuyer']],
        },
        allowNull: false,
      },
      order_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'orders',
          key: 'order_id',
        },
        unique: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('reviews', { cascade: true });
  }
};
