'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('ProductDiscounts', 'productVariantId');
    await queryInterface.addColumn('ProductDiscounts', 'productId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Products',
        key: 'id'
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('ProductDiscounts', 'productId');
  }
};
