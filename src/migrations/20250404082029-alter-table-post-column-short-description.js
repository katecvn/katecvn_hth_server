'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Posts', 'short_description', {
      type: Sequelize.TEXT,
      allowNull: true, // adjust if you need NOT NULL
    });
  },

  async down(queryInterface, Sequelize) {
    // Replace TEXT with the previous data type (example: STRING(255))
    await queryInterface.changeColumn('Posts', 'short_description', {
      type: Sequelize.STRING, // assuming previous type was STRING(255)
      allowNull: true, // adjust based on original
    });
  }
};

