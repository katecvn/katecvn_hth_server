const { body, param, query } = require('express-validator')
const { message } = require('../../../constants/message')
const db = require('../../../models')
const { Op } = require('sequelize')

const validateBody = [
  body('productGroupId')
    .optional({ checkFalsy: true })
    .isInt({ min: 1 })
    .withMessage(message.isInt(1))
    .bail()
    .custom(async (productGroupId) => {
      const productGroup = await db.ProductGroups.findByPk(productGroupId)
      if (!productGroup) throw new Error('Product group not found')
      return true
    }),

  body('name').notEmpty().withMessage(message.notEmpty).bail().isLength({ min: 0, max: 255 }).withMessage(message.isLength(0, 255)),

  body('price').notEmpty().withMessage(message.notEmpty).bail().isFloat({ min: 0 }).withMessage('Price must be a positive number'),

  body('stock').notEmpty().withMessage(message.notEmpty).bail().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),

  body('sku')
    .notEmpty()
    .withMessage(message.notEmpty)
    .bail()
    .isLength({ min: 0, max: 100 })
    .withMessage(message.isLength(0, 100))
    .bail()
    .custom(async (sku, { req }) => {
      const { id } = req.params
      let conditions = { sku }
      if (id) conditions.notInIds = [id]
      const product = await db.Products.findOne({ where: { sku } })
      if (product) throw new Error('SKU already exists')
      return true
    }),

  body('seoTitle').optional({ checkFalsy: true }).isLength({ min: 0, max: 255 }).withMessage(message.isLength(0, 255)),

  body('seoDescription').optional({ checkFalsy: true }).isLength({ min: 0, max: 255 }).withMessage(message.isLength(0, 255)),

  body('seoKeywords').optional({ checkFalsy: true }).isLength({ min: 0, max: 255 }).withMessage(message.isLength(0, 255)),

  body('slug')
    .notEmpty()
    .withMessage(message.notEmpty)
    .bail()
    .isLength({ min: 0, max: 255 })
    .withMessage(message.isLength(0, 255))
    .bail()
    .custom(async (slug, { req }) => {
      const { id } = req.params
      let conditions = { slug }
      if (id) conditions.notInIds = [id]
      const product = await db.Products.findOne({ where: { slug } })
      if (product) throw new Error('Slug already exists')
      return true
    }),

  body('content').optional({ checkFalsy: true }).isString().withMessage(message.isString),

  body('imagesUrl')
    .optional({ checkFalsy: true })
    .isArray()
    .withMessage(message.isArray)
    .bail()
    .custom((value) => {
      if (value.length > 3) throw new Error('Maximum 3 images allowed')
      return true
    }),

  body('imagesUrl.*').optional({ checkFalsy: true }).isURL().withMessage(message.isURL),

  body('options').optional({ checkFalsy: true }).isArray().withMessage(message.isArray),

  body('options.*.name').notEmpty().withMessage(message.notEmpty).bail().isLength({ min: 0, max: 255 }).withMessage(message.isLength(0, 255)),

  body('options.*.type')
    .notEmpty()
    .withMessage(message.notEmpty)
    .bail()
    .isIn(['text', 'number', 'select', 'checkbox', 'radio'])
    .withMessage('Invalid option type'),

  body('options.*.required').notEmpty().withMessage(message.notEmpty).bail().isBoolean().withMessage('Required must be a boolean'),

  body('options.*.values').optional({ checkFalsy: true }).isArray().withMessage(message.isArray),

  body('options.*.values.*.value')
    .notEmpty()
    .withMessage(message.notEmpty)
    .bail()
    .isLength({ min: 0, max: 255 })
    .withMessage(message.isLength(0, 255))
]

const validateParam = [
  param('id')
    .isInt()
    .withMessage(message.isInt)
    .bail()
    .custom(async (id) => {
      const product = await db.Products.findByPk(id)
      if (!product) throw new Error('Product not found')
      return true
    })
]

const validateQuery = [
  query('page').optional().isInt({ min: 1 }).withMessage(message.isInt(1)).toInt(),

  query('limit').optional().isInt({ min: 1 }).withMessage(message.isInt(1)).toInt(),

  query('search').optional().isString().withMessage(message.isString),

  query('productGroupId').optional().isInt({ min: 1 }).withMessage(message.isInt(1)).toInt()
]

const create = [...validateBody]

const update = [...validateParam, ...validateBody]

const show = [...validateParam]

const shows = [...validateQuery]

const destroy = [...validateParam]

module.exports = {
  create,
  update,
  show,
  shows,
  destroy
}
