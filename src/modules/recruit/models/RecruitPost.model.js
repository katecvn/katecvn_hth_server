const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  class RecruitPost extends Model {
    static associate(models) {
      RecruitPost.hasMany(models.RecruitCandidate, { foreignKey: 'recruitPostId', as: 'candidates' })
      RecruitPost.hasMany(models.RecruitAttributeAssignment, { foreignKey: 'recruitPostId', as: 'attributeAssignments' })
    }
  }

  RecruitPost.init(
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      slug: { type: DataTypes.STRING(255), allowNull: false },
      title: { type: DataTypes.STRING(255), allowNull: false },
      status: { type: DataTypes.STRING(20), allowNull: false },
      jobDescription: { type: DataTypes.TEXT, allowNull: false },
      jobRequirements: { type: DataTypes.TEXT, allowNull: false },
      benefits: { type: DataTypes.TEXT, allowNull: false },
      applyRequirements: { type: DataTypes.TEXT, allowNull: false },
      contactInfo: { type: DataTypes.TEXT, allowNull: false },
      deadline: { type: DataTypes.DATE, allowNull: false },
      applyAddress: { type: DataTypes.STRING(255) },
      applyEmail: { type: DataTypes.STRING(255) },
      createdBy: DataTypes.BIGINT,
      updatedBy: DataTypes.BIGINT
    },
    {
      sequelize,
      modelName: 'RecruitPost',
      tableName: 'RecruitPosts',
      timestamps: true,
      paranoid: false
    }
  )

  return RecruitPost
}
