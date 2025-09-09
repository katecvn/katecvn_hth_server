'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class UserAddress extends Model {
    static associate(models) {}
  }
  UserAddress.init(
    {
      name: DataTypes.STRING,
      phone: DataTypes.STRING,
      address: DataTypes.STRING,
      isDefault: DataTypes.BOOLEAN,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    },
    {
      sequelize,
      modelName: 'UserAddress',
      tableName: 'UserAddresses',
      timestamps: true,
      paranoid: false
    }
  )
  return UserAddress
}
