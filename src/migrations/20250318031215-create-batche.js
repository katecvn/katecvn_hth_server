'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Batches', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      variantId: { allowNull: false, type: Sequelize.INTEGER },
      supplierId: { type: Sequelize.INTEGER },
      code: { type: Sequelize.STRING, unique: true },
      unit: { type: Sequelize.STRING(50) },
      quantity: { allowNull: false, type: Sequelize.FLOAT },
      costPrice: { allowNull: false, type: Sequelize.DECIMAL(20, 2) },
      mfgDate: { type: Sequelize.DATE },
      expDate: { type: Sequelize.DATE },
      createdBy: { type: Sequelize.INTEGER },
      updatedBy: { type: Sequelize.INTEGER },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE },
      deletedAt: { type: Sequelize.DATE }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Batches')
  }
}
