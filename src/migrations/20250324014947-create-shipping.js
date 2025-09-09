'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'Shippings',
      {
        id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        orderId: {
          type: Sequelize.BIGINT,
          allowNull: false,
          references: {
            model: 'Orders',
            key: 'id'
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        trackingNumber: {
          type: Sequelize.STRING,
          unique: true
        },
        shippingMethod: {
          type: Sequelize.STRING
        },
        shippingStatus: {
          type: Sequelize.STRING(20),
          defaultValue: 'pending'
        },
        estimatedDelivery: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        deliveredAt: {
          type: Sequelize.STRING,
          allowNull: true
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false
        },
        updatedAt: {
          type: Sequelize.DATE,
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
    await queryInterface.dropTable('Shippings')
  }
}
