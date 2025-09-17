const { query } = require('express-validator')
const { message } = require('../../../constants/message')

const getHistories = [
  query('userId')
    .optional()
    .isInt().withMessage(message.isInt),
]

module.exports = {
  getHistories,
}
