const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsTo(models.ProductGroup, { foreignKey: 'productGroupId', as: 'productGroup' })
      Product.hasMany(models.ProductOptionMapping, { foreignKey: 'productId', as: 'optionMappings' })
      Product.belongsTo(models.Category, { foreignKey: 'categoryId', as: 'category' })
      Product.belongsTo(models.Brand, { foreignKey: 'brandId', as: 'brand' })
      Product.hasMany(models.WishList, { foreignKey: 'productId', as: 'wishLists' })
      Product.hasMany(models.ProductVariant, { foreignKey: 'productId', as: 'variants' })
      Product.hasMany(models.ProductSpecification, { foreignKey: 'productId', as: 'specificationValues' })
      Product.hasMany(models.CustomerGroupDiscount, {
        foreignKey: 'productId',
        as: 'customerDiscounts',
      })
    }
  }

  Product.init(
    {
      productGroupId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      unit: DataTypes.STRING,
      salePrice: DataTypes.DECIMAL,
      originalPrice: DataTypes.DECIMAL,
      stock: DataTypes.INTEGER,
      sku: DataTypes.STRING,
      seoTitle: DataTypes.STRING,
      seoDescription: DataTypes.STRING,
      seoKeywords: DataTypes.STRING,
      slug: DataTypes.STRING,
      content: DataTypes.TEXT,
      imagesUrl: DataTypes.TEXT,
      sentBccuCount: DataTypes.INTEGER,
      isFeatured: DataTypes.INTEGER,
      status: DataTypes.STRING,
      createdBy: DataTypes.INTEGER,
      updatedBy: DataTypes.INTEGER,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      deletedAt: DataTypes.DATE
    },
    {
      sequelize,
      modelName: 'Product',
      tableName: 'Products',
      paranoid: true
    }
  )

  return Product
}
