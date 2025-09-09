const { body, param } = require('express-validator')
const { message } = require('../constants/message')
const NavigationMenuService = require('../services/NavigationMenuService')

const validateBody = [
  body('parentId')
    .optional({ checkFalsy: true })
    .isInt()
    .withMessage(message.isInt)
    .bail()
    .custom(async (parentId, { req }) => {
      const { id } = req.params
      if (Number(parentId) === Number(id)) throw new Error(message.unauthorized)

      const menu = await NavigationMenuService.getMenuById({ id: parentId })

      if (!menu) throw new Error(message.notExist)

      return true
    }),

  body('title').notEmpty().withMessage(message.notEmpty).bail().isLength({ max: 255 }).withMessage(message.isLength(0, 255)).bail(),

  body('url').notEmpty().withMessage(message.notEmpty).bail().isLength({ max: 500 }).withMessage(message.isLength(0, 500)).bail(),

  body('position').optional().isInt().withMessage(message.isInt),

  body('status')
    .optional({ checkFalsy: true })
    .isIn(['active', 'inactive'])
    .withMessage(message.isIn(['active', 'inactive']))
]

const validateParam = [
  param('id')
    .isInt()
    .withMessage(message.isInt)
    .bail()
    .custom(async (id) => {
      const menu = await NavigationMenuService.getMenuById({ id })
      if (!menu) throw new Error(message.notExist)
      return true
    })
]

const create = [...validateBody]

const update = [...validateBody, ...validateParam]

const show = [...validateParam]

const destroy = [...validateParam]

module.exports = { create, show, update, destroy }
