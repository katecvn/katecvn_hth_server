'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('ProductDiscounts', 'productVariantId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'ProductVariants',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    })

    await queryInterface.removeColumn('ProductDiscounts', 'productId')
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('ProductDiscounts', 'productId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Products',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    })

    await queryInterface.removeColumn('ProductDiscounts', 'productVariantId')
  }
}
