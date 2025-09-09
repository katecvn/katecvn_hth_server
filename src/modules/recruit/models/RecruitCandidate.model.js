const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  class RecruitCandidate extends Model {
    static associate(models) {
      RecruitCandidate.belongsTo(models.RecruitPost, { foreignKey: 'recruitPostId', as: 'recruitPost' })
      RecruitCandidate.hasMany(models.CandidateAttributesAssignment, { foreignKey: 'candidateId', as: 'attributeAssignments' })
    }
  }

  RecruitCandidate.init(
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      recruitPostId: DataTypes.BIGINT,
      candidateName: { type: DataTypes.STRING(255), allowNull: false },
      candidatePhone: { type: DataTypes.STRING(13), allowNull: false },
      candidateEmail: { type: DataTypes.STRING(255), allowNull: false },
      dateOfBirth: { type: DataTypes.DATE, allowNull: false },
      gender: { type: DataTypes.STRING(50), allowNull: false },
      address: { type: DataTypes.STRING(255), allowNull: false },
      cvUrl: { type: DataTypes.STRING(255), allowNull: false },
      status: { type: DataTypes.STRING(20), allowNull: false },
      createdBy: DataTypes.BIGINT,
      updatedBy: DataTypes.BIGINT
    },
    {
      sequelize,
      modelName: 'RecruitCandidate',
      tableName: 'RecruitCandidate',
      timestamps: true,
      paranoid: false
    }
  )

  return RecruitCandidate
}
