'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'OrderDiscounts',
      {
        id: {
          type: Sequelize.BIGINT,
          primaryKey: true,
          autoIncrement: true
        },
        orderId: {
          allowNull: false,
          type: Sequelize.BIGINT,
          references: { model: 'Orders', key: 'id' },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        discountId: {
          allowNull: false,
          type: Sequelize.BIGINT,
          references: { model: 'Discounts', key: 'id' },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        discountAmount: {
          type: Sequelize.DECIMAL(20, 2),
          allowNull: false
        }
      },
      {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci'
      }
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('OrderDiscounts')
  }
}
