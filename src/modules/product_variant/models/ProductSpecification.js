'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class ProductSpecification extends Model {
    static associate(models) {
      ProductSpecification.belongsTo(models.Product, {
        foreignKey: 'productId',
        as: 'product'
      })

      ProductSpecification.belongsTo(models.Specification, {
        foreignKey: 'specificationId',
        as: 'specification'
      })
    }
  }

  ProductSpecification.init(
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
      specificationId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      unit: {
        type: DataTypes.STRING,
        allowNull: true
      },
      value: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'ProductSpecification',
      tableName: 'ProductSpecifications',
      timestamps: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    }
  )

  return ProductSpecification
}
