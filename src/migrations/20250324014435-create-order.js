'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'Orders',
      {
        id: {
          type: Sequelize.BIGINT,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false
        },
        code: {
          type: Sequelize.STRING,
          unique: true,
          allowNull: false
        },
        customerId: {
          allowNull: false,
          type: Sequelize.BIGINT,
          references: {
            model: 'Users',
            key: 'id'
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        customerName: {
          type: Sequelize.STRING
        },
        customerPhone: {
          type: Sequelize.STRING
        },
        customerEmail: {
          type: Sequelize.STRING
        },
        customerAddress: {
          type: Sequelize.STRING
        },
        userId: {
          allowNull: true,
          type: Sequelize.BIGINT,
          references: {
            model: 'Users',
            key: 'id'
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        totalAmount: {
          type: Sequelize.DECIMAL(20, 2),
          allowNull: false
        },
        status: {
          type: Sequelize.STRING(50),
          allowNull: false,
          defaultValue: 'pending' // ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
        },
        paymentStatus: {
          type: Sequelize.STRING(50),
          allowNull: true,
          defaultValue: 'unpaid' //  ENUM('unpaid', 'paid', 'refunded') DEFAULT 'unpaid',
        },
        date: {
          type: Sequelize.DATE
        },
        note: {
          type: Sequelize.STRING
        },
        createdBy: {
          type: Sequelize.BIGINT
        },
        updatedBy: {
          type: Sequelize.BIGINT
        },
        deletedAt: {
          type: Sequelize.DATE
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
    await queryInterface.dropTable('Orders')
  }
}
