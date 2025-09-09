'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'ProductDiscounts',
      {
        id: {
          type: Sequelize.BIGINT,
          primaryKey: true,
          autoIncrement: true
        },
        productVariantId: {
          type: Sequelize.INTEGER,
        },
        discountId: {
          allowNull: false,
          type: Sequelize.BIGINT,
          references: { model: 'Discounts', key: 'id' },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        }
      },
      {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci'
      }
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ProductDiscounts')
  }
}
