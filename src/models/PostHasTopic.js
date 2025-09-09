'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class PostHasTopic extends Model {}
  PostHasTopic.init(
    {
      post_id: DataTypes.BIGINT,
      topic_id: DataTypes.BIGINT
    },
    {
      sequelize,
      modelName: 'PostHasTopic',
      tableName: 'PostHasTopics',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  )
  return PostHasTopic
}
