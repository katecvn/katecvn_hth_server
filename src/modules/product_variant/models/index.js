'use strict'

const { Sequelize, DataTypes } = require('sequelize')
const { sequelize } = require('../../../config/connectDB')
const fs = require('fs')
const path = require('path')

const db = { sequelize, Sequelize }

fs.readdirSync(__dirname)
  .filter((file) => file !== 'index.js')
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes)
    db[model.name] = model
  })

module.exports = db
