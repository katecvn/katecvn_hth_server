'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'Comments',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        parentId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'Comments',
            key: 'id'
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        userId: {
          allowNull: false,
          type: Sequelize.BIGINT,
          allowNull: false,
          references: { model: 'Users', key: 'id' },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        ableType: {
          allowNull: false,
          type: Sequelize.STRING(50),
          comment: 'product, post'
        },
        ableId: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        content: {
          allowNull: false,
          type: Sequelize.STRING
        },
        status: {
          allowNull: false,
          type: Sequelize.STRING(20),
          defaultValue: 'active',
          comment: 'active, lock'
        },
        createdBy: { type: Sequelize.INTEGER },
        updatedBy: { type: Sequelize.INTEGER },
        createdAt: { type: Sequelize.DATE },
        updatedAt: { type: Sequelize.DATE },
        deletedAt: { type: Sequelize.DATE }
      },
      {
        charset: 'utf8',
        collate: 'utf8_unicode_ci'
      }
    )
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Comments')
  }
}
