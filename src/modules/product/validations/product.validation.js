const { body } = require('express-validator')
const { message } = require('../../../constants/message')
const { PRODUCT_STATUS } = require('../../../constants')

const createProduct = [
  body('brandId').optional({ checkFalsy: true }).isInt().withMessage(message.isInt()),
  body('categoryId').optional({ checkFalsy: true }).isInt().withMessage(message.isInt()),
  body('productGroupId').optional({ checkFalsy: true }).isInt().withMessage(message.isInt()),
  body('name').notEmpty().withMessage(message.notEmpty).bail().isString().withMessage(message.isString),
  body('slug').notEmpty().withMessage(message.notEmpty).bail().isString().withMessage(message.isString).bail().isSlug().withMessage(message.isSlug),
  body('unit').optional({ checkFalsy: true }).isString().withMessage(message.isString),
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
  body('stock').optional({ checkFalsy: true }).isInt().withMessage(message.isInt()),
  body('sku').notEmpty().withMessage(message.notEmpty).bail().isString().withMessage(message.isString),
  body('content').optional({ checkFalsy: true }).isString().withMessage(message.isString),
  body('seoTitle').optional({ checkFalsy: true }).isString().withMessage(message.isString),
  body('seoDescription').optional({ checkFalsy: true }).isString().withMessage(message.isString),
  body('seoKeywords').optional({ checkFalsy: true }).isString().withMessage(message.isString),
  body('status')
    .optional({ checkFalsy: true })
    .isIn(Object.values(PRODUCT_STATUS))
    .withMessage(message.isIn(Object.values(PRODUCT_STATUS))),
  body('imagesUrl').notEmpty().withMessage(message.notEmpty).bail().isArray({ min: 1 }).withMessage(message.isArray),
  body('imagesUrl.*').isString().withMessage(message.isString),
  body('isFeatured')
    .isIn([0, 1])
    .withMessage(message.isIn([0, 1])),
  body('specificationValues').optional({ checkFalsy: true }).isArray().withMessage(message.isArray),
  body('specificationValues.*.specificationId').isInt().withMessage(message.isInt()),
  body('specificationValues.*.unit').optional({ checkFalsy: true }).isString().withMessage(message.isString),
  body('specificationValues.*.value').isString().withMessage(message.isString),
  body('variants').optional({ checkFalsy: true }).isArray().withMessage(message.isArray),
  body('variants.*.sku').notEmpty().withMessage(message.notEmpty).bail().isString().withMessage(message.isString),
  body('variants.*.stock').notEmpty().withMessage(message.notEmpty).bail().isInt().withMessage(message.isInt()),
  body('variants.*.salePrice')
    .notEmpty()
    .withMessage(message.notEmpty)
    .bail()
    .isFloat()
    .withMessage(message.isFloat())
    .bail()
    .custom((salePrice, { req, path }) => {
      const match = path.match(/^variants\.(\d+)\.salePrice$/)
      if (match) {
        const index = parseInt(match[1], 10)
        const originalPrice = req.body.variants?.[index]?.originalPrice

        if (originalPrice && parseFloat(originalPrice) > 0) {
          if (parseFloat(salePrice) > parseFloat(originalPrice)) {
            throw new Error('Giá bán phải nhỏ hơn hoặc bằng giá gốc')
          }
        }
      }
      return true
    }),
  body('variants.*.originalPrice').optional({ checkFalsy: true }).isFloat().withMessage(message.isFloat()),
  body('variants.*.position').optional({ checkFalsy: true }).isInt().withMessage(message.isInt()),
  body('variants.*.imageUrl').isString().withMessage(message.isString),
  body('variants.*.status')
    .isIn(Object.values(PRODUCT_STATUS))
    .withMessage(message.isIn(Object.values(PRODUCT_STATUS))),
  body('variants.*.attributeValues').isArray().withMessage(message.isArray),
  body('variants.*.attributeValues.*.id').isInt().withMessage(message.isInt()),
  body('variants.*.attributeValues.*.customValue').optional({ checkFalsy: true }).isString().withMessage(message.isString)
]

const updateProductStatus = [
  body('status')
    .isIn(Object.values(PRODUCT_STATUS))
    .withMessage(message.isIn(Object.values(PRODUCT_STATUS)))
]

