'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    // Xóa cột groupId khỏi bảng ProductOptions
    await queryInterface.removeColumn('ProductOptions', 'groupId')
  },

  async down(queryInterface, Sequelize) {
    // Khôi phục lại cột groupId nếu cần rollback
    await queryInterface.addColumn('ProductOptions', 'groupId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'ProductGroups',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    })
  }
}
