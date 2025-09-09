'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      Post.belongsTo(models.User, {
        foreignKey: 'author_id',
        as: 'author'
      })
      Post.belongsToMany(models.Topic, {
        through: models.PostHasTopic,
        foreignKey: 'post_id',
        as: 'topics'
      })
      Post.hasMany(models.PostHasTopic, {
        foreignKey: 'post_id',
        as: 'postHasTopics'
      })
      Post.hasMany(models.Comment, {
        foreignKey: 'ableId',
        constraints: false,
        scope: {
          ableType: 'post'
        },
        as: 'postComments'
      })
    }
  }
  Post.init(
    {
      author_id: DataTypes.BIGINT,
      short_description: DataTypes.STRING,
      title: DataTypes.STRING,
      slug: DataTypes.STRING,
      content: DataTypes.TEXT,
      thumbnail: DataTypes.STRING,
      status: DataTypes.STRING,
      published_at: DataTypes.DATE,
      meta_title: DataTypes.STRING,
      meta_description: DataTypes.TEXT,
      meta_keywords: DataTypes.STRING,
      deletedAt: {
        type: DataTypes.DATE,
        field: 'deleted_at'
      }
    },
    {
      sequelize,
      modelName: 'Post',
      tableName: 'Posts',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      paranoid: true
    }
  )
  return Post
}
