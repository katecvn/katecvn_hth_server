'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'PostComments',
      {
        id: {
          type: Sequelize.BIGINT,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
        },
        post_id: {
          type: Sequelize.BIGINT,
          references: {
            model: 'Posts',
            key: 'id'
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        user_id: {
          type: Sequelize.BIGINT,
          allowNull: true,
          references: {
            model: 'Users',
            key: 'id'
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        content: {
          type: Sequelize.STRING(255),
          allowNull: false
        },
        parent_id: {
          type: Sequelize.BIGINT,
          references: {
            model: 'PostComments',
            key: 'id'
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          allowNull: true
        },
        status: {
          type: Sequelize.STRING(20)
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
        collate: 'utf8_unicode_ci'
      }
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('PostComments')
  }
}
