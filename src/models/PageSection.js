const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  class PageSection extends Model {
    static associate(models) {
      this.belongsTo(models.Page, { foreignKey: 'pageId', as: 'page' }) // Kết nối với Page
    }
  }

  PageSection.init(
    {
      pageId: { type: DataTypes.INTEGER, allowNull: false },
      sectionType: { type: DataTypes.STRING, allowNull: false },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        get() {
          const rawValue = this.getDataValue('content')
          return rawValue ? JSON.parse(rawValue) : null
        },
        set(value) {
          this.setDataValue('content', JSON.stringify(value))
        }
      },
      position: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      createdBy: { type: DataTypes.INTEGER },
      updatedBy: { type: DataTypes.INTEGER },
      deletedAt: { type: DataTypes.DATE }
    },
    {
      sequelize,
      modelName: 'PageSection',
      tableName: 'PageSections',
      paranoid: true, // Soft delete
      timestamps: true
    }
  )

  return PageSection
}
