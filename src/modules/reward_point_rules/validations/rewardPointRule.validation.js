const { body, param } = require('express-validator')
const { message } = require('../../../constants/message')

const create = [
  body('type')
    .notEmpty().withMessage(message.notEmpty)
    .isIn(['order_value', 'time_slot']).withMessage(message.invalid),
  body('points')
    .notEmpty().withMessage(message.notEmpty)
    .isInt({ min: 0 }).withMessage(message.isInt),
]

const update = [
  param('id')
    .notEmpty().withMessage(message.notEmpty)
    .isInt().withMessage(message.isInt),
  body('points')
    .optional()
    .isInt({ min: 0 }).withMessage(message.isInt),
]

module.exports = {
  create,
  update,
}
