'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      Comment.belongsTo(models.Post, {
        foreignKey: 'ableId',
        constraints: false,
        as: 'post'
      })
      Comment.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      })
      Comment.belongsTo(models.Product, {
        foreignKey: 'ableId',
        constraints: false,
        as: 'product'
      })
      Comment.hasMany(models.Comment, {
        foreignKey: 'parentId',
        as: 'replies'
      })
      Comment.belongsTo(models.Comment, {
        foreignKey: 'parentId',
        as: 'reply'
      })
      Comment.belongsTo(models.User, {
        foreignKey: 'replyTo',
        as: 'replyToUser'
      })
    }
  }
  Comment.init(
    {
      userId: DataTypes.BIGINT,
      parentId: DataTypes.BIGINT,
      replyTo: DataTypes.BIGINT,
      ableType: DataTypes.STRING,
      ableId: DataTypes.BIGINT,
      content: DataTypes.STRING,
      status: DataTypes.STRING,
      createdBy: DataTypes.BIGINT,
      updatedBy: DataTypes.BIGINT
    },
    {
      sequelize,
      modelName: 'Comment',
      tableName: 'Comments',
      timestamps: true,
      paranoid: true
    }
  )
  return Comment
}
