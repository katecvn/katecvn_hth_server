'use strict'

const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  class CustomerGroupDiscount extends Model {
    static associate(models) {
      CustomerGroupDiscount.belongsTo(models.CustomerGroup, {
        foreignKey: 'customerGroupId',
        as: 'customerGroup',
      })

      CustomerGroupDiscount.belongsTo(models.Product, {
        foreignKey: 'productId',
        as: 'discountProduct',
      })
    }
  }

  CustomerGroupDiscount.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      customerGroupId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      discountType: {
        type: DataTypes.ENUM('percentage', 'fixed'),
        allowNull: false,
      },
      discountValue: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active',
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'CustomerGroupDiscount',
      tableName: 'CustomerGroupDiscounts',
      timestamps: true,
    }
  )

  return CustomerGroupDiscount
}
