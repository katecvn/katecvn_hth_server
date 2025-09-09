const { body } = require('express-validator')
const { message } = require('../../../constants/message')
const { PRODUCT_STATUS } = require('../../../constants')

const updateProductVariant = [
  body('imageUrl').optional({ checkFalsy: true }).isString().withMessage(message.isString),
  body('salePrice')
    .notEmpty()
    .withMessage(message.notEmpty)
    .bail()
    .isFloat()
    .withMessage(message.isFloat())
    .bail()
    .custom((salePrice, { req }) => {
      const { originalPrice } = req.body
      if (parseFloat(originalPrice) > 0) {
        if (parseFloat(salePrice) > parseFloat(originalPrice)) {
          throw new Error('Giá bán phải nhỏ hơn hoặc bằng giá gốc')
        }
      }
      return true
    }),
  body('originalPrice').optional({ checkFalsy: true }).isFloat().withMessage(message.isFloat()),
  body('status')
    .optional({ checkFalsy: true })
    .isIn(Object.values(PRODUCT_STATUS))
    .withMessage(message.isIn(Object.values(PRODUCT_STATUS))),
  body('stock').optional({ checkFalsy: true }).isInt().withMessage(message.isInt()),
  body('position').optional({ checkFalsy: true }).isInt().withMessage(message.isInt())
]

module.exports = {
  updateProductVariant
}
