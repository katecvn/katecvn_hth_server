const { body, param } = require('express-validator')
const { message } = require('../../../constants/message')
const db = require('../../../models')

const create = [
  body('customerGroupId')
    .notEmpty().withMessage(message.notEmpty)
    .bail()
    .isInt().withMessage(message.isInt)
    .bail()
    .custom(async (id) => {
      const group = await db.CustomerGroup.findByPk(id)
      if (!group) throw new Error('Không tìm thấy nhóm khách hàng.')
      return true
    }),

  body('discountType')
    .notEmpty().withMessage(message.notEmpty)
    .bail()
    .isIn(['percentage', 'fixed'])
    .withMessage(message.isIn(['percentage', 'fixed'])),

  body('discountValue')
    .notEmpty().withMessage(message.notEmpty)
    .bail()
    .isFloat({ min: 0 }).withMessage(message.isFloat)
]

const update = [
  param('id')
    .notEmpty().withMessage(message.notEmpty)
    .bail()
    .isInt().withMessage(message.isInt)
    .bail()
    .custom(async (id) => {
      const discount = await db.CustomerGroupDiscount.findByPk(id)
      if (!discount) throw new Error('Không tìm thấy giảm giá nhóm khách hàng.')
      return true
    }),

  body('discountType')
    .optional()
    .isIn(['percentage', 'fixed'])
    .withMessage(message.isIn(['percentage', 'fixed'])),

  body('discountValue')
    .optional()
    .isFloat({ min: 0 }).withMessage(message.isFloat)
]

const deleteById = [
  param('id')
    .notEmpty().withMessage(message.notEmpty)
    .bail()
    .isInt().withMessage(message.isInt)
    .bail()
    .custom(async (id) => {
      const discount = await db.CustomerGroupDiscount.findByPk(id)
      if (!discount) throw new Error('Không tìm thấy giảm giá nhóm khách hàng.')
      return true
    })
]

const getById = [
  param('id')
    .notEmpty().withMessage(message.notEmpty)
    .bail()
    .isInt().withMessage(message.isInt)
]

module.exports = {
  create,
  update,
  deleteById,
  getById
}
