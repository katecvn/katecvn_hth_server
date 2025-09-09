'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Topic extends Model {
    static associate(models) {
      Topic.belongsToMany(models.Post, {
        through: models.PostHasTopic,
        foreignKey: 'topic_id',
        as: 'posts'
      })
    }
  }
  Topic.init(
    {
      name: DataTypes.STRING,
      slug: DataTypes.STRING,
      parent_id: DataTypes.BIGINT,
      status: DataTypes.STRING,
      deletedAt: {
        type: DataTypes.DATE,
        field: 'deleted_at'
      }
    },
    {
      sequelize,
      modelName: 'Topic',
      tableName: 'Topics',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      paranoid: true
    }
  )
  return Topic
}
