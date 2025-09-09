'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class RoleHasPermission extends Model {}

  RoleHasPermission.init(
    { role_id: DataTypes.BIGINT, permission_id: DataTypes.BIGINT },
    { sequelize, tableName: 'RoleHasPermissions', modelName: 'RoleHasPermission', timestamps: false }
  )

  return RoleHasPermission
}
