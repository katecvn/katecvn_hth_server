'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class AttributeValue extends Model {
    static associate(models) {
      AttributeValue.belongsTo(models.Attribute, {
        foreignKey: 'attributeId',
        as: 'attribute'
      })

      AttributeValue.hasMany(models.VariantAttributeAssignment, {
        foreignKey: 'attributeValueId',
        as: 'variantAssignments'
      })

      AttributeValue.belongsToMany(models.ProductVariant, {
        through: models.VariantAttributeAssignment,
        as: 'variants',
        foreignKey: 'attributeValueId'
      })
    }
  }

  AttributeValue.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      attributeId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      value: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'AttributeValue',
      tableName: 'AttributeValues',
      timestamps: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    }
  )

  return AttributeValue
}
