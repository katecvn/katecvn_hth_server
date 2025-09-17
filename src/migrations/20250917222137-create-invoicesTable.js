'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'Invoices',
      {
        id: {
          type: Sequelize.BIGINT,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false
        },
        orderId: {
          allowNull: false,
          type: Sequelize.BIGINT,
          references: {
            model: 'Orders',
            key: 'id'
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        invoiceNumber: {
          type: Sequelize.STRING,
          unique: true,
          allowNull: false
        },
        issueDate: {
          type: Sequelize.DATE,
          allowNull: false
        },
        dueDate: {
          type: Sequelize.DATE,
          allowNull: true
        },
        subTotal: {
          type: Sequelize.DECIMAL(20, 2),
          allowNull: false,
          defaultValue: 0
        },
        discountAmount: {
          type: Sequelize.DECIMAL(20, 2),
          allowNull: false,
          defaultValue: 0
        },
        taxAmount: {
          type: Sequelize.DECIMAL(20, 2),
          allowNull: false,
          defaultValue: 0
        },
        totalAmount: {
          type: Sequelize.DECIMAL(20, 2),
          allowNull: false
        },
        status: {
          type: Sequelize.STRING(50),
          allowNull: false,
          defaultValue: 'draft' 
          // ENUM('draft', 'pending', 'approved', 'cancelled')
        },
        note: {
          type: Sequelize.STRING,
          allowNull: true
        },
        createdBy: {
          type: Sequelize.BIGINT,
          allowNull: true
        },
        updatedBy: {
          type: Sequelize.BIGINT,
          allowNull: true
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
    await queryInterface.dropTable('Invoices')
  }
}
