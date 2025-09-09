const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsTo(models.ProductGroup, {
        foreignKey: 'productGroupId',
        as: 'productGroup'
      })
      Product.hasMany(models.ProductOptions, {
        foreignKey: 'productId',
        as: 'options'
      })
    }
  }

  Product.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      productGroupId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'ProductGroup',
          key: 'id'
        }
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      sku: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      seoTitle: {
        type: DataTypes.STRING,
        allowNull: true
      },
      seoDescription: {
        type: DataTypes.STRING,
        allowNull: true
      },
      seoKeywords: {
        type: DataTypes.STRING,
        allowNull: true
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      imagesUrl: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
          const rawValue = this.getDataValue('imagesUrl')
          return rawValue ? JSON.parse(rawValue) : []
        },
        set(value) {
          this.setDataValue('imagesUrl', JSON.stringify(value))
        }
      }
    },
    {
      sequelize,
      modelName: 'Product',
      tableName: 'Products',
      paranoid: true,
      timestamps: true
    }
  )

  return Product
}
