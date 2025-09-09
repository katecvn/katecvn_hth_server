'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class WishList extends Model {
        static associate(models) {
            WishList.belongsTo(models.User, {
                foreignKey: 'userId',
                as: 'user'
            });
            WishList.belongsTo(models.Product, {
                foreignKey: 'productId',
                as: 'product'
            })
        }
    }

    WishList.init(
        {
            userId: DataTypes.BIGINT,
            productId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'WishList',
            tableName: 'WishLists',
            timestamps: false,
        }
    );

    return WishList;
};
