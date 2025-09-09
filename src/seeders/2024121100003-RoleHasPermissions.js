'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    const rolePermissions = [
      { role_id: 1, permission_id: 1 }, // Quản lý người dùng
      { role_id: 1, permission_id: 2 }, // Thêm
      { role_id: 1, permission_id: 3 }, // Xem danh sách
      { role_id: 1, permission_id: 4 }, // Xem chi tiết
      { role_id: 1, permission_id: 5 }, // Cập nhật
      { role_id: 1, permission_id: 6 }, // Xóa
      { role_id: 1, permission_id: 7 }, // Phân quyền
      { role_id: 1, permission_id: 8 }, // Kích hoạt / vô hiệu hóa

      { role_id: 1, permission_id: 9 }, // Quản lý phân quyền
      { role_id: 1, permission_id: 10 }, // Thêm
      { role_id: 1, permission_id: 11 }, // Xem
      { role_id: 1, permission_id: 12 }, // Cập nhật
      { role_id: 1, permission_id: 13 }, // Xóa

      { role_id: 1, permission_id: 14 }, // Quản lý vai trò
      { role_id: 1, permission_id: 15 }, // Thêm
      { role_id: 1, permission_id: 16 }, // Xem danh sách
      { role_id: 1, permission_id: 17 }, // Xem chi tiết
      { role_id: 1, permission_id: 18 }, // Cập nhật
      { role_id: 1, permission_id: 19 }, // Xóa
      { role_id: 1, permission_id: 20 }, // Gán quyền

      { role_id: 1, permission_id: 21 }, // Quản lý bài viết
      { role_id: 1, permission_id: 22 }, // Thêm
      { role_id: 1, permission_id: 23 }, // Xem danh sách
      { role_id: 1, permission_id: 24 }, // Xem chi tiết
      { role_id: 1, permission_id: 25 }, // Cập nhật
      { role_id: 1, permission_id: 26 }, // Xóa
      { role_id: 1, permission_id: 27 }, // Xuất bản hoặc ẩn

      { role_id: 1, permission_id: 29 }, // Quản lý sản phẩm
      { role_id: 1, permission_id: 30 }, // Thêm
      { role_id: 1, permission_id: 31 }, // Xem danh sách
      { role_id: 1, permission_id: 32 }, // Xem chi tiết
      { role_id: 1, permission_id: 33 }, // Cập nhật
      { role_id: 1, permission_id: 34 }, // Xóa
      { role_id: 1, permission_id: 35 } // Kích hoạt / vô hiệu hóa
    ]

    await queryInterface.bulkInsert('RoleHasPermissions', rolePermissions)
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('RoleHasPermissions', null, {})
  }
}
