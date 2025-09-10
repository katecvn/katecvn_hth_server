'use strict'

const db = require('../models')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const timestamp = new Date()
    const transaction = await db.sequelize.transaction()

    // Quyền CustomerGroup
    const permissions = [
      { id: 98, name: 'customer_group', description: 'Nhóm khách hàng', created_at: timestamp, updated_at: timestamp },
      { id: 99, parent_id: 98, name: 'customer_group_create', description: 'Tạo nhóm khách hàng', created_at: timestamp, updated_at: timestamp },
      { id: 100, parent_id: 98, name: 'customer_group_view', description: 'Xem danh sách nhóm khách hàng', created_at: timestamp, updated_at: timestamp },
      { id: 101, parent_id: 98, name: 'customer_group_detail', description: 'Xem chi tiết nhóm khách hàng', created_at: timestamp, updated_at: timestamp },
      { id: 102, parent_id: 98, name: 'customer_group_update', description: 'Cập nhật nhóm khách hàng', created_at: timestamp, updated_at: timestamp },
      { id: 103, parent_id: 98, name: 'customer_group_delete', description: 'Xóa nhóm khách hàng', created_at: timestamp, updated_at: timestamp }
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
        {
          role_id: 1,
          permission_id: {
            [Sequelize.Op.between]: [98, 103]
          }
        },
        { transaction }
      )

      await queryInterface.bulkDelete(
        'Permissions',
        {
          id: {
            [Sequelize.Op.between]: [98, 103]
          }
        },
        { transaction }
      )

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
}
