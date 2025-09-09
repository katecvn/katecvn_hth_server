const { body, param } = require('express-validator')
const { message } = require('../../../constants/message')
const { SHIPPING_STATUS, SHIPPING_METHOD } = require('../../../constants')
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
  body('trackingNumber')
    .notEmpty()
    .withMessage(message.notEmpty)
    .isString()
    .withMessage('Mã theo dõi đơn hàng phải là chuỗi.')
    .custom(async (trackingNumber, { req }) => {
      const existTrackingNumber = await db.Shipping.findOne({
        where: {
          trackingNumber
        }
      })
      if (existTrackingNumber) {
        throw new Error('Mã theo dõi không được trùng.')
      }
      return true
    }),
  body('shippingMethod')
    .notEmpty()
    .withMessage(message.notEmpty)
    .isIn(Object.values(SHIPPING_METHOD))
    .withMessage(message.isIn(Object.values(SHIPPING_METHOD))),
  body('shippingStatus')
    .notEmpty()
    .withMessage(message.notEmpty)
    .isIn(Object.values(SHIPPING_STATUS))
    .withMessage(message.isIn(Object.values(SHIPPING_STATUS))),
  body('estimatedDelivery').isInt({ min: 1 }).withMessage(message.isInt(1)).toInt(),
  body('deliveredAt').optional().isISO8601().withMessage(message.isDate('Phải là kiểu ngày')).toDate()
]

const validateParam = [
  param('id').custom(async (id, { req }) => {
    const shipping = await db.Shipping.findByPk(id)
    if (!shipping) {
      throw new Error('Không tìm thấy thông tin vận chuyển.')
    }
    return true
  })
]

const update = [
  ...validateParam,
  body('status')
    .isIn(Object.values(SHIPPING_STATUS))
    .withMessage(message.isIn(Object.values(SHIPPING_STATUS))),
  body('estimatedDelivery').optional({ checkFalsy: true }).isInt({ min: 1 }).withMessage(message.isInt(1)).toInt(),
  body('deliveredAt').optional({ checkFalsy: true }).isISO8601().withMessage(message.isDate('Phải là kiểu ngày'))
]

const updateStatus = [
  ...validateParam,
  body('status')
    .isIn(Object.values(SHIPPING_STATUS))
    .withMessage(message.isIn(Object.values(SHIPPING_STATUS))),
  body('deliveredAt').optional({ checkFalsy: true }).isISO8601().withMessage(message.isDate('kiểu ngày'))
]

const deleteById = [...validateParam]

module.exports = {
  create,
  update,
  updateStatus,
  deleteById
}
