const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('products', 'cover_image_id');
    await queryInterface.addColumn('images', 'is_cover', {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('products', 'cover_image_id', {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'images',
        key: 'image_id',
      },
      onDelete: 'SET NULL',
    });
    await queryInterface.removeColumn('images', 'is_cover');
  }
}