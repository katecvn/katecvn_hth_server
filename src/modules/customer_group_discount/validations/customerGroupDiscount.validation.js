const { body, param, query } = require('express-validator')
const { message } = require('../../../constants/message')
const db = require('../../../models')

const getProductsByCustomerGroup = [
  query('customerGroupId')
    .notEmpty().withMessage(message.notEmpty)
    .isInt().withMessage(message.isInt)
    .bail()
    .custom(async (id) => {
      const group = await db.CustomerGroup.findByPk(id)
      if (!group) throw new Error('Không tìm thấy nhóm khách hàng.')
      return true
    }),
]

const create = [
  body('customerGroupId')
    .notEmpty().withMessage(message.notEmpty)
    .isInt().withMessage(message.isInt),
  body('productId')
    .notEmpty().withMessage(message.notEmpty)
    .isInt().withMessage(message.isInt),
  body('discountType')
    .notEmpty().withMessage(message.notEmpty)
    .isIn(['percentage', 'fixed']).withMessage(message.isIn(['percentage', 'fixed'])),
  body('discountValue')
    .notEmpty().withMessage(message.notEmpty)
    .isFloat({ min: 0 }).withMessage(message.isFloat),
  body('status')
    .optional()
    .isIn(['active', 'inactive']).withMessage(message.isIn(['active', 'inactive'])),
]

const update = [
  param('id')
    .notEmpty().withMessage(message.notEmpty)
    .isInt().withMessage(message.isInt),
  body('discountType')
    .optional()
    .isIn(['percentage', 'fixed']).withMessage(message.isIn(['percentage', 'fixed'])),
  body('discountValue')
    .optional()
    .isFloat({ min: 0 }).withMessage(message.isFloat),
  body('status')
    .optional()
    .isIn(['active', 'inactive']).withMessage(message.isIn(['active', 'inactive'])),
]

const deleteDiscount = [
  body('customerGroupId')
    .notEmpty().withMessage(message.notEmpty)
    .isInt().withMessage(message.isInt),
  body('productId')
    .notEmpty().withMessage(message.notEmpty)
    .isInt().withMessage(message.isInt),
]

const bulkUpdate = [
  body('customerGroupId')
    .notEmpty().withMessage(message.notEmpty)
    .isInt().withMessage(message.isInt),
  body('discountType')
    .notEmpty().withMessage(message.notEmpty)
    .isIn(['percentage', 'fixed']).withMessage(message.isIn(['percentage', 'fixed'])),
  body('discountValue')
    .notEmpty().withMessage(message.notEmpty)
    .isFloat({ min: 0 }).withMessage(message.isFloat),
  body('status')
    .notEmpty().withMessage(message.notEmpty)
    .isIn(['active', 'inactive']).withMessage(message.isIn(['active', 'inactive'])),
]

module.exports = {
  getProductsByCustomerGroup,
  create,
  update,
  deleteDiscount,
  bulkUpdate,
}
