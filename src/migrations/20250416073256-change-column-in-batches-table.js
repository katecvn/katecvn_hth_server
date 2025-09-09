'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Batches', 'variantId')
    await queryInterface.addColumn('Batches', 'productId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Products',
        key: 'id'
      }
    })
    await queryInterface.changeColumn('Batches', 'supplierId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Suppliers',
        key: 'id'
      },
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('Batches', 'variantId', {
      type: Sequelize.INTEGER,
      allowNull: true
    })
    await queryInterface.changeColumn('Batches', 'supplierId', {
      type: Sequelize.INTEGER,
      allowNull: true
    })
    await queryInterface.removeColumn('Batches', 'productId');
  }
};
