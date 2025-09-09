'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class CategorySpecification extends Model {
    static associate(models) {
      CategorySpecification.belongsTo(models.Specification, {
        foreignKey: 'specificationId'
      })

      CategorySpecification.belongsTo(models.Category, {
        foreignKey: 'categoryId'
      })
    }
  }

  CategorySpecification.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      specificationId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      position: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'CategorySpecification',
      tableName: 'CategorySpecifications',
      timestamps: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    }
  )

  return CategorySpecification
}
