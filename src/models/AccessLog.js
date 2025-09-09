'use strict'
const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  class AccessLog extends Model {
    static associate(models) {
      AccessLog.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' })
    }
  }

  AccessLog.init(
    {
      id: { type: DataTypes.BIGINT, allowNull: false, autoIncrement: true, primaryKey: true },
      user_id: { type: DataTypes.BIGINT, allowNull: false, references: { model: 'Users', key: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
      ip_address: { type: DataTypes.STRING(50), allowNull: false },
      user_agent: { type: DataTypes.TEXT, allowNull: true },
      access_token: { type: DataTypes.STRING(255), allowNull: false },
      status: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'success', comment: 'success, failed, locked' },
      message: { type: DataTypes.STRING(255), allowNull: true },
      createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'created_at' },
      logoutAt: { type: DataTypes.DATE, field: 'logout_at' }
    },
    { sequelize, tableName: 'AccessLogs', modelName: 'AccessLog', timestamps: false }
  )

  return AccessLog
}
