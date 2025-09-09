const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  class ProductOptionValues extends Model {
    static associate(models) {
      ProductOptionValues.belongsTo(models.ProductOptions, {
        foreignKey: 'productOptionId',
        as: 'option'
      })
    }
  }

  ProductOptionValues.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      productOptionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'ProductOptions',
          key: 'id'
        }
      },
      value: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'ProductOptionValues',
      tableName: 'ProductOptionValues',
      paranoid: true,
      timestamps: true
    }
  )

  return ProductOptionValues
}
