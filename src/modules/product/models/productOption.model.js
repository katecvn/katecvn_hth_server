const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class ProductOption extends Model {
    static associate(models) {
      ProductOption.belongsToMany(models.ProductGroup, {
        through: models.ProductGroupHasOption,
        foreignKey: 'optionId',
        otherKey: 'groupId',
        as: 'productGroups'
      })
    }
  }

  ProductOption.init(
    {
      name: DataTypes.STRING,
      unit: DataTypes.STRING,
      imageUrl: DataTypes.STRING,
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
      modelName: 'ProductOption',
      tableName: 'ProductOptions',
      paranoid: true,
      timestamps: true
    }
  )

  return ProductOption
}
