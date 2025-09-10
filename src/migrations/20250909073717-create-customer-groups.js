'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('CustomerGroups', {
      id: { 
        allowNull: false, 
        autoIncrement: true, 
        primaryKey: true, 
        type: Sequelize.BIGINT 
      },
      name: { 
        type: Sequelize.STRING(255), 
        allowNull: false 
      },
      description: { 
        type: Sequelize.STRING(500), 
        allowNull: true 
      },
      type: { 
        type: Sequelize.ENUM('individual', 'organization'), 
        allowNull: false, 
        defaultValue: 'organization' 
      },

      createdAt: { 
        type: Sequelize.DATE, 
        defaultValue: Sequelize.NOW 
      },
      updatedAt: { 
        type: Sequelize.DATE, 
        defaultValue: Sequelize.NOW 
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('CustomerGroups')
  }
}
