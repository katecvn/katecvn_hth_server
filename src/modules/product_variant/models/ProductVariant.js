'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class ProductVariant extends Model {
    static associate(models) {
      ProductVariant.belongsTo(models.Product, {
        foreignKey: 'productId',
        as: 'product'
      })

      ProductVariant.hasMany(models.VariantAttributeAssignment, {
        foreignKey: 'variantId',
        as: 'attributeAssignments'
      })

      ProductVariant.belongsToMany(models.AttributeValue, {
        foreignKey: 'variantId',
        through: models.VariantAttributeAssignment,
        as: 'attributeValues'
      })

      ProductVariant.hasMany(models.ProductDiscount, {
        foreignKey: 'productVariantId',
        as: 'productDiscounts'
      })

      ProductVariant.belongsToMany(models.Discount, {
        through: models.ProductDiscount,
        foreignKey: 'productVariantId',
        as: 'discounts'
      })
    }
  }

  ProductVariant.init(
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
      sku: {
        type: DataTypes.STRING,
        allowNull: true
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      unit: {
        type: DataTypes.STRING,
        allowNull: true
      },
      salePrice: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0
      },
      originalPrice: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0
      },
      position: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true
      },
      status: {
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
      modelName: 'ProductVariant',
      tableName: 'ProductVariants',
      timestamps: true,
      paranoid: true,
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
      deletedAt: 'deletedAt',
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    }
  )

  return ProductVariant
}
