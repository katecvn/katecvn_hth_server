const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  class CandidateAttributesAssignment extends Model {
    static associate(models) {
      CandidateAttributesAssignment.belongsTo(models.RecruitCandidate, { foreignKey: 'candidateId', as: 'candidate' })
      CandidateAttributesAssignment.belongsTo(models.CandidateAttribute, { foreignKey: 'attributeId', as: 'attribute' })
      CandidateAttributesAssignment.belongsTo(models.CandidateAttributesValue, { foreignKey: 'attributeValueId', as: 'value' })
    }
  }

  CandidateAttributesAssignment.init(
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      candidateId: { type: DataTypes.BIGINT, allowNull: false },
      attributeId: { type: DataTypes.BIGINT, allowNull: false },
      attributeValueId: { type: DataTypes.BIGINT, allowNull: true },
      customValue: { type: DataTypes.STRING(255), allowNull: true }
    },
    {
      sequelize,
      modelName: 'CandidateAttributesAssignment',
      tableName: 'CandidateAttributesAssignments',
      timestamps: false
    }
  )

  return CandidateAttributesAssignment
}
