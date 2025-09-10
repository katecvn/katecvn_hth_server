const { param, query } = require('express-validator')
const { message } = require('../../../constants/message')
const db = require('../../../models')

const getHistories = [
  query('customerGroupId')
    .optional()
    .isInt().withMessage(message.isInt)
    .bail()
    .custom(async (id) => {
      if (!id) return true
      const group = await db.CustomerGroup.findByPk(id)
      if (!group) throw new Error('Không tìm thấy nhóm khách hàng.')
      return true
    })
]

const getById = [
  param('id')
    .notEmpty().withMessage(message.notEmpty)
    .bail()
    .isInt().withMessage(message.isInt)
    .bail()
    .custom(async (id) => {
      const history = await db.CustomerGroupDiscountHistory.findByPk(id)
      if (!history) throw new Error('Không tìm thấy lịch sử giảm giá.')
      return true
    })
]

module.exports = {
  getHistories,
  getById
}
