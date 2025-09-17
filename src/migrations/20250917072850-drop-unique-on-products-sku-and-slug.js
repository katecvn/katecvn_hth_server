'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    const [results] = await queryInterface.sequelize.query(`SHOW INDEX FROM Products`)
    for (const row of results) {
      const key = row.Key_name.toLowerCase()
      if (key.includes('sku') || key.includes('slug')) {
        try {
          await queryInterface.removeIndex('Products', row.Key_name)
        } catch (e) {}
      }
    }

    await queryInterface.changeColumn('Products', 'slug', {
      type: Sequelize.STRING,
      allowNull: false
    })
    await queryInterface.changeColumn('Products', 'sku', {
      type: Sequelize.STRING
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Products', 'slug', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    })
    await queryInterface.changeColumn('Products', 'sku', {
      type: Sequelize.STRING,
      unique: true
    })

    await queryInterface.addIndex('Products', ['slug'], {
      unique: true,
      name: 'products_slug_unique'
    })
    await queryInterface.addIndex('Products', ['sku'], {
      unique: true,
      name: 'products_sku_unique'
    })
  }
}
