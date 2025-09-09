'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ProductAttributes', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      categoryId: { type: Sequelize.INTEGER, references: { model: 'Categories', key: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
      unit: { type: Sequelize.STRING(50) },
      name: { allowNull: false, type: Sequelize.STRING },
      linkUrl: { type: Sequelize.STRING },
      createdBy: { type: Sequelize.INTEGER },
      updatedBy: { type: Sequelize.INTEGER },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE },
      deletedAt: { type: Sequelize.DATE }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ProductAttributes')
  }
}
