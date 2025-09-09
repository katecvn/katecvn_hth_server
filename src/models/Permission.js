'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    static associate(models) {
      Permission.belongsToMany(models.Role, { through: models.RoleHasPermission, foreignKey: 'permission_id', as: 'roles' })

      Permission.hasMany(models.Permission, { foreignKey: 'parent_id', as: 'children' })
      Permission.belongsTo(models.Permission, { foreignKey: 'parent_id', as: 'parent' })
    }
  }

  Permission.init(
    {
      parent_id: { type: DataTypes.BIGINT },
      name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      description: { type: DataTypes.STRING(255), allowNull: true },
      createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'created_at' },
      updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'updated_at' },
      deletedAt: { type: DataTypes.DATE, field: 'deleted_at' }
    },
    { sequelize, tableName: 'Permissions', modelName: 'Permission', paranoid: true, timestamps: true }
  )

  return Permission
}
