'use strict'

const db = require('../models')

module.exports = {
  async up(queryInterface, Sequelize) {
    const timestamp = new Date()
    const transaction = await db.sequelize.transaction()

    const permissions = [
      {
        id: 131,
        parent_id: 122,
        name: 'invoice_export',
        description: 'Xuất hóa đơn',
        created_at: timestamp,
        updated_at: timestamp,
      },
    ]

    const roleHasPermissions = [
      { role_id: 2, permission_id: 131 },
    ]

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
        { role_id: 2, permission_id: 131 },
        { transaction }
      )
      await queryInterface.bulkDelete(
        'Permissions',
        { id: 131 },
        { transaction }
      )
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },
}
