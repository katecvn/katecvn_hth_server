'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Discount extends Model {
    static associate(models) {
      Discount.belongsToMany(models.Order, {
        through: models.OrderDiscount,
        foreignKey: 'discountId',
        as: 'orders'
      })

      Discount.belongsToMany(models.ProductVariant, {
        through: models.ProductDiscount,
        as: 'productVariants',
        foreignKey: 'discountId'
      })

      Discount.hasMany(models.ProductDiscount, {
        as: 'discountProducts',
        foreignKey: 'discountId'
      })
    }
  }
  Discount.init(
    {
      code: DataTypes.STRING,
      type: DataTypes.STRING,
      value: DataTypes.DOUBLE,
      minOrderAmount: DataTypes.DOUBLE,
      maxDiscount: DataTypes.DOUBLE,
      startDate: DataTypes.DATE,
      endDate: DataTypes.DATE,
      usageLimit: DataTypes.INTEGER,
      usedCount: DataTypes.INTEGER,
      status: DataTypes.STRING,
      createdBy: DataTypes.INTEGER,
      updatedBy: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'Discount',
      tableName: 'Discounts',
      timestamps: true,
      paranoid: true
    }
  )
  return Discount
}
