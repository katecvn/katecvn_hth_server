'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    const timestamp = new Date()

    const permissions = [
      { id: 1, name: 'user', description: 'Quản lý người dùng', created_at: timestamp, updated_at: timestamp },
      { id: 2, parent_id: 1, name: 'user_create', description: 'Thêm', created_at: timestamp, updated_at: timestamp },
      { id: 3, parent_id: 1, name: 'user_view', description: 'Xem danh sách', created_at: timestamp, updated_at: timestamp },
      { id: 4, parent_id: 1, name: 'user_detail', description: 'Xem chi tiết', created_at: timestamp, updated_at: timestamp },
      { id: 5, parent_id: 1, name: 'user_update', description: 'Cập nhật', created_at: timestamp, updated_at: timestamp },
      { id: 6, parent_id: 1, name: 'user_delete', description: 'Xóa', created_at: timestamp, updated_at: timestamp },
      { id: 7, parent_id: 1, name: 'user_manage_role', description: 'Phân quyền', created_at: timestamp, updated_at: timestamp },
      { id: 8, parent_id: 1, name: 'user_manage_status', description: 'Kích hoạt / vô hiệu hóa', created_at: timestamp, updated_at: timestamp },

      { id: 9, name: 'permission', description: 'Quản lý phân quyền', created_at: timestamp, updated_at: timestamp },
      { id: 10, parent_id: 9, name: 'permission_create', description: 'Thêm', created_at: timestamp, updated_at: timestamp },
      { id: 11, parent_id: 9, name: 'permission_view', description: 'Xem', created_at: timestamp, updated_at: timestamp },
      { id: 12, parent_id: 9, name: 'permission_update', description: 'Cập nhật', created_at: timestamp, updated_at: timestamp },
      { id: 13, parent_id: 9, name: 'permission_delete', description: 'Xóa', created_at: timestamp, updated_at: timestamp },

      { id: 14, name: 'role', description: 'Quản lý vai trò', created_at: timestamp, updated_at: timestamp },
      { id: 15, parent_id: 14, name: 'role_create', description: 'Thêm', created_at: timestamp, updated_at: timestamp },
      { id: 16, parent_id: 14, name: 'role_view', description: 'Xem danh sách', created_at: timestamp, updated_at: timestamp },
      { id: 17, parent_id: 14, name: 'role_detail', description: 'Xem chi tiết', created_at: timestamp, updated_at: timestamp },
      { id: 18, parent_id: 14, name: 'role_update', description: 'Cập nhật', created_at: timestamp, updated_at: timestamp },
      { id: 19, parent_id: 14, name: 'role_delete', description: 'Xóa', created_at: timestamp, updated_at: timestamp },
      { id: 20, parent_id: 14, name: 'role_manage_permission', description: 'Gán quyền', created_at: timestamp, updated_at: timestamp },

      { id: 21, name: 'post', description: 'Quản lý bài viết', created_at: timestamp, updated_at: timestamp },
      { id: 22, parent_id: 21, name: 'post_create', description: 'Thêm', created_at: timestamp, updated_at: timestamp },
      { id: 23, parent_id: 21, name: 'post_view', description: 'Xem danh sách', created_at: timestamp, updated_at: timestamp },
      { id: 24, parent_id: 21, name: 'post_detail', description: 'Xem chi tiết', created_at: timestamp, updated_at: timestamp },
      { id: 25, parent_id: 21, name: 'post_update', description: 'Cập nhật', created_at: timestamp, updated_at: timestamp },
      { id: 26, parent_id: 21, name: 'post_delete', description: 'Xóa', created_at: timestamp, updated_at: timestamp },
      { id: 27, parent_id: 21, name: 'post_status', description: 'Duyệt', created_at: timestamp, updated_at: timestamp },

      { id: 29, name: 'product', description: 'Quản lý sản phẩm', created_at: timestamp, updated_at: timestamp },
      { id: 30, parent_id: 29, name: 'product_create', description: 'Thêm', created_at: timestamp, updated_at: timestamp },
      { id: 31, parent_id: 29, name: 'product_view', description: 'Xem danh sách', created_at: timestamp, updated_at: timestamp },
      { id: 32, parent_id: 29, name: 'product_detail', description: 'Xem chi tiết', created_at: timestamp, updated_at: timestamp },
      { id: 33, parent_id: 29, name: 'product_update', description: 'Cập nhật', created_at: timestamp, updated_at: timestamp },
      { id: 34, parent_id: 29, name: 'product_delete', description: 'Xóa', created_at: timestamp, updated_at: timestamp },
      { id: 35, parent_id: 29, name: 'product_manage_status', description: 'Kích hoạt / vô hiệu hóa', created_at: timestamp, updated_at: timestamp }
    ]

    await queryInterface.bulkInsert('Permissions', permissions)
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Permissions', null, {})
  }
}
