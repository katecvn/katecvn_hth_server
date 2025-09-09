'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.hasMany(models.Category, { as: 'subCategories', foreignKey: 'parentId' })
      Category.belongsTo(models.Category, { as: 'parent', foreignKey: 'parentId' })
      Category.hasMany(models.Product, { as: 'product', foreignKey: 'categoryId' })
      Category.belongsToMany(models.Specification, { as: 'specifications', through: models.CategorySpecification, foreignKey: 'categoryId' })
    }
  }

  Category.init(
    {
      parentId: DataTypes.INTEGER,
      level: DataTypes.INTEGER,
      name: DataTypes.STRING,
      slug: DataTypes.STRING,
      thumbnail: DataTypes.STRING,
      iconUrl: DataTypes.STRING,
      createdBy: DataTypes.INTEGER,
      updatedBy: DataTypes.INTEGER,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      deletedAt: DataTypes.DATE
    },
    {
      sequelize,
      modelName: 'Category',
      tableName: 'Categories',
      timestamps: true,
      paranoid: true
    }
  )
  return Category
}
