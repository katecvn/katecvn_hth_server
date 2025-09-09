require('dotenv').config()

module.exports = {
  development: {
    username: process.env.DB_USER || null,
    password: process.env.DB_PASS || null,
    database: process.env.DB_NAME || null,
    host: '127.0.0.1',
    dialect: 'mysql',
    logging: false,
    timezone: '+07:00'
  },
  test: {
    username: process.env.DB_USER || null,
    password: process.env.DB_PASS || null,
    database: process.env.DB_NAME || null,
    host: '127.0.0.1',
    port: 3306,
    dialect: 'mysql',
    dialectOptions: {
      bigNumberStrings: true
    }
  },
  production: {
    username: process.env.DB_USER || null,
    password: process.env.DB_PASS || null,
    database: process.env.DB_NAME || null,
    host: '127.0.0.1',
    dialect: 'mysql',
    dialectOptions: {
      useUTC: false
    },
    timezone: '+07:00'
  }
}
