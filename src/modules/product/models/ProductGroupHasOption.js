const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class ProductGroupHasOption extends Model {
    static associate(models) {
      ProductGroupHasOption.belongsTo(models.ProductGroup, {
        foreignKey: 'groupId',
        as: 'productGroup'
      })
      ProductGroupHasOption.belongsTo(models.ProductOption, {
        foreignKey: 'optionId',
        as: 'productOption'
      })
    }
  }

  ProductGroupHasOption.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      groupId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      optionId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'ProductGroupHasOption',
      tableName: 'ProductGroupHasOptions',
      timestamps: false
    }
  )

  return ProductGroupHasOption
}
