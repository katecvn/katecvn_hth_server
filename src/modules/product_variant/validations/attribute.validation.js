const { body } = require('express-validator')
const { message } = require('../../../constants/message')

const createAttribute = [
  body('name').notEmpty().withMessage(message.notEmpty).bail().isString().withMessage(message.isString),
  body('code')
    .notEmpty()
    .withMessage(message.notEmpty)
    .bail()
    .isString()
    .withMessage(message.isString)
    .bail()
    .matches(/^[a-z0-9._-]+$/)
    .withMessage('Mã chỉ được chứa chữ thường, số, dấu chấm (.), gạch ngang (-), và gạch dưới (_), không có khoảng trắng hoặc ký tự đặc biệt'),
  body('level').isInt({ min: 0 }).withMessage(message.isInt(0)).toInt(),
  body('inputType').optional({ checkFalsy: true }).isString().withMessage(message.isString),
  body('valueType').optional({ checkFalsy: true }).isString().withMessage(message.isString),
  body('unit').optional({ checkFalsy: true }).isString().withMessage(message.isString),
  body('values').optional({ checkFalsy: true }).isArray().withMessage(message.isArray),
  body('values.*').optional().isString().withMessage(message.isString)
]

const updateAttribute = [
  body('name').notEmpty().withMessage(message.notEmpty).bail().isString().withMessage(message.isString),
  body('code')
    .notEmpty()
    .withMessage(message.notEmpty)
    .bail()
    .isString()
    .withMessage(message.isString)
    .bail()
    .matches(/^[a-z0-9._-]+$/)
    .withMessage('Mã chỉ được chứa chữ thường, số, dấu chấm (.), gạch ngang (-), và gạch dưới (_), không có khoảng trắng hoặc ký tự đặc biệt'),
  body('level').isInt({ min: 0 }).withMessage(message.isInt(0)).toInt(),
  body('inputType').optional({ checkFalsy: true }).isString().withMessage(message.isString),
  body('valueType').optional({ checkFalsy: true }).isString().withMessage(message.isString),
  body('unit').optional({ checkFalsy: true }).isString().withMessage(message.isString),
  body('values').optional({ checkFalsy: true }).isArray().withMessage(message.isArray),
  body('values.*').optional().isString().withMessage(message.isString)
]

module.exports = {
  createAttribute,
  updateAttribute
}
