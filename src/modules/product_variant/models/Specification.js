'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Specification extends Model {
    static associate(models) {
      Specification.belongsTo(models.SpecificationGroup, {
        foreignKey: 'groupId',
        as: 'group'
      })
      Specification.belongsToMany(models.Category, {
        foreignKey: 'specificationId',
        as: 'specificationHasCategories',
        through: models.CategorySpecification
      })
    }
  }

  Specification.init(
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
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      isRequired: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
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
      modelName: 'Specification',
      tableName: 'Specifications',
      timestamps: true,
      paranoid: true,
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
      deletedAt: 'deletedAt',
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    }
  )

  return Specification
}
