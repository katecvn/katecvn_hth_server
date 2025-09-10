'use strict'

const db = require('../models')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const timestamp = new Date()
    const transaction = await db.sequelize.transaction()

    const permissions = [
      { id: 104, name: 'customer_group_discount', description: 'Giảm giá nhóm khách hàng', created_at: timestamp, updated_at: timestamp },
      { id: 105, parent_id: 104, name: 'customer_group_discount_create', description: 'Tạo giảm giá nhóm khách hàng', created_at: timestamp, updated_at: timestamp },
      { id: 106, parent_id: 104, name: 'customer_group_discount_view', description: 'Xem danh sách giảm giá nhóm khách hàng', created_at: timestamp, updated_at: timestamp },
      { id: 107, parent_id: 104, name: 'customer_group_discount_detail', description: 'Xem chi tiết giảm giá nhóm khách hàng', created_at: timestamp, updated_at: timestamp },
      { id: 108, parent_id: 104, name: 'customer_group_discount_update', description: 'Cập nhật giảm giá nhóm khách hàng', created_at: timestamp, updated_at: timestamp },
      { id: 109, parent_id: 104, name: 'customer_group_discount_delete', description: 'Xóa giảm giá nhóm khách hàng', created_at: timestamp, updated_at: timestamp }
    ]

    const roleHasPermissions = permissions.map((p) => ({
      role_id: 1, // admin
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
        { role_id: 1, permission_id: { [Sequelize.Op.between]: [104, 109] } },
        { transaction }
      )
      await queryInterface.bulkDelete(
        'Permissions',
        { id: { [Sequelize.Op.between]: [104, 109] } },
        { transaction }
      )
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
}
