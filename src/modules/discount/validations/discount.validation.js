const { param, body, query } = require('express-validator')
const db = require('../../../models')
const { message } = require('../../../constants/message')
const { DISCOUNT_STATUS, DISCOUNT_TYPE, PRODUCT_STATUS } = require('../../../constants')
const { Op } = require('sequelize')

const rangeDate = [
  query('fromDate')
    .if(query('toDate').exists())
    .exists()
    .withMessage('Ngày bắt đầu phải có khi ngày kết thúc tồn tại')
    .isISO8601()
    .withMessage(message.isDate('Phải là kiểu ngày'))
    .toDate()
    .custom((value, { req }) => {
      const toDate = new Date(req?.query?.toDate)
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
      const fromDate = new Date(req?.query?.fromDate)
      return value >= fromDate
    })
    .withMessage('Phải sau hoặc bằng ngày bắt đầu')
]

const create = [
  body('code')
    .notEmpty()
    .withMessage(message.notEmpty)
    .bail()
    .isString()
    .withMessage(message.isString)
    .bail()
    .custom(async (code) => {
      const discount = await db.Discount.findOne({
        where: { code }
      })
      if (discount) {
        throw new Error(message.isExisted)
      }
      return true
    }),
  body('type')
    .notEmpty()
    .withMessage(message.notEmpty)
    .bail()
    .isIn(Object.values(DISCOUNT_TYPE))
    .withMessage(message.isIn(Object.values(DISCOUNT_TYPE))),
  body('value')
    .isFloat({ min: 0 })
    .withMessage('Phải là số dương.')
    .toFloat()
    .bail()
    .custom((value, { req }) => {
      if (req.body.type === DISCOUNT_TYPE.PERCENTAGE) {
        if (value < 1 || value > 10) {
          throw new Error('Nếu là phần trăm, giá trị phải từ 1 đến 100.')
        }
      } else if (req.body.type === DISCOUNT_TYPE.FIXED) {
        if (Number(value) !== Number(req?.body?.maxDiscount)) {
          throw new Error('Nếu là số tiền cố định thì, số tiền giảm phải bằng số tiền tối đa.')
        }
      }
      return true
    }),
  body('minOrderAmount').isFloat({ min: 0 }).withMessage(message.isFloat(0, null)).toFloat(),
  body('maxDiscount').isFloat({ min: 0 }).withMessage(message.isFloat(0, null)).toFloat(),
  body('startDate')
    .isISO8601()
    .withMessage(message.isDate('Phải là kiểu ngày'))
    .bail()
    .toDate()
    .custom((value, { req }) => {
      const toDate = new Date(req.body?.endDate)
      return value <= toDate
    })
    .withMessage('Phải trước hoặc bằng ngày kết thúc'),
  body('endDate')
    .isISO8601()
    .withMessage(message.isDate('Phải là kiểu ngày'))
    .bail()
    .toDate()
    .custom((value, { req }) => {
      const fromDate = new Date(req.body?.startDate)
      return value >= fromDate
    })
    .withMessage('Phải sau hoặc bằng ngày bắt đầu'),
  body('usageLimit').isInt({ min: 1 }).withMessage(message.isInt(1)),
  body('status')
    .optional({ checkFalsy: true })
    .isIn(Object.values(DISCOUNT_STATUS))
    .withMessage(message.isIn(Object.values(DISCOUNT_STATUS))),
  body('productVariantIds').optional({ checkFalsy: true }).isArray().withMessage(message.isArray),
  body('productVariantIds.*').custom(async (id) => {
    const variant = await db.ProductVariant.findByPk(id)
    if (!variant) {
      throw new Error(message.notExist)
    }
    return true
  })
]

