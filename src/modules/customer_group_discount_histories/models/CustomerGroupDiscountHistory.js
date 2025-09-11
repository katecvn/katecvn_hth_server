// model: customer-group-discount-history
'use strict'

const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class CustomerGroupDiscountHistory extends Model {
    static associate(models) {
      CustomerGroupDiscountHistory.belongsTo(models.CustomerGroup, {
        foreignKey: 'customerGroupId',
        as: 'customerGroup',
      })

      CustomerGroupDiscountHistory.belongsTo(models.Product, {
        foreignKey: 'productId',
        as: 'product',
      })

      CustomerGroupDiscountHistory.belongsTo(models.User, {
        foreignKey: 'updatedBy',
        as: 'updatedUser',
      })
    }
  }

  CustomerGroupDiscountHistory.init(
    {
      id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },

      customerGroupId: { type: DataTypes.BIGINT, allowNull: true },

      productId: { type: DataTypes.INTEGER, allowNull: true },

      oldType: { type: DataTypes.ENUM('percentage', 'fixed'), allowNull: true },
      oldValue: { type: DataTypes.DECIMAL(15, 2), allowNull: true },

      newType: { type: DataTypes.ENUM('percentage', 'fixed'), allowNull: true },
      newValue: { type: DataTypes.DECIMAL(15, 2), allowNull: true },

      updatedBy: { type: DataTypes.BIGINT, allowNull: true },
    },
    {
      sequelize,
      modelName: 'CustomerGroupDiscountHistory',
      tableName: 'CustomerGroupDiscountHistories',
      timestamps: true,
    }
  )

  return CustomerGroupDiscountHistory
}
