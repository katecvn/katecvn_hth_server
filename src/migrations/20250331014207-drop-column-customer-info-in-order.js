'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Orders', 'customerName')
    await queryInterface.removeColumn('Orders', 'customerPhone')
    await queryInterface.removeColumn('Orders', 'customerAddress')
    await queryInterface.removeColumn('Orders', 'customerEmail')
  },

  async down(queryInterface, Sequelize) {}
}
