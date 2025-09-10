const { body, param } = require('express-validator')
const { message } = require('../../../constants/message')
const db = require('../../../models')

// Tạo nhóm khách hàng
const create = [
  body('name')
    .notEmpty().withMessage(message.notEmpty)
    .bail()
    .isString().withMessage(message.isString)
    .bail()
    .isLength({ min: 3 }).withMessage(message.isLength(3))
]

// Cập nhật nhóm khách hàng
const update = [
  body('name')
    .notEmpty().withMessage(message.notEmpty)
    .bail()
    .isString().withMessage(message.isString)
    .bail()
    .isLength({ min: 3 }).withMessage(message.isLength(3)),
  param('id').custom(async (id) => {
    const group = await db.CustomerGroup.findByPk(id)
    if (!group) {
      throw new Error('Không tìm thấy nhóm khách hàng.')
    }
    return true
  })
]

// Xóa nhóm khách hàng
const deleteById = [
  param('id').custom(async (id) => {
    const group = await db.CustomerGroup.findByPk(id)
    if (!group) {
      throw new Error('Không tìm thấy nhóm khách hàng.')
    }
    return true
  })
]

// Lấy chi tiết nhóm khách hàng
const getById = [
  param('id').custom(async (id) => {
    const group = await db.CustomerGroup.findByPk(id)
    if (!group) {
      throw new Error('Không tìm thấy nhóm khách hàng.')
    }
    return true
  })
]

module.exports = {
  create,
  update,
  deleteById,
  getById
}
