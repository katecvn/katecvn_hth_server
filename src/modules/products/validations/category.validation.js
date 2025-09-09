const { body, param } = require('express-validator')
const { message } = require('../../../constants/message')
const { getCategoryById } = require('../services/category.service')

const validateBody = [
  body('parentId')
    .optional({ checkFalsy: true })
    .custom(async (parentId, { req }) => {
      const category = await getCategoryById({ id: parentId })

      if (!category) throw new Error(message.notExist)

      return true
    }),
  body('name').notEmpty().withMessage(message.notEmpty).bail().isLength(0, 255).withMessage(message.isLength(0, 255)).bail(),
  body('level').optional().isInt().withMessage(message.isInt),
  body('thumbnail').optional({ checkFalsy: true }).isURL().withMessage(message.isURL)
]

const validateParam = [
  param('id')
    .isInt()
    .withMessage(message.isInt)
    .custom(async (id, { req }) => {
      const category = await getCategoryById({ id })

      if (!category) throw new Error(message.notExist)

      return true
    })
]

const create = [...validateBody]

const update = [...validateBody, ...validateParam]

const destroy = [...validateParam]

const show = [...validateParam]

module.exports = { create, update, destroy, show }
