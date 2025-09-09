'use strict'
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Pages', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      parentId: { type: Sequelize.INTEGER, allowNull: true },
      title: { type: Sequelize.STRING(255), allowNull: false },
      slug: { type: Sequelize.STRING(255), allowNull: false, unique: true },
      template: { type: Sequelize.STRING(255) },
      content: { type: Sequelize.TEXT },
      metaTitle: { type: Sequelize.STRING(255) },
      metaDescription: { type: Sequelize.STRING },
      status: { type: Sequelize.STRING(20), allowNull: false, defaultValue: 'active', comment: 'active, inactive' },
      createdBy: { type: Sequelize.INTEGER },
      updatedBy: { type: Sequelize.INTEGER },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE },
      deletedAt: { type: Sequelize.DATE }
    })
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Pages')
  }
}
