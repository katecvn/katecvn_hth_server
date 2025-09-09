const { body, param } = require('express-validator')
const { message } = require('../constants/message')
const RoleService = require('../services/RoleService')
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

      const role = await RoleService.getRoleByName(conditions)

      if (role) throw new Error(message.isExisted)
    }),

  body('description').optional().isLength({ max: 255 }).withMessage(message.isLength(null, 255)),

  body('permissionIds')
    .optional()
    .isArray()
    .withMessage(message.mustBeArray)
    .custom(async (permissionIds) => {
      if (!permissionIds.length) return true

      const validPermissions = await PermissionService.getPermissionsByIds({ ids: permissionIds })

      if (validPermissions.length !== permissionIds.length) throw new Error(message.invalidData)

      return true
    })
]

const validateParam = [
  param('id')
    .isInt()
    .withMessage(message.isInt)
    .custom(async (id, { req }) => {
      const role = await RoleService.getRoleById({ id })

      if (!role) throw new Error(message.notExist)

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
      const role = await RoleService.getRoleById({ id })

      if (!role) throw new Error(message.notExist)

      if (Number(id) === 1) throw new Error(message.cannotDeleteAdmin)

      return true
    })
]

module.exports = { create, update, show, destroy }
