const { body, param } = require('express-validator')
const { message } = require('../../../constants/message')
const { getCategoryById } = require('../services/category.service')
const { getBrandById } = require('../services/brand.service')

const validateBody = [
  body('categoryIds').optional({ checkFalsy: true }).isArray().withMessage(message.isArray),
  body('categoryIds.*').custom(async (categoryId, { req }) => {
    const category = await getCategoryById({ id: categoryId })

    if (!category) throw new Error(message.notExist)

    return true
  }),
  body('iconUrl').optional({ checkFalsy: true }),
  body('name').notEmpty().withMessage(message.notEmpty).bail().isLength(0, 255).withMessage(message.isLength(0, 255)).bail()
]

const validateParam = [
  param('id')
    .isInt()
    .withMessage(message.isInt)
    .custom(async (id, { req }) => {
      const brand = await getBrandById({ id })

      if (!brand) throw new Error(message.notExist)

      return true
    })
]

const show = [...validateParam]

const create = [...validateBody]

const update = [...validateBody, ...validateParam]

const destroy = [...validateParam]

module.exports = { create, update, destroy, show }
