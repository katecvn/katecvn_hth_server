'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('ProductOptions', 'categoryId')
    await queryInterface.addColumn('ProductOptions', 'imageUrl', {
      type: Sequelize.STRING,
      allowNull: true
    })
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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('ProductOptions', 'groupId')
    await queryInterface.removeColumn('ProductOptions', 'imageUrl')
    await queryInterface.addColumn('ProductOptions', 'categoryId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Categories',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    })
  }
}
