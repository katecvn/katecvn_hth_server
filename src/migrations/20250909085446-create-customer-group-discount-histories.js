// migrate: customer-group-discount-history
'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('CustomerGroupDiscountHistories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },

      customerGroupId: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: { model: 'CustomerGroups', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      productId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'Products', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },

      oldType: { type: Sequelize.ENUM('percentage', 'fixed'), allowNull: true },
      oldValue: { type: Sequelize.DECIMAL(15, 2), allowNull: true },

      newType: { type: Sequelize.ENUM('percentage', 'fixed'), allowNull: true },
      newValue: { type: Sequelize.DECIMAL(15, 2), allowNull: true },

      updatedBy: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    })
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('CustomerGroupDiscountHistories')
  },
}
