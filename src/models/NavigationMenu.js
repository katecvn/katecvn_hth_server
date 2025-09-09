const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  class NavigationMenu extends Model {
    static associate(models) {
      this.hasMany(models.NavigationMenu, { foreignKey: 'parentId', as: 'children' })
      this.belongsTo(models.NavigationMenu, { foreignKey: 'parentId', as: 'parent' })
    }
  }

  NavigationMenu.init(
    {
      parentId: { type: DataTypes.INTEGER, allowNull: true },
      title: { type: DataTypes.STRING, allowNull: false },
      url: { type: DataTypes.STRING },
      position: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      status: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'active' },
      createdBy: { type: DataTypes.INTEGER },
      updatedBy: { type: DataTypes.INTEGER },
      deletedAt: { type: DataTypes.DATE }
    },
    {
      sequelize,
      modelName: 'NavigationMenu',
      tableName: 'NavigationMenus',
      paranoid: true, // Soft delete
      timestamps: true
    }
  )

  return NavigationMenu
}