const updateProduct = [
  body('brandId').optional({ checkFalsy: true }).isInt().withMessage(message.isInt()),
  body('categoryId').optional({ checkFalsy: true }).isInt().withMessage(message.isInt()),
  body('productGroupId').optional({ checkFalsy: true }).isInt().withMessage(message.isInt()),
  body('name').notEmpty().withMessage(message.notEmpty).bail().isString().withMessage(message.isString),
  body('slug').notEmpty().withMessage(message.notEmpty).bail().isString().withMessage(message.isString).bail().isSlug().withMessage(message.isSlug),
  body('unit').optional({ checkFalsy: true }).isString().withMessage(message.isString),
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
  body('stock').optional({ checkFalsy: true }).isInt().withMessage(message.isInt()),
  body('sku').notEmpty().withMessage(message.notEmpty).bail().isString().withMessage(message.isString),
  body('content').optional({ checkFalsy: true }).isString().withMessage(message.isString),
  body('seoTitle').optional({ checkFalsy: true }).isString().withMessage(message.isString),
  body('seoDescription').optional({ checkFalsy: true }).isString().withMessage(message.isString),
  body('seoKeywords').optional({ checkFalsy: true }).isString().withMessage(message.isString),
  body('status')
    .optional({ checkFalsy: true })
    .isIn(Object.values(PRODUCT_STATUS))
    .withMessage(message.isIn(Object.values(PRODUCT_STATUS))),
  body('imagesUrl').notEmpty().withMessage(message.notEmpty).bail().isArray({ min: 1 }).withMessage(message.isArray),
  body('imagesUrl.*').isString().withMessage(message.isString),
  body('isFeatured')
    .isIn([0, 1])
    .withMessage(message.isIn([0, 1])),
  body('specificationValues').optional({ checkFalsy: true }).isArray().withMessage(message.isArray),
  body('specificationValues.*.specificationId').isInt().withMessage(message.isInt()),
  body('specificationValues.*.unit').optional({ checkFalsy: true }).isString().withMessage(message.isString),
  body('specificationValues.*.value').isString().withMessage(message.isString),
  body('variants').optional({ checkFalsy: true }).isArray().withMessage(message.isArray),
  body('variants.*.sku').notEmpty().withMessage(message.notEmpty).bail().isString().withMessage(message.isString),
  body('variants.*.stock').notEmpty().withMessage(message.notEmpty).bail().isInt().withMessage(message.isInt()),
  body('variants.*.salePrice')
    .notEmpty()
    .withMessage(message.notEmpty)
    .bail()
    .isFloat()
    .withMessage(message.isFloat())
    .bail()
    .custom((salePrice, { req, path }) => {
      const match = path.match(/^variants\.(\d+)\.salePrice$/)
      if (match) {
        const index = parseInt(match[1], 10)
        const originalPrice = req.body.variants?.[index]?.originalPrice

        if (originalPrice && parseFloat(originalPrice) > 0) {
          if (parseFloat(salePrice) > parseFloat(originalPrice)) {
            throw new Error('Giá bán phải nhỏ hơn hoặc bằng giá gốc')
          }
        }
      }
      return true
    }),
  body('variants.*.originalPrice').optional({ checkFalsy: true }).isFloat().withMessage(message.isFloat()),
  body('variants.*.variantId').optional({ checkFalsy: true }).isInt().withMessage(message.isInt()),
  body('variants.*.position').optional({ checkFalsy: true }).isInt().withMessage(message.isInt()),
  body('variants.*.imageUrl').isString().withMessage(message.isString),
  body('variants.*.status')
    .isIn(Object.values(PRODUCT_STATUS))
    .withMessage(message.isIn(Object.values(PRODUCT_STATUS))),
  body('variants.*.attributeValues').isArray().withMessage(message.isArray),
  body('variants.*.attributeValues.*.id').isInt().withMessage(message.isInt()),
  body('variants.*.attributeValues.*.customValue').optional({ checkFalsy: true }).isString().withMessage(message.isString)
]

module.exports = {
  createProduct,
  updateProductStatus,
  updateProduct
}
