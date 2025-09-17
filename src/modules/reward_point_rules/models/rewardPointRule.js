'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class RewardPointRule extends Model {
    static associate(models) {
    }
  }

  RewardPointRule.init(
    {
      type: {
        type: DataTypes.ENUM('order_value', 'time_slot'),
        allowNull: false
      },
      minOrderValue: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: true
      },
      beforeTime: {
        type: DataTypes.TIME,
        allowNull: true
      },
      points: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active'
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    },
    {
      sequelize,
      modelName: 'RewardPointRule',
      tableName: 'RewardPointRules'
    }
  )

  return RewardPointRule
}
