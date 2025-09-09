'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Shippings', 'customerName', {
      type: Sequelize.STRING(100),
      allowNull: false
    })

    await queryInterface.addColumn('Shippings', 'customerPhone', {
      type: Sequelize.STRING(50),
      allowNull: false
    })

    await queryInterface.addColumn('Shippings', 'customerAddress', {
      type: Sequelize.STRING,
      allowNull: false
    })

    await queryInterface.addColumn('Shippings', 'customerEmail', {
      type: Sequelize.STRING(50),
      allowNull: true
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Shippings', 'customerName')
    await queryInterface.removeColumn('Shippings', 'customerPhone')
    await queryInterface.removeColumn('Shippings', 'customerAddress')
    await queryInterface.removeColumn('Shippings', 'customerEmail')
  }
}
