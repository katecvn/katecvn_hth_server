'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Categories', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      parentId: { type: Sequelize.INTEGER, references: { model: 'Categories', key: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
      name: { allowNull: false, type: Sequelize.STRING },
      level: { type: Sequelize.INTEGER },
      thumbnail: { type: Sequelize.STRING },
      createdBy: { type: Sequelize.INTEGER },
      updatedBy: { type: Sequelize.INTEGER },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE },
      deletedAt: { type: Sequelize.DATE }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Categories')
  }
}
