const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class ProductOptionMapping extends Model {
    static associate(models) {
      ProductOptionMapping.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' })
      ProductOptionMapping.belongsTo(models.ProductOption, { foreignKey: 'optionId', as: 'option' })
    }
  }

  ProductOptionMapping.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Products',
          key: 'id'
        }
      },
      optionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'ProductOptions',
          key: 'id'
        }
      },
      value: {
        type: DataTypes.STRING(255),
        allowNull: false
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
      modelName: 'ProductOptionMapping',
      tableName: 'ProductOptionMappings',
      paranoid: false,
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['productId', 'optionId']
        }
      ]
    }
  )

  return ProductOptionMapping
}
