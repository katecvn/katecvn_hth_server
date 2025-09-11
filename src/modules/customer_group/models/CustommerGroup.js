'use strict'

const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class CustomerGroup extends Model {
    static associate(models) {
      CustomerGroup.hasMany(models.User, {
        foreignKey: 'customerGroupId',
        as: 'users'
      })

      CustomerGroup.hasMany(models.CustomerGroupDiscount, {
        foreignKey: 'customerGroupId',
        as: 'discounts'
      })
    }
  }

  CustomerGroup.init(
    {
      id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING(255), allowNull: false },
      description: { type: DataTypes.STRING(500), allowNull: true },
      type: {
        type: DataTypes.ENUM('individual', 'organization'),
        allowNull: false,
        defaultValue: 'organization'
      },
      createdAt: { type: DataTypes.DATE },
      updatedAt: { type: DataTypes.DATE }
    },
    {
      sequelize,
      modelName: 'CustomerGroup',
      tableName: 'CustomerGroups',
      timestamps: true
    }
  )

  return CustomerGroup
}