const update = [
  param('id').custom(async (discountId) => {
    const orderDiscount = await db.OrderDiscount.findOne({
      where: { discountId }
    })
    if (orderDiscount) {
      throw new Error('Mã giảm giá đã được sử dụng, không thể sửa.')
    }
    return true
  }),
  body('code')
    .notEmpty()
    .withMessage(message.notEmpty)
    .bail()
    .isString()
    .withMessage(message.isString)
    .bail()
    .custom(async (code, { req }) => {
      const discount = await db.Discount.findOne({
        where: {
          code,
          id: { [Op.ne]: req.params.id }
        }
      })
      if (discount) {
        throw new Error('Mã giảm giá không được trùng.')
      }
      return true
    }),
  body('type')
    .notEmpty()
    .withMessage(message.notEmpty)
    .bail()
    .isIn(Object.values(DISCOUNT_TYPE))
    .withMessage(message.isIn(Object.values(DISCOUNT_TYPE))),
  body('value')
    .isFloat({ min: 0 })
    .withMessage('Phải là số dương.')
    .toFloat()
    .bail()
    .custom((value, { req }) => {
      if (req.body.type === DISCOUNT_TYPE.PERCENTAGE) {
        if (value < 1 || value > 100) {
          throw new Error('Nếu là phần trăm, giá trị phải từ 1 đến 100.')
        }
      } else if (req.body.type === DISCOUNT_TYPE.FIXED) {
        if (Number(value) !== Number(req?.body?.maxDiscount)) {
          throw new Error('Nếu là số tiền cố định thì, số tiền giảm phải bằng số tiền tối đa.')
        }
      }
      return true
    }),
  body('minOrderAmount').isFloat({ min: 0 }).withMessage('Phải là số dương.').toFloat(),
  body('maxDiscount').isFloat({ min: 0 }).withMessage('Phải là số dương.').toFloat(),
  body('startDate')
    .isISO8601()
    .withMessage(message.isDate('Phải là kiểu ngày'))
    .bail()
    .toDate()
    .custom((value, { req }) => {
      const toDate = new Date(req?.body?.endDate)
      return value <= toDate
    })
    .withMessage('Phải trước hoặc bằng ngày kết thúc'),
  body('endDate')
    .isISO8601()
    .withMessage(message.isDate('Phải là kiểu ngày'))
    .bail()
    .toDate()
    .custom((value, { req }) => {
      const fromDate = new Date(req?.body?.startDate)
      return value >= fromDate
    })
    .withMessage('Phải sau hoặc bằng ngày bắt đầu'),
  body('usageLimit').isInt({ min: 1 }).withMessage(message.isInt(1)),
  body('status')
    .optional({ checkFalsy: true })
    .isIn(Object.values(DISCOUNT_STATUS))
    .withMessage(message.isIn(Object.values(DISCOUNT_STATUS))),
  body('productVariantIds').optional({ checkFalsy: true }).isArray().withMessage(message.isArray),
  body('productVariantIds.*').custom(async (id) => {
    const variant = await db.ProductVariant.findByPk(id)
    if (!variant) {
      throw new Error(message.notExist)
    }
    return true
  })
]

const updateStatus = [
  param('id').custom(async (id) => {
    const discount = await db.Discount.findByPk(id)
    if (!discount) {
      throw new Error(message.notExist)
    }
    return true
  }),
  body('status')
    .isIn(Object.values(DISCOUNT_STATUS))
    .withMessage(message.isIn(Object.values(DISCOUNT_STATUS)))
]

const deleteById = [
  param('id').custom(async (id) => {
    const discount = await db.Discount.findByPk(id)
    if (!discount) {
      throw new Error(message.notExist)
    }
    if (discount.usedCount > 0) {
      throw new Error('Mã giảm giá đã được sử dụng, không thể xóa.')
    }
    return true
  })
]

const applyDiscount = [
  body('codes').isArray({ min: 1 }).withMessage(message.notEmpty),
  body('codes.*').isString().withMessage(message.isString),
  body('items').isArray({ min: 1 }).withMessage(message.isArray),
  body('items.*.productVariantId')
    .isInt({ min: 1 })
    .withMessage(message.isInt(1))
    .toInt()
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
  body('items.*.quantity').isInt({ min: 1 }).withMessage(message.isInt(1)).toInt()
]

module.exports = {
  rangeDate,
  create,
  update,
  updateStatus,
  deleteById,
  applyDiscount
}
