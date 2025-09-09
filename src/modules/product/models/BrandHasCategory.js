'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class BrandHasCategory extends Model {
    static associate(models) {
      // define association here
    }
  }
  BrandHasCategory.init(
    { brandId: { type: DataTypes.INTEGER }, categoryId: { type: DataTypes.INTEGER } },
    { sequelize, modelName: 'BrandHasCategory', tableName: 'BrandHasCategories', timestamps: false }
  )
  return BrandHasCategory
}
