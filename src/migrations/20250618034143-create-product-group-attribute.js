'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'ProductGroupAttributes',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
        },
        groupId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'ProductGroups',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        attributeId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Attributes',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        }
      },
      {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci'
      }
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ProductGroupAttributes')
  }
}
