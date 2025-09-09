'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PasswordResetTokens', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      token: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      modelType: {
        type: Sequelize.STRING,
        allowNull: false
      },
      modelId: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    }, {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('PasswordResetTokens')
  }
};
