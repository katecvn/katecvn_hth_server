'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    const timestamp = new Date()

    const roles = [
      { id: 1, name: 'Admin', description: 'Quản trị viên', created_at: timestamp, updated_at: timestamp },
      { id: 2, name: 'User', description: 'Người dùng thông thường', created_at: timestamp, updated_at: timestamp }
    ]

    await queryInterface.bulkInsert('Roles', roles)
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Roles', null, {})
  }
}
