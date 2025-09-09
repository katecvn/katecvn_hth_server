'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'RoleHasPermissions',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.BIGINT
        },
        role_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          references: {
            model: 'Roles',
            key: 'id'
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        permission_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          references: { model: 'Permissions', key: 'id' },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        }
      },
      {
        charset: 'utf8',
        collate: 'utf8_unicode_ci',
        timestamps: false,
        underscored: true
      }
    )

    await queryInterface.addIndex('RoleHasPermissions', ['role_id', 'permission_id'], { unique: true })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('RoleHasPermissions')
  }
}
