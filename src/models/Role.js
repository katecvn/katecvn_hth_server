'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      Role.belongsToMany(models.Permission, { through: models.RoleHasPermission, foreignKey: 'role_id', as: 'permissions' })

      Role.belongsToMany(models.User, { through: models.UserHasRole, foreignKey: 'role_id', as: 'users' })
    }
  }

  Role.init(
    {
      name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      description: { type: DataTypes.STRING(255), allowNull: true },
      createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'created_at' },
      updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'updated_at' },
      deletedAt: { type: DataTypes.DATE, field: 'deleted_at' }
    },
    { sequelize, tableName: 'Roles', modelName: 'Role', paranoid: true, timestamps: true }
  )

  return Role
}
