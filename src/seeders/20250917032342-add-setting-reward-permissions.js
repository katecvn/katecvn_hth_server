'use strict'

const db = require('../models')

module.exports = {
  async up(queryInterface, Sequelize) {
    const timestamp = new Date()
    const transaction = await db.sequelize.transaction()

    const permissions = [
      { id: 116, parent_id: 113, name: 'setting_reward_rule', description: 'Cài đặt điểm thưởng', created_at: timestamp, updated_at: timestamp },
      { id: 117, parent_id: 113, name: 'reward_history_view', description: 'Xem lịch sử cộng điểm', created_at: timestamp, updated_at: timestamp }
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
        { role_id: 1, permission_id: { [Sequelize.Op.between]: [116, 117] } },
        { transaction }
      )
      await queryInterface.bulkDelete(
        'Permissions',
        { id: { [Sequelize.Op.between]: [116, 117] } },
        { transaction }
      )
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
}
