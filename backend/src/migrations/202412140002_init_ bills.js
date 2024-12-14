const { DataTypes, UUIDV4 } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('bills', {
      bill_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: UUIDV4(),
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'user_id',
        },
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      operation: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [['deposit', 'payment', 'income', 'refund']],
        },
      },
      order_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'orders',
          key: 'order_id',
        },
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

    await queryInterface.addColumn('users', 'last_deposit_time', {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    });
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('bills', { cascade: true });
    await queryInterface.removeColumn('users', 'last_deposit_time');
  }
};