'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class OrderDiscount extends Model {
    static associate(models) {}
  }
  OrderDiscount.init(
    {
      orderId: DataTypes.BIGINT,
      discountId: DataTypes.BIGINT,
      discountAmount: DataTypes.DOUBLE
    },
    {
      sequelize,
      modelName: 'OrderDiscount',
      tableName: 'OrderDiscounts',
      timestamps: false
    }
  )
  return OrderDiscount
}
