const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  class RecruitAttribute extends Model {
    static associate(models) {
      RecruitAttribute.hasMany(models.RecruitAttributesValue, { foreignKey: 'attributeId', as: 'values' })
      RecruitAttribute.hasMany(models.RecruitAttributeAssignment, { foreignKey: 'attributeId', as: 'assignments' })
    }
  }

  RecruitAttribute.init(
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING(255), allowNull: false },
      code: { type: DataTypes.STRING(255), allowNull: false, unique: true },
      defaultValue: DataTypes.STRING(255),
      isRequired: { type: DataTypes.BOOLEAN, defaultValue: false },
      description: DataTypes.TEXT,
      displayPriority: { type: DataTypes.INTEGER, defaultValue: 0 },
      isDefaultFilter: { type: DataTypes.BOOLEAN, defaultValue: false },
      isAdvancedFilter: { type: DataTypes.BOOLEAN, defaultValue: false },
      icon: DataTypes.STRING(50),
      createdBy: DataTypes.BIGINT,
      updatedBy: DataTypes.BIGINT
    },
    {
      sequelize,
      modelName: 'RecruitAttribute',
      tableName: 'RecruitAttributes',
      timestamps: true,
      paranoid: false
    }
  )

  return RecruitAttribute
}
