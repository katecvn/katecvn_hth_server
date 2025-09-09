'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('InventoryReceiptDetails', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      variantId: { type: Sequelize.INTEGER },
      receiptId: { type: Sequelize.INTEGER },
      batchId: { type: Sequelize.INTEGER },
      quantity: { type: Sequelize.FLOAT },
      price: { type: Sequelize.DECIMAL(20, 2) },
      reason: { type: Sequelize.STRING }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('InventoryReceiptDetails')
  }
}
