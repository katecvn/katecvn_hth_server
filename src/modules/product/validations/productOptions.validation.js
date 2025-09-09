const { body, param, query } = require('express-validator')
const { message } = require('../../../constants/message')
const { getProductOptionById } = require('../services/productOptions.service')

const bodyValidate = [
  body('name').notEmpty().withMessage(message.notEmpty).bail().isLength({ min: 0, max: 255 }).withMessage(message.isLength(0, 255)),

  body('unit').optional({ checkFalsy: true }).isLength({ min: 0, max: 50 }).withMessage(message.isLength(0, 50))
]

const paramValidate = [
  param('id')
    .notEmpty()
    .withMessage(message.notEmpty)
    .bail()
    .isInt({ min: 1 })
    .withMessage(message.isInt(1))
    .custom(async (id) => {
      const productOption = await getProductOptionById({ id })
      if (!productOption) throw new Error(message.notFound)
      return true
    })
]

const create = [...bodyValidate]

const update = [...paramValidate, ...bodyValidate]

const show = [...paramValidate]

const shows = [
  query('page').optional({ checkFalsy: true }).isInt({ min: 1 }).withMessage(message.isInt(1)),

  query('limit').optional({ checkFalsy: true }).isInt({ min: 1 }).withMessage(message.isInt(1)),

  query('search').optional({ checkFalsy: true }).isString().withMessage(message.isString),

  query('groupId').optional({ checkFalsy: true }).isInt({ min: 1 }).withMessage(message.isInt(1))
]

const remove = [...paramValidate]

module.exports = {
  create,
  update,
  show,
  shows,
  remove
}
