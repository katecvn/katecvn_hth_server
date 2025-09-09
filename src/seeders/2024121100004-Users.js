'use strict'
const bcrypt = require('bcryptjs')

module.exports = {
  async up(queryInterface, Sequelize) {
    const timestamp = new Date()

    const data = [
      {
        id: 1,
        full_name: 'Quản lý',
        email: 'example@gmail.com',
        username: 'admin',
        user_type: 'admin',
        password: bcrypt.hashSync('123456', 10),
        phone_number: '0123456789',
        status: 'active',
        created_at: timestamp,
        updated_at: timestamp
      }
    ]

    await queryInterface.bulkInsert('Users', data)
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', { id: 1 })
  }
}
