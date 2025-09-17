'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RewardPointHistories', {
      id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
      userId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      orderId: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: { model: 'Orders', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      ruleType: { type: Sequelize.ENUM('order_value', 'time_slot'), allowNull: false },
      minOrderValue: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      beforeTime: { type: Sequelize.TIME, allowNull: true },
      points: { type: Sequelize.INTEGER, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW }
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('RewardPointHistories')
  }
}
