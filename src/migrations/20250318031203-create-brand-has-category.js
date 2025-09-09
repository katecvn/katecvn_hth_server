'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('BrandHasCategories', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      categoryId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Categories', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      brandId: { allowNull: false, type: Sequelize.INTEGER, references: { model: 'Brands', key: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('BrandHasCategories')
  }
}
