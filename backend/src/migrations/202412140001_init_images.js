const { DataTypes, UUIDV4 } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('images', {
      image_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: UUIDV4(),
      },
      data: {
        type: DataTypes.BLOB('long'),
        allowNull: false,
      },
      mime_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      product_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'products',
          key: 'product_id',
        },
        onDelete: 'CASCADE',
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

    await queryInterface.addColumn('products', 'cover_image_id', {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'images',
        key: 'image_id',
      },
      onDelete: 'SET NULL',
    });
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('products', 'cover_image_id');
    await queryInterface.dropTable('images', { cascade: true });
  },
};
