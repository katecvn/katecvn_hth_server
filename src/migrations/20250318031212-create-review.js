'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reviews', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      ableType: { allowNull: false, type: Sequelize.STRING(50), comment: 'product, post' },
      ableId: { allowNull: false, type: Sequelize.INTEGER },
      userId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      rating: { allowNull: false, type: Sequelize.INTEGER, comment: '1 - 5' },
      reviewText: { type: Sequelize.STRING },
      status: { allowNull: false, type: Sequelize.STRING(20), defaultValue: 'active', comment: 'active, lock' },
      createdBy: { type: Sequelize.INTEGER },
      updatedBy: { type: Sequelize.INTEGER },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE },
      deletedAt: { type: Sequelize.DATE }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Reviews')
  }
}
