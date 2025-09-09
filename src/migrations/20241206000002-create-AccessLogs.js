'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('AccessLogs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      user_id: {
        type: Sequelize.BIGINT,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      },
      ip_address: {
        type: Sequelize.STRING(45),
        allowNull: false
      },
      user_agent: {
        type: Sequelize.TEXT
      },
      access_token: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      status: {
        type: Sequelize.STRING(10),
        allowNull: false,
        comment: 'success, failed'
      },
      message: {
        type: Sequelize.TEXT,
        comment: 'Ghi lý do nếu thất bại'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      logout_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('AccessLogs')
  }
}
