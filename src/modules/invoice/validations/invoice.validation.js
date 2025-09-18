// validations/invoice.validation.js
const { body, param } = require('express-validator')
const { message } = require('../../../constants/message')
const db = require('../../../models')

const create = [
  body('orderId').notEmpty().withMessage(message.notEmpty).bail().isInt().withMessage(message.isInt),
  body('invoiceNumber').optional().isString().withMessage(message.isString),
  body('issueDate').notEmpty().withMessage(message.notEmpty).bail().isISO8601().withMessage(message.isDate),
  body('subTotal').notEmpty().withMessage(message.notEmpty).bail().isFloat().withMessage(message.isFloat),
  body('discountAmount').notEmpty().withMessage(message.notEmpty).bail().isFloat().withMessage(message.isFloat),
  body('taxAmount').notEmpty().withMessage(message.notEmpty).bail().isFloat().withMessage(message.isFloat),
  body('totalAmount').notEmpty().withMessage(message.notEmpty).bail().isFloat().withMessage(message.isFloat),
  body('dueDate').optional().isISO8601().withMessage(message.isDate),
  body('note').optional().isString().withMessage(message.isString),
  body('companyName').optional().isString().withMessage(message.isString),
  body('companyTaxCode').optional().isString().withMessage(message.isString),
  body('companyAddress').optional().isString().withMessage(message.isString),
  body('companyEmail').optional().isEmail().withMessage(message.isEmail),
  body('companyPhone').optional().isString().withMessage(message.isString),
]

const bulkCreate = [
  body('orderIds').isArray({ min: 1 }).withMessage(message.isArray),
  body('orderIds.*').isInt().withMessage(message.isInt),
  body('issueDate').optional().isISO8601().withMessage(message.isDate),
  body('dueDate').optional().isISO8601().withMessage(message.isDate),
  body('note').optional().isString().withMessage(message.isString),
  body('companyName').optional().isString().withMessage(message.isString),
  body('companyTaxCode').optional().isString().withMessage(message.isString),
  body('companyAddress').optional().isString().withMessage(message.isString),
  body('companyEmail').optional().isEmail().withMessage(message.isEmail),
  body('companyPhone').optional().isString().withMessage(message.isString),
]

const update = [
  param('id').custom(async (id) => {
    const invoice = await db.Invoice.findByPk(id)
    if (!invoice) throw new Error('Không tìm thấy hóa đơn.')
    return true
  }),
  body('subTotal').optional().isFloat().withMessage(message.isFloat),
  body('discountAmount').optional().isFloat().withMessage(message.isFloat),
  body('taxAmount').optional().isFloat().withMessage(message.isFloat),
  body('totalAmount').optional().isFloat().withMessage(message.isFloat),
  body('dueDate').optional().isISO8601().withMessage(message.isDate),
  body('note').optional().isString().withMessage(message.isString),
  body('companyName').optional().isString().withMessage(message.isString),
  body('companyTaxCode').optional().isString().withMessage(message.isString),
  body('companyAddress').optional().isString().withMessage(message.isString),
  body('companyEmail').optional().isEmail().withMessage(message.isEmail),
  body('companyPhone').optional().isString().withMessage(message.isString),
]

const updateStatus = [
  body('status').notEmpty().withMessage(message.notEmpty).bail().isIn(['draft', 'issued', 'cancelled']).withMessage('Trạng thái không hợp lệ'),
  param('id').custom(async (id) => {
    const invoice = await db.Invoice.findByPk(id)
    if (!invoice) throw new Error('Không tìm thấy hóa đơn.')
    return true
  }),
]

const deleteById = [
  param('id').custom(async (id) => {
    const invoice = await db.Invoice.findByPk(id)
    if (!invoice) throw new Error('Không tìm thấy hóa đơn.')
    return true
  }),
]

module.exports = {
  create,
  bulkCreate,
  update,
  updateStatus,
  deleteById,
}
