'use strict'

const db = require('../models')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await db.sequelize.transaction()

    const roleHasPermissions = [
      { role_id: 1, permission_id: 36 },
      { role_id: 1, permission_id: 37 },
      { role_id: 1, permission_id: 38 },
      { role_id: 1, permission_id: 39 },
      { role_id: 1, permission_id: 40 },
      { role_id: 1, permission_id: 41 },
      { role_id: 1, permission_id: 42 },

      { role_id: 1, permission_id: 43 },
      { role_id: 1, permission_id: 44 },
      { role_id: 1, permission_id: 45 },
      { role_id: 1, permission_id: 46 }
    ]

    try {
      await queryInterface.bulkInsert('RoleHasPermissions', roleHasPermissions, { transaction })
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },

  async down(queryInterface, Sequelize) {
    const roleHasPermissions = [
      { role_id: 1, permission_id: 36 },
      { role_id: 1, permission_id: 37 },
      { role_id: 1, permission_id: 38 },
      { role_id: 1, permission_id: 39 },
      { role_id: 1, permission_id: 40 },
      { role_id: 1, permission_id: 41 },
      { role_id: 1, permission_id: 42 },
      { role_id: 1, permission_id: 43 },
      { role_id: 1, permission_id: 44 },
      { role_id: 1, permission_id: 45 },
      { role_id: 1, permission_id: 46 }
    ]

    await queryInterface.bulkDelete(
      'RoleHasPermissions',
      {
        role_id: 1,
        permission_id: roleHasPermissions.map((perm) => perm.permission_id)
      },
      {}
    )
  }
}
