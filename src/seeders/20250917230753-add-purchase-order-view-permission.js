'use strict'

const db = require('../models')

module.exports = {
  async up(queryInterface, Sequelize) {
    const timestamp = new Date()
    const transaction = await db.sequelize.transaction()

    const permissions = [
      {
        id: 128,
        parent_id: 47, 
        name: 'purchase_order_view',
        description: 'Xem danh sách đơn mua',
        created_at: timestamp,
        updated_at: timestamp
      }
    ]

    // Gán cho role_id = 2 (role user)
    const roleHasPermissions = permissions.map((p) => ({
      role_id: 2,
      permission_id: p.id
    }))

    try {
      await queryInterface.bulkInsert('Permissions', permissions, { transaction })
      await queryInterface.bulkInsert('RoleHasPermissions', roleHasPermissions, { transaction })
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await db.sequelize.transaction()
    try {
      await queryInterface.bulkDelete(
        'RoleHasPermissions',
        { role_id: 2, permission_id: 128 },
        { transaction }
      )
      await queryInterface.bulkDelete(
        'Permissions',
        { id: 128 },
        { transaction }
      )
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
}
