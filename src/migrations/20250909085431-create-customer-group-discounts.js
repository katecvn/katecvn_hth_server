'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('CustomerGroupDiscounts', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.BIGINT },

      customerGroupId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: { model: 'CustomerGroups', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },

      discountType: {
        type: Sequelize.ENUM('percentage', 'fixed'),
        allowNull: false
      },

      discountValue: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false
      },

      status: {
        type: Sequelize.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active'
      },

      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('CustomerGroupDiscounts')
  }
}
