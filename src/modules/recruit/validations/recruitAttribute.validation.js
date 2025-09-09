const { body, param } = require('express-validator')
const { message } = require('../../../constants/message')
const { findOne, findByCode } = require('../services/recruitAttribute.service')

const validateBody = [
  body('name').notEmpty().withMessage(message.notEmpty).bail().isLength({ max: 255 }).withMessage(message.isLength(0, 255)),

  body('code')
    .notEmpty()
    .withMessage(message.notEmpty)
    .bail()
    .isLength({ max: 255 })
    .withMessage(message.isLength(0, 255))
    .bail()
    .custom(async (code, { req }) => {
      const { id } = req.params
      const exist = await findByCode({ code, excludeId: id })
      if (exist) throw new Error(message.isExisted)
      return true
    }),

  body('defaultValue').optional({ checkFalsy: true }).isLength({ max: 255 }).withMessage(message.isLength(0, 255)),

  body('description').optional({ checkFalsy: true }).isString().withMessage(message.isString),

  body('displayPriority').optional({ checkFalsy: true }).isInt({ min: 0 }).withMessage(message.isInt()),

  body('isRequired')
    .optional({ checkFalsy: true })
    .isBoolean()
    .withMessage(message.isIn(['true', 'false'])),

  body('isDefaultFilter')
    .optional({ checkFalsy: true })
    .isBoolean()
    .withMessage(message.isIn(['true', 'false'])),

  body('isAdvancedFilter')
    .optional({ checkFalsy: true })
    .isBoolean()
    .withMessage(message.isIn(['true', 'false'])),

  body('icon').optional({ checkFalsy: true }).isLength({ max: 50 }).withMessage(message.isLength(0, 50)),

  body('createdBy').optional({ checkFalsy: true }).isInt().withMessage(message.isInt())
]

const validateParam = [
  param('id')
    .isInt()
    .withMessage(message.isInt())
    .bail()
    .custom(async (id) => {
      const attr = await findOne(id)
      if (!attr) throw new Error(message.notExist)
      return true
    })
]

const create = [...validateBody]
const update = [...validateBody, ...validateParam]
const show = [...validateParam]
const destroy = [...validateParam]

const updateDisplayPriority = [
  param('id')
    .isInt()
    .withMessage(message.isInt())
    .bail()
    .custom(async (id) => {
      const attr = await findOne(id)
      if (!attr) throw new Error(message.notExist)
      return true
    }),
  body('displayPriority').notEmpty().withMessage(message.notEmpty).bail().isInt({ min: 0 }).withMessage(message.isInt())
]

const bulkUpdateDisplayPriority = [
  body('list').isArray({ min: 1 }).withMessage(message.mustBeArray),
  body('list.*.id').notEmpty().withMessage(message.notEmpty).bail().isInt().withMessage(message.isInt()),
  body('list.*.displayPriority').notEmpty().withMessage(message.notEmpty).bail().isInt({ min: 0 }).withMessage(message.isInt())
]

module.exports = {
  create,
  update,
  show,
  destroy,
  updateDisplayPriority,
  bulkUpdateDisplayPriority
}
