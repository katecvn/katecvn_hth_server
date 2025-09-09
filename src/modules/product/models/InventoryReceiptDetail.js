'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class InventoryReceiptDetail extends Model {
    static associate(models) {
      InventoryReceiptDetail.belongsTo(models.Product, {
        foreignKey: 'ProductId',
        as: 'receiptProduct'
      })
      InventoryReceiptDetail.belongsTo(models.Batch, {
        foreignKey: 'batchId',
        as: 'batch'
      })
      InventoryReceiptDetail.belongsTo(models.InventoryReceipt, {
        foreignKey: 'receiptId',
        as: 'receipt'
      })
    }
  }

  InventoryReceiptDetail.init(
    {
      receiptId: DataTypes.INTEGER,
      batchId: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      price: DataTypes.DECIMAL,
      reason: DataTypes.STRING
    },
    { sequelize, modelName: 'InventoryReceiptDetail', tableName: 'InventoryReceiptDetails', timestamps: false }
  )
  return InventoryReceiptDetail
}
