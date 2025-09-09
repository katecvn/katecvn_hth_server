'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Shipping extends Model {
    static associate(models) {
      Shipping.belongsTo(models.Order, {
        foreignKey: 'orderId',
        as: 'order'
      })
    }
  }
  Shipping.init(
    {
      orderId: DataTypes.BIGINT,
      trackingNumber: DataTypes.STRING,
      shippingMethod: DataTypes.STRING,
      shippingStatus: DataTypes.STRING,
      customerName: DataTypes.STRING,
      customerPhone: DataTypes.STRING,
      customerAddress: DataTypes.STRING,
      estimatedDelivery: DataTypes.INTEGER,
      deliveredAt: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'Shipping',
      tableName: 'Shippings',
      timestamps: true
    }
  )
  return Shipping
}
