'use strict'

const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class CustomerGroupDiscount extends Model {
    static associate(models) {
      CustomerGroupDiscount.belongsTo(models.CustomerGroup, {
        foreignKey: 'customerGroupId',
        as: 'customerGroup'
      })
    }
  }

  CustomerGroupDiscount.init(
    {
      id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },

      customerGroupId: { type: DataTypes.BIGINT, allowNull: false },

      discountType: { type: DataTypes.ENUM('percentage', 'fixed'), allowNull: false },

      discountValue: { type: DataTypes.DECIMAL(15, 2), allowNull: false },

      status: {
        type: DataTypes.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active'
      },

      createdAt: { type: DataTypes.DATE },
      updatedAt: { type: DataTypes.DATE }
    },
    {
      sequelize,
      modelName: 'CustomerGroupDiscount',
      tableName: 'CustomerGroupDiscounts',
      timestamps: true
    }
  )

  return CustomerGroupDiscount
}
