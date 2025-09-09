'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    const userRoles = [
      { id: 1, user_id: 1, role_id: 1 } // User ID 1 là Admin
    ]

    await queryInterface.bulkInsert('UserHasRoles', userRoles)
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('UserHasRoles', null, {})
  }
}
