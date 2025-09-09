'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('CandidateAttributes', {
      id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true, allowNull: false },
      name: { type: Sequelize.STRING(255), allowNull: false },
      code: { type: Sequelize.STRING(255), unique: true, allowNull: false },
      inputType: { type: Sequelize.STRING(255), allowNull: false },
      defaultValue: { type: Sequelize.STRING(255), allowNull: true },
      isRequired: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      displayPriority: { type: Sequelize.INTEGER, allowNull: true, defaultValue: 0 },
      minLength: { type: Sequelize.INTEGER, allowNull: true },
      maxLength: { type: Sequelize.INTEGER, allowNull: true },
      description: { type: Sequelize.STRING(255), allowNull: true },
      icon: { type: Sequelize.STRING(50), allowNull: true },
      createdBy: { type: Sequelize.BIGINT, allowNull: true },
      updatedBy: { type: Sequelize.BIGINT, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: true },
      updatedAt: { type: Sequelize.DATE, allowNull: true },
      deletedAt: { type: Sequelize.DATE, allowNull: true }
    })
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('CandidateAttributes')
  }
}
