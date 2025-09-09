'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'Topics',
      {
        id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
          type: Sequelize.STRING(255),
          allowNull: false
        },
        slug: {
          type: Sequelize.STRING(255),
          allowNull: false
        },
        parent_id: {
          type: Sequelize.BIGINT,
          references: {
            model: 'Topics',
            key: 'id'
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          allowNull: true
        },
        status: {
          type: Sequelize.STRING(20),
          defaultValue: 'active'
        },
        created_at: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
          allowNull: true
        },
        updated_at: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
          allowNull: true
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
    await queryInterface.dropTable('Topics')
  }
}
