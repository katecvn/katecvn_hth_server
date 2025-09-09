'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'ProductVariants',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
        },
        productId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Products',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        sku: {
          type: Sequelize.STRING,
          allowNull: true
        },
        stock: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        unit: {
          type: Sequelize.STRING,
          allowNull: true
        },
        salePrice: {
          type: Sequelize.DECIMAL(20, 2),
          allowNull: false,
          defaultValue: 0
        },
        originalPrice: {
          type: Sequelize.DECIMAL(20, 2),
          allowNull: false,
          defaultValue: 0
        },
        position: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        imageUrl: {
          type: Sequelize.STRING,
          allowNull: true
        },
        status: {
          type: Sequelize.STRING,
          allowNull: true
        },
        createdBy: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        updatedBy: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        deletedAt: {
          type: Sequelize.DATE,
          allowNull: true
        }
      },
      {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci'
      }
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ProductVariants')
  }
}
