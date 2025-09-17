'use strict'

const db = require('../models')

module.exports = {
  async up(queryInterface, Sequelize) {
    const timestamp = new Date()
    const transaction = await db.sequelize.transaction()

    const permissions = [
      { id: 119, name: 'setting', description: 'Cài đặt', created_at: timestamp, updated_at: timestamp },
      { id: 120, parent_id: 119, name: 'setting_menu', description: 'Cài đặt menu', created_at: timestamp, updated_at: timestamp },
      { id: 121, parent_id: 119, name: 'setting_page', description: 'Cài đặt trang', created_at: timestamp, updated_at: timestamp }
    ]

    const roleHasPermissions = permissions.map((p) => ({
      role_id: 1,
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
        { role_id: 1, permission_id: { [Sequelize.Op.between]: [119, 121] } },
        { transaction }
      )
      await queryInterface.bulkDelete(
        'Permissions',
        { id: { [Sequelize.Op.between]: [119, 121] } },
        { transaction }
      )
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
}
