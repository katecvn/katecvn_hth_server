'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('RecruitAttributes', {
      id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true, allowNull: false },
      name: { type: Sequelize.STRING(255), allowNull: false },
      code: { type: Sequelize.STRING(255), unique: true, allowNull: false },
      defaultValue: { type: Sequelize.STRING(255), allowNull: true },
      isRequired: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      description: { type: Sequelize.TEXT, allowNull: true },
      displayPriority: { type: Sequelize.INTEGER, allowNull: true, defaultValue: 0 },
      isDefaultFilter: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      isAdvancedFilter: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      icon: { type: Sequelize.STRING(50), allowNull: true },
      createdBy: { type: Sequelize.BIGINT, allowNull: true },
      updatedBy: { type: Sequelize.BIGINT, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: true },
      updatedAt: { type: Sequelize.DATE, allowNull: true },
      deletedAt: { type: Sequelize.DATE, allowNull: true }
    })
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('RecruitAttributes')
  }
}
