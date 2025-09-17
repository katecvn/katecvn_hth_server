'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RewardPointRules', {
      id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
      type: { type: Sequelize.ENUM('order_value', 'time_slot'), allowNull: false },
      minOrderValue: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      beforeTime: { type: Sequelize.TIME, allowNull: true },
      points: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      status: { type: Sequelize.ENUM('active', 'inactive'), allowNull: false, defaultValue: 'active' },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW }
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('RewardPointRules')
  }
}
