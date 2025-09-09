const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class ProductGroup extends Model {
    static associate(models) {
      ProductGroup.hasMany(models.Product, {
        foreignKey: 'productGroupId',
        as: 'products'
      })

      ProductGroup.belongsToMany(models.ProductOption, {
        through: models.ProductGroupHasOption,
        foreignKey: 'groupId',
        as: 'productGroupOptions'
      })
    }
  }

  ProductGroup.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      name: {
        type: DataTypes.STRING(255),
        allowNull: false
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },

      seoTitle: {
        type: DataTypes.STRING(255),
        allowNull: true
      },

      seoDescription: {
        type: DataTypes.STRING(255),
        allowNull: true
      },

      slug: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
      },

      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },

      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },

      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'ProductGroup',
      tableName: 'ProductGroups',
      paranoid: true, // enable soft delete
      timestamps: true
    }
  )

  return ProductGroup
}
