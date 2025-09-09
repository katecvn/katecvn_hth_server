const { query, body } = require('express-validator')
const { message } = require('../../../constants/message')
const { PAYMENT_STATUS, ORDER_STATUS, PAYMENT_METHOD, SHIPPING_METHOD, PRODUCT_STATUS } = require('../../../constants')
const db = require('../../../models')

const phoneRegex = /^\+?\d{1,}$/
const rangeDate = [
  query('fromDate')
    .if(query('toDate').exists())
    .exists()
    .withMessage('Ngày bắt đầu phải có khi ngày kết thúc tồn tại')
    .isISO8601()
    .withMessage(message.isDate('Phải là kiểu ngày'))
    .toDate()
    .custom((value, { req }) => {
      const toDate = new Date(req.query?.toDate)
      return value <= toDate
    })
    .withMessage('Phải trước hoặc bằng ngày kết thúc'),
  query('toDate')
    .if(query('fromDate').exists())
    .exists()
    .withMessage('Ngày kết thúc phải có khi ngày bắt đầu tồn tại')
    .isISO8601()
    .withMessage(message.isDate('Phải là kiểu ngày'))
    .toDate()
    .custom((value, { req }) => {
      const fromDate = new Date(req.query?.fromDate)
      return value >= fromDate
    })
    .withMessage('Phải sau hoặc bằng ngày bắt đầu')
]

const create = [
  body('shippingMethod')
    .isIn(Object.values(SHIPPING_METHOD))
    .withMessage(message.isIn(Object.values(SHIPPING_METHOD))),
  body('customerId')
    .optional({ checkFalsy: true })
    .custom(async (id) => {
      const user = await db.User.findByPk(id)
      if (!user || user.status !== 'active') {
        throw new Error('Tài khoản không tồn tại hoặc đã bị khóa')
      }
      return true
    }),
  body('customerName').notEmpty().withMessage(message.notEmpty).bail().isString().withMessage(message.isString),
  body('customerPhone').notEmpty().withMessage(message.notEmpty).bail().matches(phoneRegex).withMessage(message.invalidPhone),
  body('customerEmail').optional({ checkFalsy: true }).isEmail().withMessage(message.isEmail),
  body('customerAddress').notEmpty().withMessage(message.notEmpty).bail().isString().withMessage(message.isString),
  body('note').optional({ checkFalsy: true }).isString().withMessage(message.isString),
  body('items').isArray({ min: 1 }).withMessage(message.notEmpty),
  body('items.*.productVariantId')
    .notEmpty()
    .withMessage(message.notEmpty)
    .bail()
    .isInt({ min: 1 })
    .withMessage(message.isInt(1))
    .bail()
    .custom(async (id) => {
      const variant = await db.ProductVariant.findOne({
        where: { id },
        include: [
          {
            model: db.Product,
            as: 'product',
            attribute: ['id', 'name', 'status']
          }
        ]
      })

      if (
        !variant ||
        variant.status === PRODUCT_STATUS.HIDE ||
        (variant?.product?.status !== PRODUCT_STATUS.ACTIVE && variant?.product?.status !== PRODUCT_STATUS.ACTIVE_LIST)
      ) {
        throw new Error(message.notExist)
      }

      return true
    }),
  body('items.*.quantity').isInt({ min: 1 }).withMessage(message.isInt(1)),
  body('paymentMethod')
    .isIn(Object.values(PAYMENT_METHOD))
    .withMessage(message.isIn(Object.values(PAYMENT_METHOD))),
  body('discounts').optional()
]

const updateStatus = [
  body('status')
    .notEmpty()
    .withMessage(message.notEmpty)
    .isIn(Object.values(ORDER_STATUS))
    .withMessage(message.isIn(Object.values(ORDER_STATUS)))
]

const updatePaymentStatus = [
  body('paymentStatus')
    .notEmpty()
    .withMessage(message.notEmpty)
    .isIn(Object.values(PAYMENT_STATUS))
    .withMessage(message.isIn(Object.values(PAYMENT_STATUS)))
]

const assignToUser = [
  body('orderId').isInt({ min: 1 }).withMessage(message.isInt(1)).toInt(),
  body('userId').isInt({ min: 1 }).withMessage(message.isInt(1)).toInt()
]

module.exports = {
  rangeDate,
  create,
  updateStatus,
  updatePaymentStatus,
  assignToUser
}
