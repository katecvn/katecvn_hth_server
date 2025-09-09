'use strict'
const { Model } = require('sequelize')
const bcrypt = require('bcryptjs')

const SALT_ROUNDS = 10

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.CustomerGroup, {
        foreignKey: 'customerGroupId',
        as: 'customerGroup'
      })
      User.hasMany(models.AccessLog, { foreignKey: 'user_id', as: 'accessLogs' })

      User.belongsToMany(models.Role, { through: models.UserHasRole, foreignKey: 'user_id', as: 'roles' })

      User.hasMany(models.Comment, { foreignKey: 'userId', as: 'comments' })
      User.hasMany(models.Order, { foreignKey: 'customerId', as: 'orders' })

      User.hasOne(models.PasswordResetToken, {
        scope: {
          modelType: 'user'
        },
        foreignKey: 'modelId',
        as: 'passwordResetToken',
        timestamp: false
      })

      User.hasMany(models.UserAddress, { foreignKey: 'userId', as: 'userAddresses' })
    }

    static async hashPassword(password) {
      return await bcrypt.hash(password, SALT_ROUNDS)
    }

    static async comparePassword(password, hash) {
      return await bcrypt.compare(password, hash)
    }

    toJSON() {
      const attributes = Object.assign({}, this.get())
      delete attributes.password
      return attributes
    }
  }

  User.init(
    {
      code: DataTypes.STRING,
      full_name: DataTypes.STRING,
      user_type: DataTypes.STRING,
      date_of_birth: DataTypes.DATE,
      gender: DataTypes.STRING,
      email: DataTypes.STRING,
      phone_number: DataTypes.STRING,
      avatar_url: DataTypes.TEXT,
      address: DataTypes.STRING,
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      status: DataTypes.STRING,
      customerGroupId: {
        type: DataTypes.BIGINT,
        allowNull: true
      },

      createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'created_at' },
      updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'updated_at' },
      deletedAt: { type: DataTypes.DATE, field: 'deleted_at' }
    },
    {
      sequelize,
      tableName: 'Users',
      modelName: 'User',
      paranoid: true, // Soft delete
      timestamps: true,
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            user.password = await bcrypt.hash(user.password, SALT_ROUNDS)
          }
        },
        beforeUpdate: async (user) => {
          if (user.changed('password')) {
            user.password = await bcrypt.hash(user.password, SALT_ROUNDS)
          }
        }
      }
    }
  )

  return User
}
