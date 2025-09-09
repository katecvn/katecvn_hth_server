'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Orders', 'customerId', {
      type: Sequelize.BIGINT,
      allowNull: true
    })
  },

  async down(queryInterface, Sequelize) {
    // Nếu muốn revert lại về NOT NULL, chỉnh lại allowNull: false
    await queryInterface.changeColumn('Orders', 'customerId', {
      type: Sequelize.BIGINT,
      allowNull: false
    })
  }
}
