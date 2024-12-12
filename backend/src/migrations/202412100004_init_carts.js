
const { DataTypes, UUIDV4 } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('carts', {
      cart_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: UUIDV4()
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'user_id',
        }
      },
      product_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'products',
          key: 'product_id',
        }
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      added_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      }
    })
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('carts', { cascade: true })
  }
}