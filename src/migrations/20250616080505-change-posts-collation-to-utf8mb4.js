'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE \`Posts\` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE \`Posts\` CONVERT TO CHARACTER SET utf8 COLLATE utf8mb3_unicode_ci;
    `)
  }
}
