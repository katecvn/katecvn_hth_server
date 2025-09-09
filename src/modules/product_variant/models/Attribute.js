'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Attribute extends Model {
    static associate(models) {
      Attribute.hasMany(models.AttributeValue, {
        foreignKey: 'attributeId',
        as: 'values'
      })

      Attribute.hasMany(models.ProductAttributeAssignment, {
        foreignKey: 'attributeId',
        as: 'productAssignments'
      })

      Attribute.hasMany(models.ProductGroupAttribute, {
        foreignKey: 'attributeId',
        as: 'groupAssignments'
      })

      Attribute.belongsToMany(models.ProductGroup, {
        foreignKey: 'attributeId',
        as: 'attributeHasProductGroups',
        through: models.ProductGroupAttribute
      })
    }
  }

  Attribute.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false
      },
      level: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      inputType: {
        type: DataTypes.STRING,
        allowNull: true
      },
      valueType: {
        type: DataTypes.STRING,
        allowNull: true
      },
      unit: {
        type: DataTypes.STRING,
        allowNull: true
      },
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      updatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'Attribute',
      tableName: 'Attributes',
      timestamps: true,
      paranoid: true,
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
      deletedAt: 'deletedAt',
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    }
  )

  return Attribute
}
