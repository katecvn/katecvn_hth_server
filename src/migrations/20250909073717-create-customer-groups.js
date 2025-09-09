'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('CustomerGroups', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.BIGINT },
      name: { type: Sequelize.STRING(255), allowNull: false },

      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('CustomerGroups')
  }
}
