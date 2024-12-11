// migrations/202412100003_create_idempotency_keys.js
const { DataTypes } = require('sequelize')
module.exports = {
  up: async ({ context: queryInterface}) => {
    await queryInterface.createTable('idempotency_keys', {
      key: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      user_id: {
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
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addIndex('idempotency_keys', ['key', 'operation', 'user_id'], {
      unique: true,
      name: 'unique_idempotency_key_per_user',
    });
  },

  down: async ( { context: queryInterface }) => {
    await queryInterface.dropTable('idempotency_keys');
  }
};