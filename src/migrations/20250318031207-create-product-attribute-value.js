'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ProductAttributeValues', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      productId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Products', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      attributeId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'ProductAttributes', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      value: { allowNull: false, type: Sequelize.STRING }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ProductAttributeValues')
  }
}
