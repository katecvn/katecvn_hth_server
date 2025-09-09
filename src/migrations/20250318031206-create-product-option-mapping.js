module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ProductOptionMappings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Products',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      optionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'ProductOptions',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      value: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    })

    // Add unique constraint for productId and optionId combination
    await queryInterface.addConstraint('ProductOptionMappings', {
      fields: ['productId', 'optionId'],
      type: 'unique',
      name: 'unique_product_option'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ProductOptionMappings')
  }
}
