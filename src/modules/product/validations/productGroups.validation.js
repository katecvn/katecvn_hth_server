const { body, param, query } = require('express-validator')
const { message } = require('../../../constants/message')
const { getProductGroupBySlug, getProductGroupById } = require('../services/productGroups.service')

const bodyValidate = [
  body('name').notEmpty().withMessage(message.notEmpty).bail().isLength({ min: 0, max: 255 }).withMessage(message.isLength(0, 255)),

  body('description').optional({ checkFalsy: true }).isString().withMessage(message.isString),

  body('seoTitle').optional({ checkFalsy: true }).isString().withMessage(message.isString),

  body('seoDescription').optional({ checkFalsy: true }).isString().withMessage(message.isString),

  body('slug')
    .notEmpty()
    .withMessage(message.notEmpty)
    .bail()
    .isLength({ min: 0, max: 255 })
    .withMessage(message.isLength(0, 255))
    .custom(async (slug, { req }) => {
      const { id } = req.params
      let conditions = { slug }

      if (id) conditions.notInIds = [id]

      const productGroup = await getProductGroupBySlug(conditions)

      if (productGroup) throw new Error(message.alreadyExists)

      return true
    })
]

const paramValidate = [
  param('id')
    .notEmpty()
    .withMessage(message.notEmpty)
    .bail()
    .isInt({ min: 1 })
    .withMessage(message.isInt(1))
    .custom(async (id, { req }) => {
      const productGroup = await getProductGroupById({ id })

      if (!productGroup) throw new Error(message.notFound)

      return true
    })
]
const create = [...bodyValidate]

const update = [...bodyValidate, ...paramValidate]

const show = [...paramValidate]

const shows = [
  query('page').optional({ checkFalsy: true }).isInt({ min: 1 }).withMessage(message.isInt(1)),

  query('limit').optional({ checkFalsy: true }).isInt({ min: 1 }).withMessage(message.isInt(1)),

  query('search').optional({ checkFalsy: true }).isString().withMessage(message.isString)
]

const remove = [...paramValidate]

module.exports = {
  create,
  update,
  show,
  shows,
  remove
}
