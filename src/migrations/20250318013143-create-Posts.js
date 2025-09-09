'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'Posts',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.BIGINT
        },
        author_id: {
          type: Sequelize.BIGINT,
          allowNull: true,
          references: {
            model: 'Users',
            key: 'id'
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        title: {
          type: Sequelize.STRING(255),
          allowNull: false
        },
        slug: {
          type: Sequelize.STRING(255),
          allowNull: false
        },
        content: {
          type: Sequelize.TEXT
        },
        thumbnail: {
          type: Sequelize.STRING(255),
          allowNull: true
        },
        status: {
          type: Sequelize.STRING(20),
          defaultValue: 'pending'
        },
        published_at: {
          type: Sequelize.DATE
        },
        meta_title: {
          type: Sequelize.STRING(255),
          allowNull: true
        },
        meta_description: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        meta_keywords: {
          type: Sequelize.STRING(255),
          allowNull: true
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
    await queryInterface.dropTable('Posts')
  }
}
