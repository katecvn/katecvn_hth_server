'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('RecruitCandidate', {
      id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true, allowNull: false },
      recruitPostId: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: { model: 'RecruitPosts', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      candidateName: { type: Sequelize.STRING(255), allowNull: false },
      candidatePhone: { type: Sequelize.STRING(13), allowNull: false },
      candidateEmail: { type: Sequelize.STRING(255), allowNull: false },
      dateOfBirth: { type: Sequelize.DATE, allowNull: false },
      gender: { type: Sequelize.STRING(50), allowNull: false },
      address: { type: Sequelize.STRING(255), allowNull: false },
      cvUrl: { type: Sequelize.STRING(255), allowNull: false },
      status: { type: Sequelize.STRING(20), allowNull: false },
      createdBy: { type: Sequelize.BIGINT, allowNull: true },
      updatedBy: { type: Sequelize.BIGINT, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: true },
      updatedAt: { type: Sequelize.DATE, allowNull: true },
      deletedAt: { type: Sequelize.DATE, allowNull: true }
    })
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('RecruitCandidate')
  }
}
