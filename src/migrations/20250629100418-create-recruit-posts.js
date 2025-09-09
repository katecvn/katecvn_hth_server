'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('RecruitPosts', {
      id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true, allowNull: false },
      slug: { type: Sequelize.STRING(255), allowNull: false },
      title: { type: Sequelize.STRING(255), allowNull: false },
      status: { type: Sequelize.STRING(20), allowNull: false },
      jobDescription: { type: Sequelize.TEXT, allowNull: false },
      jobRequirements: { type: Sequelize.TEXT, allowNull: false },
      benefits: { type: Sequelize.TEXT, allowNull: false },
      applyRequirements: { type: Sequelize.TEXT, allowNull: false },
      contactInfo: { type: Sequelize.TEXT, allowNull: false },
      deadline: { type: Sequelize.DATE, allowNull: false },
      applyAddress: { type: Sequelize.STRING(255), allowNull: true },
      applyEmail: { type: Sequelize.STRING(255), allowNull: true },
      createdBy: { type: Sequelize.BIGINT, allowNull: true },
      updatedBy: { type: Sequelize.BIGINT, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: true },
      updatedAt: { type: Sequelize.DATE, allowNull: true },
      deletedAt: { type: Sequelize.DATE, allowNull: true }
    })
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('RecruitPosts')
  }
}
