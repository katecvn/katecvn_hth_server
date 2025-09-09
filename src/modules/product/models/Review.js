'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      Review.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      })
    }
  }
  Review.init(
    {
      ableType: DataTypes.STRING,
      ableId: DataTypes.INTEGER,
      userId: DataTypes.BIGINT,
      rating: DataTypes.INTEGER,
      reviewText: DataTypes.STRING,
      status: DataTypes.STRING,
      createdBy: DataTypes.INTEGER,
      updatedBy: DataTypes.INTEGER,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      deletedAt: DataTypes.DATE
    },
    { sequelize, modelName: 'Review', tableName: 'Reviews', timestamps: true, paranoid: true }
  )
  return Review
}
