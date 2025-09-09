'use strict'

const db = require('../models')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await db.sequelize.transaction()

    const roleHasPermissions = []

    // Tạo danh sách quyền từ 84 đến 97
    for (let permissionId = 84; permissionId <= 97; permissionId++) {
      roleHasPermissions.push({ role_id: 1, permission_id: permissionId })
    }

    try {
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
            [Sequelize.Op.between]: [84, 97] // Xóa các quyền từ 84 đến 97
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
