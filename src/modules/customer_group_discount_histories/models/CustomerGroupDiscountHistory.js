'use strict'

const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class CustomerGroupDiscountHistory extends Model {
    static associate(models) {
      CustomerGroupDiscountHistory.belongsTo(models.CustomerGroup, {
        foreignKey: 'customerGroupId',
        as: 'customerGroup'
      })

      CustomerGroupDiscountHistory.belongsTo(models.User, {
        foreignKey: 'changedBy',
        as: 'changedUser'
      })
    }
  }

  CustomerGroupDiscountHistory.init(
    {
      id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },

      customerGroupId: { type: DataTypes.BIGINT, allowNull: false },

      oldType: { type: DataTypes.ENUM('percentage', 'fixed') },
      oldValue: { type: DataTypes.DECIMAL(15, 2) },

      newType: { type: DataTypes.ENUM('percentage', 'fixed'), allowNull: false },
      newValue: { type: DataTypes.DECIMAL(15, 2), allowNull: false },

      changedBy: { type: DataTypes.BIGINT },
      changedAt: { type: DataTypes.DATE }
    },
    {
      sequelize,
      modelName: 'CustomerGroupDiscountHistory',
      tableName: 'CustomerGroupDiscountHistories',
      timestamps: false
    }
  )

  return CustomerGroupDiscountHistory
}
