'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'UserHasRoles',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.BIGINT
        },
        user_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          references: {
            model: 'Users',
            key: 'id'
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
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
        }
      },
      {
        charset: 'utf8',
        collate: 'utf8_unicode_ci',
        timestamps: false,
        underscored: true
      }
    )

    await queryInterface.addIndex('UserHasRoles', ['user_id', 'role_id'], { unique: true })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('UserHasRoles')
  }
}
