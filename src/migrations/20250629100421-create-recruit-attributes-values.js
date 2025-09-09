'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('RecruitAttributesValues', {
      id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true, allowNull: false },
      attributeId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: { model: 'RecruitAttributes', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      value: { type: Sequelize.STRING(255), allowNull: false },
      isDefault: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false }
    })
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('RecruitAttributesValues')
  }
}
