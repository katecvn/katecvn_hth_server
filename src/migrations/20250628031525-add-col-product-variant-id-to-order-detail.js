'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Xóa cột productId
    await queryInterface.removeColumn('OrderDetails', 'productId')

    // Thêm cột productVariantId
    await queryInterface.addColumn('OrderDetails', 'productVariantId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'ProductVariants',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    })

    // Thêm cột attributes dạng text
    await queryInterface.addColumn('OrderDetails', 'attributes', {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Thuộc tính mô tả chi tiết của sản phẩm, lưu dạng JSON string nếu cần'
    })
  },

  async down(queryInterface, Sequelize) {
    // Thêm lại cột productId
    await queryInterface.addColumn('OrderDetails', 'productId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Products',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    })

    // Xóa cột productVariantId
    await queryInterface.removeColumn('OrderDetails', 'productVariantId')

    // Xóa cột attributes
    await queryInterface.removeColumn('OrderDetails', 'attributes')
  }
}
