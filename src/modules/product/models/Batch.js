'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class Batch extends Model {
        static associate(models) {
            Batch.belongsTo(models.Supplier, {
                foreignKey: 'supplierId',
                as: 'supplier'
            })
            Batch.belongsTo(models.Product, {
                foreignKey: 'productId',
                as: 'product'
            })
            Batch.hasOne(models.InventoryReceiptDetail, {
                foreignKey: 'batchId',
                as: 'batchReceipt'
            })
        }
    }
    Batch.init(
        {
            supplierId: DataTypes.INTEGER,
            productId: DataTypes.INTEGER,
            code: DataTypes.STRING,
            unit: DataTypes.STRING,
            quantity: DataTypes.FLOAT,
            costPrice: DataTypes.DOUBLE,
            mfgDate: DataTypes.DATE,
            expDate: DataTypes.DATE,
            createdBy: DataTypes.INTEGER,
            updatedBy: DataTypes.INTEGER,
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
            deletedAt: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: 'Batch',
            tableName: 'Batches',
            timestamps: true,
            paranoid: true
        }
    )
    return Batch
}