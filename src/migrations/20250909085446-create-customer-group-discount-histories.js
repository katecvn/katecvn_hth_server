'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('CustomerGroupDiscountHistories', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.BIGINT },

      customerGroupId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: { model: 'CustomerGroups', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },

      oldType: { type: Sequelize.ENUM('percentage', 'fixed'), allowNull: true },
      oldValue: { type: Sequelize.DECIMAL(15, 2), allowNull: true },

      newType: { type: Sequelize.ENUM('percentage', 'fixed'), allowNull: false },
      newValue: { type: Sequelize.DECIMAL(15, 2), allowNull: false },

      changedBy: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },

      changedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('CustomerGroupDiscountHistories')
  }
}
