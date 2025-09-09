'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('InventoryReceipts', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      userId: { type: Sequelize.INTEGER },
      code: { type: Sequelize.STRING, unique: true },
      receiptType: { allowNull: false, type: Sequelize.STRING(20), comment: 'import, export' },
      dateTime: { type: Sequelize.DATE },
      status: { allowNull: false, type: Sequelize.STRING(20), comment: 'pending, completed, canceled' },
      notes: { type: Sequelize.STRING },
      createdBy: { type: Sequelize.INTEGER },
      updatedBy: { type: Sequelize.INTEGER },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('InventoryReceipts')
  }
}
