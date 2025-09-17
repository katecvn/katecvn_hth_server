'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class RewardPointHistory extends Model {
    static associate(models) {
      RewardPointHistory.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      })
      RewardPointHistory.belongsTo(models.Order, {
        foreignKey: 'orderId',
        as: 'order'
      })
    }
  }

  RewardPointHistory.init(
    {
      id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },

      userId: {
        type: DataTypes.BIGINT,
        allowNull: false
      },

      orderId: {
        type: DataTypes.BIGINT,
        allowNull: true
      },

      ruleType: {
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
        allowNull: false
      },

      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    },
    {
      sequelize,
      modelName: 'RewardPointHistory',
      tableName: 'RewardPointHistories'
    }
  )

  return RewardPointHistory
}
