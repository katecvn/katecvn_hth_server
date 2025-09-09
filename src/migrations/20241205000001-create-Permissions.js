'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'Permissions',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.BIGINT
        },
        parent_id: {
          type: Sequelize.BIGINT
        },
        name: {
          type: Sequelize.STRING(100),
          allowNull: false,
          unique: true
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        created_at: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW
        },
        updated_at: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW
        },
        deleted_at: {
          type: Sequelize.DATE,
          allowNull: true
        }
      },
      {
        charset: 'utf8',
        collate: 'utf8_unicode_ci',
        timestamps: true,
        paranoid: true,
        underscored: true
      }
    )

    // ✅ Thêm index để tối ưu tìm kiếm
    await queryInterface.addIndex('Permissions', ['name'])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Permissions')
  }
}
