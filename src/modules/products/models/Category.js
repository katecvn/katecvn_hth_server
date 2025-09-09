'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.hasMany(models.Category, { as: 'subCategories', foreignKey: 'parentId' })
      Category.belongsTo(models.Category, { as: 'parent', foreignKey: 'parentId' })
      Category.hasMany(models.Product, { as: 'product', foreignKey: 'categoryId' })
    }
  }

  Category.init(
    {
      parentId: DataTypes.INTEGER,
      level: DataTypes.INTEGER,
      name: DataTypes.STRING,
      thumbnail: DataTypes.STRING,
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
      paranoid: true // Soft delete
    }
  )
  return Category
}
