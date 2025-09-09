const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  class Page extends Model {
    static associate(models) {
      this.hasMany(models.Page, { foreignKey: 'parentId', as: 'children' })
      this.belongsTo(models.Page, { foreignKey: 'parentId', as: 'parent' })
      this.hasMany(models.PageSection, { foreignKey: 'pageId', as: 'sections' })
    }
  }

  Page.init(
    {
      parentId: { type: DataTypes.INTEGER, allowNull: true },
      title: { type: DataTypes.STRING, allowNull: false },
      slug: { type: DataTypes.STRING, allowNull: false, unique: true },
      template: { type: DataTypes.STRING },
      content: { type: DataTypes.TEXT },
      metaTitle: { type: DataTypes.STRING },
      metaDescription: { type: DataTypes.TEXT },
      status: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'active' },
      createdBy: { type: DataTypes.INTEGER },
      updatedBy: { type: DataTypes.INTEGER },
      deletedAt: { type: DataTypes.DATE }
    },
    {
      sequelize,
      modelName: 'Page',
      tableName: 'Pages',
      paranoid: true, // Soft delete
      timestamps: true
    }
  )

  return Page
}
