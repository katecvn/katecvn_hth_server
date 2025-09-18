'use strict'

const db = require('../models')

module.exports = {
  async up(queryInterface, Sequelize) {
    const timestamp = new Date()
    const transaction = await db.sequelize.transaction()

    const permissions = [
      {
        id: 129,
        parent_id: 113,
        name: 'reward_point_overview_view',
        description: 'Xem điểm thưởng',
        created_at: timestamp,
        updated_at: timestamp,
      },
      {
        id: 130,
        parent_id: 113,
        name: 'reward_point_history_list_view',
        description: 'Xem danh sách lịch sử cộng điểm',
        created_at: timestamp,
        updated_at: timestamp,
      },
    ]

    const roleHasPermissions = [
      { role_id: 2, permission_id: 129 },
      { role_id: 1, permission_id: 130 },
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
        { permission_id: { [Sequelize.Op.in]: [129, 130] } },
        { transaction }
      )
      await queryInterface.bulkDelete(
        'Permissions',
        { id: { [Sequelize.Op.in]: [129, 130] } },
        { transaction }
      )
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },
}
