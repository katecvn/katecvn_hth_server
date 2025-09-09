'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('CandidateAttributesAssignments', {
      id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true, allowNull: false },
      candidateId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: { model: 'RecruitCandidate', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      attributeId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: { model: 'CandidateAttributes', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      attributeValueId: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: { model: 'CandidateAttributesValues', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      customValue: { type: Sequelize.STRING(255), allowNull: true }
    })
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('CandidateAttributesAssignments')
  }
}
