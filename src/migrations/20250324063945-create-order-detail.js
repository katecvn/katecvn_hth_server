'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'OrderDetails',
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
        productVariantId: {
          type: Sequelize.INTEGER,
        },
        productSku: {
          type: Sequelize.STRING(100),
          allowNull: false
        },
        productName: {
          type: Sequelize.STRING,
          allowNull: false
        },
        productUnit: {
          type: Sequelize.STRING(50),
          allowNull: false
        },
        quantity: {
          type: Sequelize.FLOAT,
          allowNull: false
        },
        salePrice: {
          type: Sequelize.DECIMAL(20, 2),
          allowNull: false
        },
        originalPrice: {
          type: Sequelize.DECIMAL(20, 2),
          allowNull: true
        },
        totalPrice: {
          type: Sequelize.DECIMAL(20, 2),
          allowNull: false
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
    await queryInterface.dropTable('OrderDetails')
  }
}
