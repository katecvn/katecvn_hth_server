'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Contact extends Model {
    static associate(models) {}
  }
  Contact.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      subject: DataTypes.STRING,
      message: DataTypes.TEXT,
      status: DataTypes.STRING // ENUM('pending', 'in_progress', 'resolved') DEFAULT 'pending',
    },
    {
      sequelize,
      modelName: 'Contact',
      tableName: 'Contacts',
      timestamps: true
    }
  )
  return Contact
}
