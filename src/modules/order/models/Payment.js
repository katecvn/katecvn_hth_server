'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate(models) {
      Payment.belongsTo(models.Order, {
        foreignKey: 'orderId',
        as: 'order'
      })
    }
  }
  Payment.init(
    {
      orderId: DataTypes.BIGINT,
      paymentMethod: DataTypes.STRING,
      transactionId: DataTypes.STRING,
      amount: DataTypes.DOUBLE,
      status: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'Payment',
      tableName: 'Payments',
      timestamps: true
    }
  )
  return Payment
}
