const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  class CandidateAttribute extends Model {
    static associate(models) {
      CandidateAttribute.hasMany(models.CandidateAttributesValue, { foreignKey: 'attributeId', as: 'values' })
      CandidateAttribute.hasMany(models.CandidateAttributesAssignment, { foreignKey: 'attributeId', as: 'assignments' })
    }
  }

  CandidateAttribute.init(
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING(255), allowNull: false },
      code: { type: DataTypes.STRING(255), allowNull: false, unique: true },
      inputType: { type: DataTypes.STRING(255), allowNull: false },
      defaultValue: DataTypes.STRING(255),
      isRequired: { type: DataTypes.BOOLEAN, defaultValue: false },
      displayPriority: { type: DataTypes.INTEGER, defaultValue: 0 },
      minLength: DataTypes.INTEGER,
      maxLength: DataTypes.INTEGER,
      description: DataTypes.STRING(255),
      icon: DataTypes.STRING(50),
      createdBy: DataTypes.BIGINT,
      updatedBy: DataTypes.BIGINT
    },
    {
      sequelize,
      modelName: 'CandidateAttribute',
      tableName: 'CandidateAttributes',
      timestamps: true,
      paranoid: false
    }
  )

  return CandidateAttribute
}
