'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Invoice extends Model {
    static associate(models) {
      Invoice.belongsTo(models.Order, {
        foreignKey: 'orderId',
        as: 'order'
      })
      Invoice.belongsTo(models.User, {
        foreignKey: 'createdBy',
        as: 'createdUser'
      })
      Invoice.belongsTo(models.User, {
        foreignKey: 'updatedBy',
        as: 'updatedUser'
      })
    }
  }

  Invoice.init(
    {
      orderId: DataTypes.BIGINT,
      invoiceNumber: DataTypes.STRING,
      issueDate: DataTypes.DATE,
      dueDate: DataTypes.DATE,
      subTotal: DataTypes.DECIMAL(20, 2),
      discountAmount: DataTypes.DECIMAL(20, 2),
      taxAmount: DataTypes.DECIMAL(20, 2),
      totalAmount: DataTypes.DECIMAL(20, 2),
      status: DataTypes.STRING,
      note: DataTypes.STRING,
      createdBy: DataTypes.BIGINT,
      updatedBy: DataTypes.BIGINT
    },
    {
      sequelize,
      modelName: 'Invoice',
      tableName: 'Invoices',
      timestamps: true,
      paranoid: true
    }
  )

  return Invoice
}
