'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'Discounts',
      {
        id: {
          type: Sequelize.BIGINT,
          autoIncrement: true,
          primaryKey: true
        },
        code: {
          type: Sequelize.STRING(50),
          allowNull: false
        },
        type: {
          type: Sequelize.ENUM('percentage', 'fixed', 'free_shipping', 'buy_x_get_y'),
          allowNull: false
        },
        value: {
          type: Sequelize.DECIMAL(20, 2),
          allowNull: false
        },
        minOrderAmount: {
          type: Sequelize.DECIMAL(20, 2),
          allowNull: true
        },
        maxDiscount: {
          type: Sequelize.DECIMAL(20, 2),
          allowNull: true
        },
        startDate: {
          type: Sequelize.DATE,
          allowNull: false
        },
        endDate: {
          type: Sequelize.DATE,
          allowNull: false
        },
        usageLimit: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        usedCount: {
          type: Sequelize.INTEGER,
          defaultValue: 0
        },
        status: {
          type: Sequelize.STRING(20),
          defaultValue: 'active' // 'active', 'expired', 'disabled'
        },
        createdBy: {
          type: Sequelize.BIGINT,
          allowNull: false
        },
        updatedBy: {
          type: Sequelize.BIGINT,
          allowNull: true
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false
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
    await queryInterface.dropTable('Discounts')
  }
}
