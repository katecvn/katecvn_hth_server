const { body, param } = require('express-validator')
const { message } = require('../../../constants/message')
const { PAYMENT_STATUS, PAYMENT_METHOD } = require('../../../constants')
const db = require('../models')

const create = [
  body('orderId')
    .isInt({ min: 1 })
    .withMessage(message.isInt(1))
    .bail()
    .toInt()
    .custom(async (value, { req }) => {
      const order = await db.Order.findByPk(value)
      if (!order) {
        throw new Error('Không tìm thấy hóa đơn.')
      }
      return true
    }),
  body('transactionId')
    .notEmpty()
    .withMessage(message.notEmpty)
    .isString()
    .withMessage('Mã giao dịch phải là chuỗi.')
    .custom(async (transactionId, { req }) => {
      const existTransactionId = await db.Payment.findOne({ transactionId })
      if (existTransactionId) {
        throw new Error('Mã giao dịch không được trùng.')
      }
      return true
    }),
  body('paymentMethod')
    .notEmpty()
    .withMessage(message.notEmpty)
    .isIn(Object.values(PAYMENT_METHOD))
    .withMessage(message.isIn(Object.values(PAYMENT_METHOD))),
  body('status')
    .notEmpty()
    .withMessage(message.notEmpty)
    .isIn(Object.values(PAYMENT_STATUS))
    .withMessage(message.isIn(Object.values(PAYMENT_STATUS))),
  body('amount').isFloat({ min: 0 }).withMessage('Số tiền phải là số dương.').toFloat()
]

const updateStatus = [
  body('status')
    .notEmpty()
    .withMessage(message.notEmpty)
    .isIn(Object.values(PAYMENT_STATUS))
    .withMessage(message.isIn(Object.values(PAYMENT_STATUS))),

  param('id').custom(async (value, { req }) => {
    const payment = await db.Payment.findByPk(req.params.id)
    if (!payment) {
      throw new Error('Không tìm thấy thông tin thanh toán.')
    }
    return true
  })
]

const deleteById = [
  param('id').custom(async (value, { req }) => {
    const payment = await db.Payment.findByPk(req.params.id)
    if (!payment) {
      throw new Error('Không tìm thấy thông tin thanh toán.')
    }
    return true
  })
]

module.exports = {
  create,
  updateStatus,
  deleteById
}
