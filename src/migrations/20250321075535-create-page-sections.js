'use strict'
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PageSections', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      pageId: { type: Sequelize.INTEGER, allowNull: true },
      sectionType: { type: Sequelize.STRING(255), comment: 'image, video, form, custom' },
      content: { type: Sequelize.TEXT, allowNull: false },
      position: { type: Sequelize.INTEGER },
      createdBy: { type: Sequelize.INTEGER },
      updatedBy: { type: Sequelize.INTEGER },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE },
      deletedAt: { type: Sequelize.DATE }
    })
  },
  async down(queryInterface) {
    await queryInterface.dropTable('PageSections')
  }
}
