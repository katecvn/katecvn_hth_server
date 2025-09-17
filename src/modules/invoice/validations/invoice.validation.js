const { body, param } = require('express-validator')
const { message } = require('../../../constants/message')
const db = require('../../../models')

const create = [
  body('orderId').notEmpty().withMessage(message.notEmpty).bail().isInt().withMessage(message.isInt),
  body('invoiceNumber').notEmpty().withMessage(message.notEmpty).bail().isString().withMessage(message.isString),
  body('issueDate').notEmpty().withMessage(message.notEmpty).bail().isISO8601().withMessage(message.isDate),
  body('totalAmount').notEmpty().withMessage(message.notEmpty).bail().isFloat().withMessage(message.isFloat)
]

const update = [
  param('id').custom(async (id) => {
    const invoice = await db.Invoice.findByPk(id)
    if (!invoice) {
      throw new Error('Không tìm thấy hóa đơn.')
    }
    return true
  }),
  body('subTotal').optional().isFloat().withMessage(message.isFloat),
  body('discountAmount').optional().isFloat().withMessage(message.isFloat),
  body('taxAmount').optional().isFloat().withMessage(message.isFloat),
  body('totalAmount').optional().isFloat().withMessage(message.isFloat),
  body('dueDate').optional().isISO8601().withMessage(message.isDate),
  body('note').optional().isString().withMessage(message.isString)
]

const updateStatus = [
  body('status')
    .notEmpty()
    .withMessage(message.notEmpty)
    .bail()
    .isIn(['draft', 'pending', 'approved', 'cancelled'])
    .withMessage('Trạng thái không hợp lệ'),
  param('id').custom(async (id) => {
    const invoice = await db.Invoice.findByPk(id)
    if (!invoice) {
      throw new Error('Không tìm thấy hóa đơn.')
    }
    return true
  })
]

const deleteById = [
  param('id').custom(async (id) => {
    const invoice = await db.Invoice.findByPk(id)
    if (!invoice) {
      throw new Error('Không tìm thấy hóa đơn.')
    }
    return true
  })
]

module.exports = {
  create,
  update,
  updateStatus,
  deleteById
}
