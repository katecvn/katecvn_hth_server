'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class ProductAttributeAssignment extends Model {
    static associate(models) {
      ProductAttributeAssignment.belongsTo(models.Product, {
        foreignKey: 'productId',
        as: 'product'
      })

      ProductAttributeAssignment.belongsTo(models.Attribute, {
        foreignKey: 'attributeId',
        as: 'attribute'
      })

      ProductAttributeAssignment.belongsTo(models.AttributeValue, {
        foreignKey: 'attributeValueId',
        as: 'attributeValue'
      })
    }
  }

  ProductAttributeAssignment.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      attributeId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      attributeValueId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      customValue: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'ProductAttributeAssignment',
      tableName: 'ProductAttributeAssignments',
      timestamps: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    }
  )

  return ProductAttributeAssignment
}
