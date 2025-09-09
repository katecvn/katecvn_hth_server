'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      productGroupId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'ProductGroups',
          key: 'id'
        }
      },
      brandId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Brands',
          key: 'id'
        }
      },
      categoryId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Categories',
          key: 'id'
        }
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      unit: {
        type: Sequelize.STRING,
        allowNull: true
      },
      salePrice: { type: Sequelize.DECIMAL(20, 2), allowNull: false },
      originalPrice: { type: Sequelize.DECIMAL(20, 2), allowNull: true },
      stock: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      sku: {
        type: Sequelize.STRING,
        unique: true
      },
      seoTitle: {
        type: Sequelize.STRING
      },
      seoDescription: {
        type: Sequelize.STRING
      },
      seoKeywords: {
        type: Sequelize.STRING
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      content: {
        type: Sequelize.TEXT
      },
      imagesUrl: {
        type: Sequelize.TEXT
      },
      status: { allowNull: false, type: Sequelize.STRING(20), defaultValue: 'active', comment: 'active, lock' },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      createdBy: { type: Sequelize.INTEGER },
      updatedBy: { type: Sequelize.INTEGER },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Products')
  }
}
