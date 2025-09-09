'use strict'

const db = require('../models')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const timestamp = new Date()
    const permissions = [
      // Bài tuyển dụng
      { id: 84, name: 'recruit_post', description: 'Bài tuyển dụng', created_at: timestamp, updated_at: timestamp },
      { id: 85, parent_id: 84, name: 'recruit_post_create', description: 'Tạo bài tuyển dụng', created_at: timestamp, updated_at: timestamp },
      { id: 86, parent_id: 84, name: 'recruit_post_view', description: 'Xem danh sách bài tuyển dụng', created_at: timestamp, updated_at: timestamp },
      {
        id: 87,
        parent_id: 84,
        name: 'recruit_post_detail',
        description: 'Xem chi tiết bài tuyển dụng',
        created_at: timestamp,
        updated_at: timestamp
      },
      { id: 88, parent_id: 84, name: 'recruit_post_update', description: 'Cập nhật bài tuyển dụng', created_at: timestamp, updated_at: timestamp },
      { id: 89, parent_id: 84, name: 'recruit_post_delete', description: 'Xóa bài tuyển dụng', created_at: timestamp, updated_at: timestamp },
      {
        id: 90,
        parent_id: 84,
        name: 'recruit_post_manage_status',
        description: 'Quản lý trạng thái bài tuyển dụng',
        created_at: timestamp,
        updated_at: timestamp
      },

      // Hồ sơ ứng tuyển
      { id: 91, name: 'candidate', description: 'Hồ sơ ứng tuyển', created_at: timestamp, updated_at: timestamp },
      { id: 92, parent_id: 91, name: 'candidate_create', description: 'Tạo hồ sơ ứng tuyển', created_at: timestamp, updated_at: timestamp },
      {
        id: 93,
        parent_id: 91,
        name: 'candidate_view',
        description: 'Xem danh sách hồ sơ ứng tuyển',
        created_at: timestamp,
        updated_at: timestamp
      },
      {
        id: 94,
        parent_id: 91,
        name: 'candidate_detail',
        description: 'Xem chi tiết hồ sơ ứng tuyển',
        created_at: timestamp,
        updated_at: timestamp
      },
      { id: 95, parent_id: 91, name: 'candidate_update', description: 'Cập nhật hồ sơ ứng tuyển', created_at: timestamp, updated_at: timestamp },
      { id: 96, parent_id: 91, name: 'candidate_delete', description: 'Xóa hồ sơ ứng tuyển', created_at: timestamp, updated_at: timestamp },
      {
        id: 97,
        parent_id: 91,
        name: 'candidate_manage_status',
        description: 'Quản lý trạng thái hồ sơ ứng tuyển',
        created_at: timestamp,
        updated_at: timestamp
      }
    ]

    const transaction = await db.sequelize.transaction()
    try {
      await queryInterface.bulkInsert('Permissions', permissions, { transaction })
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
        'Permissions',
        {
          id: {
            [Sequelize.Op.between]: [84, 97] // Xóa các permission từ id 84 đến 97
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
