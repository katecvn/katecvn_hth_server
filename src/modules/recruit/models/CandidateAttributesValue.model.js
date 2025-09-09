const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  class CandidateAttributesValue extends Model {
    static associate(models) {
      CandidateAttributesValue.belongsTo(models.CandidateAttribute, { foreignKey: 'attributeId', as: 'attribute' })
    }
  }

  CandidateAttributesValue.init(
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      attributeId: { type: DataTypes.BIGINT, allowNull: false },
      value: { type: DataTypes.STRING(255), allowNull: false },
      isDefault: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
    },
    {
      sequelize,
      modelName: 'CandidateAttributesValue',
      tableName: 'CandidateAttributesValues',
      timestamps: false
    }
  )

  return CandidateAttributesValue
}
