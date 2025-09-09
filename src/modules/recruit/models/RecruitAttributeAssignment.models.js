const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  class RecruitAttributeAssignment extends Model {
    static associate(models) {
      RecruitAttributeAssignment.belongsTo(models.RecruitPost, { foreignKey: 'recruitPostId', as: 'recruitPost' })
      RecruitAttributeAssignment.belongsTo(models.RecruitAttribute, { foreignKey: 'attributeId', as: 'attribute' })
      RecruitAttributeAssignment.belongsTo(models.RecruitAttributesValue, { foreignKey: 'attributeValueId', as: 'value' })
    }
  }

  RecruitAttributeAssignment.init(
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      recruitPostId: { type: DataTypes.BIGINT, allowNull: false },
      attributeId: { type: DataTypes.BIGINT, allowNull: false },
      attributeValueId: { type: DataTypes.BIGINT, allowNull: true },
      customValue: { type: DataTypes.STRING(255), allowNull: true }
    },
    {
      sequelize,
      modelName: 'RecruitAttributeAssignment',
      tableName: 'RecruitAttributeAssignments',
      timestamps: false
    }
  )

  return RecruitAttributeAssignment
}
