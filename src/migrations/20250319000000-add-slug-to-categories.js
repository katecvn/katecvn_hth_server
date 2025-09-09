'use strict'
/** @type {import('sequelize-cli').Migration} */


module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Categories', 'slug', {
      type: Sequelize.STRING,
      unique: true,
      after: 'name'
    })

    // Generate slugs for existing categories
    const categories = await queryInterface.sequelize.query(
      'SELECT id, name FROM Categories',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    for (const category of categories) {
      const slug = category.name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      
      await queryInterface.sequelize.query(
        'UPDATE Categories SET slug = ? WHERE id = ?',
        {
          replacements: [slug, category.id],
          type: queryInterface.sequelize.QueryTypes.UPDATE
        }
      )
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Categories', 'slug')
  }
} 