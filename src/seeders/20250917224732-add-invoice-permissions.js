'use strict'

const db = require('../models')

module.exports = {
  async up(queryInterface, Sequelize) {
    const timestamp = new Date()
    const transaction = await db.sequelize.transaction()

    const permissions = [
      { id: 122, name: 'invoice', description: 'Hóa đơn', created_at: timestamp, updated_at: timestamp },
      { id: 123, parent_id: 122, name: 'invoice_view', description: 'Xem hóa đơn', created_at: timestamp, updated_at: timestamp },
      { id: 124, parent_id: 122, name: 'invoice_create', description: 'Tạo hóa đơn', created_at: timestamp, updated_at: timestamp },
      { id: 125, parent_id: 122, name: 'invoice_update', description: 'Cập nhật hóa đơn', created_at: timestamp, updated_at: timestamp },
      { id: 126, parent_id: 122, name: 'invoice_manage_status', description: 'Quản lý trạng thái hóa đơn', created_at: timestamp, updated_at: timestamp },
      { id: 127, parent_id: 122, name: 'invoice_delete', description: 'Xóa hóa đơn', created_at: timestamp, updated_at: timestamp }
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
        { role_id: 1, permission_id: { [Sequelize.Op.between]: [122, 127] } },
        { transaction }
      )
      await queryInterface.bulkDelete(
        'Permissions',
        { id: { [Sequelize.Op.between]: [122, 127] } },
        { transaction }
      )
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
}
