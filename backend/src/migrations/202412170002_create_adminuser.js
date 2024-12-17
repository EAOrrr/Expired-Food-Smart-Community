const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: QueryInterface }) => {
    await QueryInterface.addColumn('users', 'is_admin', {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    await QueryInterface.addColumn('products', 'status', {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['pending', 'active', 'fail']]
      },
      defaultValue: 'pending'
    });
    
  },

  down: async ({ context: QueryInterface }) => {
    await QueryInterface.removeColumn('users', 'is_admin');
    await QueryInterface.removeColumn('products', 'status');
  },
}