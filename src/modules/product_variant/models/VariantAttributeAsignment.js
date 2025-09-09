'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class VariantAttributeAssignment extends Model {
    static associate(models) {
      VariantAttributeAssignment.belongsTo(models.ProductVariant, {
        foreignKey: 'variantId',
        as: 'variant'
      })

      VariantAttributeAssignment.belongsTo(models.AttributeValue, {
        foreignKey: 'attributeValueId',
        as: 'attributeValue'
      })
    }
  }

  VariantAttributeAssignment.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      variantId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      attributeValueId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      customValue: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'VariantAttributeAssignment',
      tableName: 'VariantAttributeAssignments',
      timestamps: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    }
  )

  return VariantAttributeAssignment
}
