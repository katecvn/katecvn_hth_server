'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class OrderDetail extends Model {
    static associate(models) {
      OrderDetail.belongsTo(models.Order, {
        foreignKey: 'orderId',
        as: 'order'
      })
      OrderDetail.belongsTo(models.ProductVariant, {
        foreignKey: 'productVariantId',
        as: 'productVariant'
      })
    }
  }
  OrderDetail.init(
    {
      orderId: DataTypes.BIGINT,
      productVariantId: DataTypes.INTEGER,
      productSku: DataTypes.STRING,
      productName: DataTypes.STRING,
      productUnit: DataTypes.STRING,
      quantity: DataTypes.FLOAT,
      salePrice: DataTypes.DOUBLE,
      originalPrice: DataTypes.DOUBLE,
      totalPrice: DataTypes.DOUBLE,
      attributes: DataTypes.TEXT,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    },
    {
      sequelize,
      modelName: 'OrderDetail',
      tableName: 'OrderDetails',
      timestamps: true
    }
  )
  return OrderDetail
}
