const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  class RecruitAttributesValue extends Model {
    static associate(models) {
      RecruitAttributesValue.belongsTo(models.RecruitAttribute, { foreignKey: 'attributeId', as: 'attribute' })
    }
  }

  RecruitAttributesValue.init(
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      attributeId: { type: DataTypes.BIGINT, allowNull: false },
      value: { type: DataTypes.STRING(255), allowNull: false },
      isDefault: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
    },
    {
      sequelize,
      modelName: 'RecruitAttributesValue',
      tableName: 'RecruitAttributesValues',
      timestamps: false
    }
  )

  return RecruitAttributesValue
}
