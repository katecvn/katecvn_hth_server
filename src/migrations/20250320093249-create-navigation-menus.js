module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('NavigationMenus', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      parentId: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'NavigationMenus', key: 'id' }, onDelete: 'SET NULL' },
      title: { type: Sequelize.STRING, allowNull: false },
      url: { type: Sequelize.STRING },
      position: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      status: { type: Sequelize.STRING(20), allowNull: false, defaultValue: 'active', comment: 'active, inactive' },
      createdBy: { type: Sequelize.INTEGER },
      updatedBy: { type: Sequelize.INTEGER },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE },
      deletedAt: { type: Sequelize.DATE }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('NavigationMenus')
  }
}
