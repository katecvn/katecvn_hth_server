'use strict'

const db = require('../models')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const timestamp = new Date()
    const permissions = [
      { id: 36, name: 'topic', description: 'Chủ đề', created_at: timestamp, updated_at: timestamp },
      { id: 37, parent_id: 36, name: 'topic_create', description: 'Thêm', created_at: timestamp, updated_at: timestamp },
      { id: 38, parent_id: 36, name: 'topic_view', description: 'Xem danh sách', created_at: timestamp, updated_at: timestamp },
      { id: 39, parent_id: 36, name: 'topic_detail', description: 'Xem chi tiết', created_at: timestamp, updated_at: timestamp },
      { id: 40, parent_id: 36, name: 'topic_update', description: 'Cập nhật', created_at: timestamp, updated_at: timestamp },
      { id: 41, parent_id: 36, name: 'topic_delete', description: 'Xóa', created_at: timestamp, updated_at: timestamp },
      { id: 42, parent_id: 36, name: 'topic_manage_status', description: 'Kích hoạt/ Vô hiệu hóa', created_at: timestamp, updated_at: timestamp },

      { id: 43, name: 'comment', description: 'Bình luận', created_at: timestamp, updated_at: timestamp },
      { id: 44, parent_id: 43, name: 'comment_update', description: 'Cập nhật', created_at: timestamp, updated_at: timestamp },
      { id: 45, parent_id: 43, name: 'comment_delete', description: 'Xóa', created_at: timestamp, updated_at: timestamp },
      { id: 46, parent_id: 43, name: 'comment_manage_status', description: 'Kích hoạt/ Vô hiệu hóa', created_at: timestamp, updated_at: timestamp }
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
    await queryInterface.bulkDelete('Permissions', { id: 36, name: 'topic' }, {})
    await queryInterface.bulkDelete('Permissions', { id: 43, name: 'comment' }, {})
    await queryInterface.bulkDelete('Permissions', { parent_id: 36 }, {})
    await queryInterface.bulkDelete('Permissions', { parent_id: 43 }, {})
  }
}
