'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // await queryInterface.removeColumn('InventoryReceiptDetails', 'variantId')
    await queryInterface.addColumn('InventoryReceiptDetails', 'productId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Products',
        key: 'id'
      }
    })
    await queryInterface.changeColumn('InventoryReceiptDetails', 'receiptId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'InventoryReceipts',
        key: 'id'
      }
    })
    await queryInterface.changeColumn('InventoryReceiptDetails', 'batchId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Batches',
        key: 'id'
      }
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('InventoryReceiptDetails', 'variantId', {
      type: Sequelize.INTEGER,
      allowNull: true
    })
    await queryInterface.removeColumn('InventoryReceiptDetails', 'productId')
    await queryInterface.changeColumn('InventoryReceiptDetails', 'receiptId', {
      type: Sequelize.INTEGER,
      allowNull: true
    })
    await queryInterface.changeColumn('InventoryReceiptDetails', 'batchId', {
      type: Sequelize.INTEGER,
      allowNull: true
    })
  }
}
