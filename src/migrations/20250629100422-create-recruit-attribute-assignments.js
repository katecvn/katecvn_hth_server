'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('RecruitAttributeAssignments', {
      id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true, allowNull: false },
      recruitPostId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: { model: 'RecruitPosts', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      attributeId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: { model: 'RecruitAttributes', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      attributeValueId: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: { model: 'RecruitAttributesValues', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      customValue: { type: Sequelize.STRING(255), allowNull: true }
    })
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('RecruitAttributeAssignments')
  }
}
