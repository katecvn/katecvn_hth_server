'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Orders', 'subTotal', {
      type: Sequelize.DECIMAL(20, 2)
    })
    await queryInterface.addColumn('Orders', 'discountAmount', {
      type: Sequelize.DECIMAL(20, 2)
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Orders', 'subTotal')
    await queryInterface.removeColumn('Orders', 'discountAmount')
  }
}
