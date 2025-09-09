'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class InventoryReceipt extends Model {
    static associate(models) {
      InventoryReceipt.belongsToMany(models.Product, {
        through: models.InventoryReceiptDetail,
        foreignKey: 'receiptId',
        as: 'products'
      })
      InventoryReceipt.hasMany(models.InventoryReceiptDetail, {
        foreignKey: 'receiptId',
        as: 'receiptDetails'
      })
      InventoryReceipt.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      })
    }
  }

  InventoryReceipt.init(
    {
      userId: DataTypes.INTEGER,
      code: DataTypes.STRING,
      receiptType: DataTypes.STRING,
      dateTime: DataTypes.DATE,
      status: DataTypes.STRING,
      notes: DataTypes.STRING,
      createdBy: DataTypes.INTEGER,
      updatedBy: DataTypes.INTEGER,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    },
    {
      sequelize,
      modelName: 'InventoryReceipt',
      tableName: 'InventoryReceipts',
      timestamps: true,
      paranoid: false
    }
  )
  return InventoryReceipt
}
