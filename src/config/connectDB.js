const { Sequelize } = require('sequelize')

require('dotenv').config()

const sequelize = new Sequelize(process.env.DB_NAME || null, process.env.DB_USER || null, process.env.DB_PASS || null, {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
})

let connectDB = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database>>', error)
  }
}

module.exports = { connectDB, sequelize }
