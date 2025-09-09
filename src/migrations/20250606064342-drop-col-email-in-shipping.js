'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Shippings', 'customerEmail')
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('Shippings', 'customerEmail', {
      type: Sequelize.STRING,
      allowNull: true
    })
  }
}
