const { body, param } = require('express-validator')
const { message } = require('../constants/message')
const PermissionService = require('../services/PermissionService')

const validateBody = [
  body('name')
    .notEmpty()
    .withMessage(message.notEmpty)
    .bail()
    .isLength({ max: 100 })
    .withMessage(message.isLength(null, 100))
    .bail()
    .custom(async (name, { req }) => {
      const { id } = req.params

      let conditions = { name }

      if (id) conditions.notInIds = [id]

      const permission = await PermissionService.getPermissionByName(conditions)

      if (permission) throw new Error(message.isExisted)

      return true
    }),

  body('description').optional().isLength({ max: 255 }).withMessage(message.isLength(null, 255)),

  body('parent_id')
    .optional({ checkFalsy: true }) // Cho phép null hoặc bỏ trống
    .isInt()
    .withMessage(message.isInt)
    .custom(async (parent_id, { req }) => {
      if (parent_id) {
        const parentPermission = await PermissionService.getPermissionById({ id: parent_id })
        if (!parentPermission) throw new Error(message.notExist)
      }
      return true
    })
]

const validateParam = [
  param('id')
    .isInt()
    .withMessage(message.isInt)
    .custom(async (id, { req }) => {
      const permission = await PermissionService.getPermissionById({ id })

      if (!permission) throw new Error(message.notExist)

      return true
    })
]

const create = [...validateBody]

const update = [...validateParam, ...validateBody]

const show = [...validateParam]

const destroy = [
  param('id')
    .isInt()
    .withMessage(message.isInt)
    .custom(async (id, { req }) => {
      const permission = await PermissionService.getPermissionById({ id })

      if (!permission) throw new Error(message.notExist)

      return true
    })
]

module.exports = { create, update, show, destroy }
