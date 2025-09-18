'use strict'

const db = require('../models')

module.exports = {
  async up(queryInterface, Sequelize) {
    const timestamp = new Date()
    const transaction = await db.sequelize.transaction()

    const permissions = [
      { id: 113, name: 'reward', description: 'Điểm thưởng', created_at: timestamp, updated_at: timestamp },
      { id: 114, parent_id: 113, name: 'reward_rule_view', description: 'Xem cài đặt điểm thưởng', created_at: timestamp, updated_at: timestamp },
      { id: 115, parent_id: 113, name: 'reward_rule_create', description: 'Tạo cài đặt điểm thưởng', created_at: timestamp, updated_at: timestamp },
      { id: 116, parent_id: 113, name: 'reward_rule_update', description: 'Cập nhật cài đặt điểm thưởng', created_at: timestamp, updated_at: timestamp },
      { id: 117, parent_id: 113, name: 'reward_rule_delete', description: 'Xóa cài đặt điểm thưởng', created_at: timestamp, updated_at: timestamp },
      { id: 118, parent_id: 113, name: 'reward_history_view', description: 'Xem lịch sử cộng điểm', created_at: timestamp, updated_at: timestamp }
    ]

    const roleHasPermissions = [
      { role_id: 1, permission_id: 113 },
      { role_id: 1, permission_id: 114 },
      { role_id: 1, permission_id: 115 },
      { role_id: 1, permission_id: 116 },
      { role_id: 1, permission_id: 117 },
      { role_id: 2, permission_id: 118 }
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
        { permission_id: { [Sequelize.Op.between]: [113, 118] } },
        { transaction }
      )
      await queryInterface.bulkDelete(
        'Permissions',
        { id: { [Sequelize.Op.between]: [113, 118] } },
        { transaction }
      )
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
}
