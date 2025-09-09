'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Categories', 'iconUrl', {
      type: Sequelize.STRING,
      allowNull: true
    })

    await queryInterface.addColumn('Brands', 'iconUrl', {
      type: Sequelize.STRING,
      allowNull: true
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Categories', 'iconUrl')

    await queryInterface.removeColumn('Brands', 'iconUrl')
  }
}
