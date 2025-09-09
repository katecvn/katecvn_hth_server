'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'Users',
      {
        id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.BIGINT },
        role_id: { type: Sequelize.BIGINT, references: { model: 'Roles', key: 'id' }, onDelete: 'RESTRICT', onUpdate: 'CASCADE', allowNull: true },
        user_type: { type: Sequelize.STRING(20), defaultValue: 'customer', comment: 'admin, customer' },
        code: { type: Sequelize.STRING(20) },
        full_name: { allowNull: false, type: Sequelize.STRING(100) },
        date_of_birth: { type: Sequelize.DATE },
        gender: { type: Sequelize.STRING(6), comment: 'male, female, other' },
        email: { type: Sequelize.STRING(100), allowNull: false },
        phone_number: { type: Sequelize.STRING(20) },
        avatar_url: { type: Sequelize.TEXT },
        address: { type: Sequelize.STRING(255) },
        username: { type: Sequelize.STRING(100) },
        password: { type: Sequelize.STRING },
        status: { type: Sequelize.STRING(10), defaultValue: 'active', comment: 'active, inactive' },
        created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
        updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
        deleted_at: { type: Sequelize.DATE, allowNull: true }
      },
      { charset: 'utf8', collate: 'utf8_unicode_ci', timestamps: true, paranoid: true }
    )

    await queryInterface.addIndex('Users', ['username'])
    await queryInterface.addIndex('Users', ['email'])
    await queryInterface.addIndex('Users', ['code'])
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users')
  }
}
