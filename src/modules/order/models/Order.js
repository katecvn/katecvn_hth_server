'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.hasMany(models.Payment, {
        foreignKey: 'orderId',
        as: 'payments'
      })
      Order.hasMany(models.Shipping, {
        foreignKey: 'orderId',
        as: 'shippings'
      })
      Order.hasMany(models.OrderDetail, {
        foreignKey: 'orderId',
        as: 'orderItems'
      })
      Order.belongsTo(models.User, {
        foreignKey: 'customerId',
        as: 'customer'
      })
      Order.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      })
      Order.belongsToMany(models.Discount, {
        through: models.OrderDiscount,
        foreignKey: 'orderId',
        as: 'orderDiscounts'
      })
    }
  }
  Order.init(
    {
      code: DataTypes.STRING,
      customerId: DataTypes.BIGINT,
      userId: DataTypes.BIGINT,
      subTotal: DataTypes.DOUBLE,
      discountAmount: DataTypes.DOUBLE,
      totalAmount: DataTypes.DOUBLE,
      status: DataTypes.STRING,
      paymentStatus: DataTypes.STRING,
      date: DataTypes.DATE,
      orderForDate: DataTypes.DATE,
      note: DataTypes.STRING,
      createdBy: DataTypes.BIGINT,
      updatedBy: DataTypes.BIGINT
    },
    {
      sequelize,
      modelName: 'Order',
      tableName: 'Orders',
      timestamps: true,
      paranoid: true
    }
  )
  return Order
}
