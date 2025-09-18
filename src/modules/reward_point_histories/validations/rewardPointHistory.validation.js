const { query } = require('express-validator')
const { message } = require('../../../constants/message')

const getHistories = [
  query('page').optional().isInt({ min: 1 }).withMessage(message.isInt),
  query('limit').optional().isInt({ min: 1 }).withMessage(message.isInt),
]

module.exports = {
  getHistories,
}
