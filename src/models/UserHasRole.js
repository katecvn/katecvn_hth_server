'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class UserHasRoles extends Model {
    static associate(models) {
      UserHasRoles.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' })
      UserHasRoles.belongsTo(models.Role, { foreignKey: 'role_id', as: 'role' })
    }
  }

  UserHasRoles.init(
    { user_id: DataTypes.BIGINT, role_id: DataTypes.BIGINT },
    { sequelize, tableName: 'UserHasRoles', modelName: 'UserHasRole', timestamps: false }
  )

  return UserHasRoles
}
