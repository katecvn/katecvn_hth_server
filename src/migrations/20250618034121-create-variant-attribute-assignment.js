'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'VariantAttributeAssignments',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
        },
        variantId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'ProductVariants',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        attributeValueId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'AttributeValues',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        customValue: {
          type: Sequelize.STRING,
          allowNull: true
        }
      },
      {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci'
      }
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('VariantAttributeAssignments')
  }
}
