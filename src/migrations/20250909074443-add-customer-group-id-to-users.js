'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'customerGroupId', {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: { model: 'CustomerGroups', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'customerGroupId')
  }
}
