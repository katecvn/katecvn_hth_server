'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class Supplier extends Model {
        static associate(models) {
            Supplier.hasMany(models.Batch, {
                foreignKey: 'supplierId',
                as: 'batches',
            })
        }
    }
    Supplier.init(
        {
            name: DataTypes.STRING,
            contactPerson: DataTypes.STRING,
            email: DataTypes.STRING,
            address: DataTypes.STRING,
            phoneNumber: DataTypes.STRING,
            createdBy: DataTypes.INTEGER,
            updatedBy: DataTypes.INTEGER,
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
            deletedAt: DataTypes.DATE
        },
        {
            sequelize,
            modelName: 'Supplier',
            tableName: 'Suppliers',
            timestamps: true,
            paranoid: true
        }
    )
    return Supplier
}