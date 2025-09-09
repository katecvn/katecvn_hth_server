'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class SpecificationGroup extends Model {
    static associate(models) {
      SpecificationGroup.hasMany(models.Specification, {
        foreignKey: 'groupId',
        as: 'specifications'
      })
    }
  }

  SpecificationGroup.init(
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
      position: {
        type: DataTypes.INTEGER,
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
      modelName: 'SpecificationGroup',
      tableName: 'SpecificationGroups',
      timestamps: true,
      paranoid: true,
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
      deletedAt: 'deletedAt',
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    }
  )

  return SpecificationGroup
}
