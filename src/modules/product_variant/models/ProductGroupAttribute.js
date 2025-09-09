'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class ProductGroupAttribute extends Model {
    static associate(models) {
      ProductGroupAttribute.belongsTo(models.ProductGroup, {
        foreignKey: 'groupId',
        as: 'group'
      })

      ProductGroupAttribute.belongsTo(models.Attribute, {
        foreignKey: 'attributeId',
        as: 'attribute'
      })
    }
  }

  ProductGroupAttribute.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      groupId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      attributeId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'ProductGroupAttribute',
      tableName: 'ProductGroupAttributes',
      timestamps: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    }
  )

  return ProductGroupAttribute
}
