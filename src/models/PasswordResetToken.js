'use strict'
const { Model } = require('sequelize')
const getDateNow = require('../utils/Timestamp')

module.exports = (sequelize, DataTypes) => {
    class PasswordResetToken extends Model {
        static associate(models) {
            PasswordResetToken.belongsTo(models.User, {
                scope: {
                    model_type: 'User'
                },
                foreignKey: 'modelId',
                as: 'user',
                timestamp: false
            })
        }
    }
    PasswordResetToken.init(
        {
            token: DataTypes.STRING,
            modelType: DataTypes.STRING,
            modelId: DataTypes.BIGINT,
            createdAt: DataTypes.INTEGER
        },
        {
            sequelize,
            modelName: 'PasswordResetToken',
            tableName: 'PasswordResetTokens',
            timestamps: false,
            hooks: {
                beforeCreate(passwordResetToken) {
                    passwordResetToken.createdAt = getDateNow().timestamp
                }
            }
        }
    )
    return PasswordResetToken
}