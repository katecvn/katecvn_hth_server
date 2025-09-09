'use strict';

const db = require('../models')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const timestamp = new Date()
    const permissions = [
      // Đơn hàng
      { id: 47, name: 'order', description: 'Đơn hàng', created_at: timestamp, updated_at: timestamp },
      { id: 48, parent_id: 47, name: 'order_create', description: 'Tạo đơn hàng', created_at: timestamp, updated_at: timestamp },
      { id: 49, parent_id: 47, name: 'order_view', description: 'Xem danh sách đơn hàng', created_at: timestamp, updated_at: timestamp },
      { id: 50, parent_id: 47, name: 'order_detail', description: 'Xem chi tiết đơn hàng', created_at: timestamp, updated_at: timestamp },
      { id: 51, parent_id: 47, name: 'order_update', description: 'Cập nhật đơn hàng', created_at: timestamp, updated_at: timestamp },
      { id: 52, parent_id: 47, name: 'order_delete', description: 'Xóa đơn hàng', created_at: timestamp, updated_at: timestamp },
      { id: 53, parent_id: 47, name: 'order_manage_status', description: 'Quản lý trạng thái đơn hàng', created_at: timestamp, updated_at: timestamp },

      // Giảm giá
      { id: 54, name: 'discount', description: 'Giảm giá', created_at: timestamp, updated_at: timestamp },
      { id: 55, parent_id: 54, name: 'discount_create', description: 'Tạo mã giảm giá', created_at: timestamp, updated_at: timestamp },
      { id: 56, parent_id: 54, name: 'discount_view', description: 'Xem danh sách mã giảm giá', created_at: timestamp, updated_at: timestamp },
      { id: 57, parent_id: 54, name: 'discount_detail', description: 'Xem chi tiết mã giảm giá', created_at: timestamp, updated_at: timestamp },
      { id: 58, parent_id: 54, name: 'discount_update', description: 'Cập nhật mã giảm giá', created_at: timestamp, updated_at: timestamp },
      { id: 59, parent_id: 54, name: 'discount_delete', description: 'Xóa mã giảm giá', created_at: timestamp, updated_at: timestamp },
      { id: 60, parent_id: 54, name: 'discount_manage_status', description: 'Quản lý trạng thái mã giảm giá', created_at: timestamp, updated_at: timestamp },

      // Liên hệ
      { id: 61, name: 'contact', description: 'Liên hệ', created_at: timestamp, updated_at: timestamp },
      { id: 62, parent_id: 61, name: 'contact_create', description: 'Tạo liên hệ', created_at: timestamp, updated_at: timestamp },
      { id: 63, parent_id: 61, name: 'contact_view', description: 'Xem danh sách liên hệ', created_at: timestamp, updated_at: timestamp },
      { id: 64, parent_id: 61, name: 'contact_update', description: 'Cập nhật liên hệ', created_at: timestamp, updated_at: timestamp },
      { id: 65, parent_id: 61, name: 'contact_delete', description: 'Xóa liên hệ', created_at: timestamp, updated_at: timestamp },
      { id: 66, parent_id: 61, name: 'contact_manage_status', description: 'Quản lý trạng thái liên hệ', created_at: timestamp, updated_at: timestamp },

      // Tập tin
      { id: 67, name: 'file', description: 'Tập tin', created_at: timestamp, updated_at: timestamp },
      { id: 68, parent_id: 67, name: 'file_upload', description: 'Tải lên tập tin', created_at: timestamp, updated_at: timestamp },
      { id: 69, parent_id: 67, name: 'file_view', description: 'Xem danh sách tập tin', created_at: timestamp, updated_at: timestamp },
      { id: 70, parent_id: 67, name: 'file_update', description: 'Cập nhật tập tin', created_at: timestamp, updated_at: timestamp },
      { id: 71, parent_id: 67, name: 'file_delete', description: 'Xóa tập tin', created_at: timestamp, updated_at: timestamp },

      // Thanh toán
      { id: 72, name: 'payment', description: 'Thanh toán', created_at: timestamp, updated_at: timestamp },
      { id: 73, parent_id: 72, name: 'payment_create', description: 'Tạo giao dịch thanh toán', created_at: timestamp, updated_at: timestamp },
      { id: 74, parent_id: 72, name: 'payment_view', description: 'Xem danh sách giao dịch', created_at: timestamp, updated_at: timestamp },
      { id: 75, parent_id: 72, name: 'payment_update', description: 'Cập nhật giao dịch', created_at: timestamp, updated_at: timestamp },
      { id: 76, parent_id: 72, name: 'payment_delete', description: 'Xóa giao dịch', created_at: timestamp, updated_at: timestamp },
      { id: 77, parent_id: 72, name: 'payment_manage_status', description: 'Quản lý trạng thái giao dịch', created_at: timestamp, updated_at: timestamp },

      // Vận chuyển
      { id: 78, name: 'shipping', description: 'Vận chuyển', created_at: timestamp, updated_at: timestamp },
      { id: 79, parent_id: 78, name: 'shipping_create', description: 'Tạo đơn vận chuyển', created_at: timestamp, updated_at: timestamp },
      { id: 80, parent_id: 78, name: 'shipping_view', description: 'Xem danh sách vận chuyển', created_at: timestamp, updated_at: timestamp },
      { id: 81, parent_id: 78, name: 'shipping_update', description: 'Cập nhật đơn vận chuyển', created_at: timestamp, updated_at: timestamp },
      { id: 82, parent_id: 78, name: 'shipping_delete', description: 'Xóa đơn vận chuyển', created_at: timestamp, updated_at: timestamp },
      { id: 83, parent_id: 78, name: 'shipping_manage_status', description: 'Quản lý trạng thái vận chuyển', created_at: timestamp, updated_at: timestamp },
    ];

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
    const transaction = await db.sequelize.transaction();
    try {
      await queryInterface.bulkDelete('Permissions', {
        id: {
          [Sequelize.Op.between]: [47, 83] // Xóa các permission từ id 47 đến 83
        }
      }, { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
