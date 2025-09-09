'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Brand extends Model {
    static associate(models) {
      Brand.belongsToMany(models.Category, {
        through: 'BrandHasCategories',
        timestamps: false,
        foreignKey: 'brandId',
        as: 'categories'
      })
    }
  }

  Brand.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      imageUrl: DataTypes.STRING,
      iconUrl: DataTypes.STRING,
      createdBy: DataTypes.INTEGER,
      updatedBy: DataTypes.INTEGER,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      deletedAt: DataTypes.DATE
    },
    { sequelize, modelName: 'Brand', tableName: 'Brands', timestamps: true, paranoid: true }
  )
  return Brand
}
