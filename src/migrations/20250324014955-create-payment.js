'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'Payments',
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
        paymentMethod: {
          type: Sequelize.STRING(20)
        },
        transactionId: {
          type: Sequelize.STRING,
          allowNull: true
        },
        amount: {
          type: Sequelize.DECIMAL(20, 2)
        },
        status: {
          type: Sequelize.STRING(20),
          defaultValue: 'pending'
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
    await queryInterface.dropTable('Payments')
  }
}
