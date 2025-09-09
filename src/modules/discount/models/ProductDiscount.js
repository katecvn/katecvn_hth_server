'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class ProductDiscount extends Model {
    static associate(models) {
      ProductDiscount.belongsTo(models.ProductVariant, {
        foreignKey: 'productVariantId',
        as: 'variant'
      })

      ProductDiscount.belongsTo(models.Discount, {
        foreignKey: 'discountId',
        as: 'discount'
      })
    }
  }
  ProductDiscount.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      discountId: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      productVariantId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'ProductDiscount',
      tableName: 'ProductDiscounts',
      timestamps: false
    }
  )

  return ProductDiscount
}
