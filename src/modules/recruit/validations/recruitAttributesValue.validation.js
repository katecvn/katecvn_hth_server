const { body, param } = require('express-validator')
const { message } = require('../../../constants/message')

// =============== CRUD CƠ BẢN ===============
const create = [
  body('attributeId').notEmpty().withMessage(message.notEmpty).isInt().withMessage(message.isInt()),
  body('value').notEmpty().withMessage(message.notEmpty),
  body('isDefault')
    .isBoolean()
    .withMessage(message.isIn(['true', 'false']))
]

const update = [
  param('id').notEmpty().withMessage(message.notEmpty).isInt().withMessage(message.isInt()),
  body('value').optional().notEmpty().withMessage(message.notEmpty),
  body('isDefault')
    .optional()
    .isBoolean()
    .withMessage(message.isIn(['true', 'false']))
]

const destroy = [param('id').notEmpty().withMessage(message.notEmpty).isInt().withMessage(message.isInt())]

const show = [...destroy]

const byAttributeId = [param('attributeId').notEmpty().withMessage(message.notEmpty).isInt().withMessage(message.isInt())]

const checkDuplicateValueInAttribute = [
  body('attributeId').notEmpty().withMessage(message.notEmpty).isInt().withMessage(message.isInt()),
  body('value').notEmpty().withMessage(message.notEmpty),
  body('excludeId').optional().isInt().withMessage(message.isInt())
]

const bulkCreateOrUpdateValues = [
  body('attributeId').notEmpty().withMessage(message.notEmpty).isInt().withMessage(message.isInt()),
  body('values').isArray({ min: 1 }).withMessage(message.isArray),
  body('values.*.id').optional().isInt().withMessage(message.isInt()),
  body('values.*.value').notEmpty().withMessage(message.notEmpty),
  body('values.*.isDefault')
    .isBoolean()
    .withMessage(message.isIn(['true', 'false']))
]

const setDefaultValueForAttribute = [
  body('attributeId').notEmpty().withMessage(message.notEmpty).isInt().withMessage(message.isInt()),
  body('valueId').notEmpty().withMessage(message.notEmpty).isInt().withMessage(message.isInt())
]

module.exports = {
  create,
  update,
  destroy,
  show,
  byAttributeId,
  checkDuplicateValueInAttribute,
  bulkCreateOrUpdateValues,
  setDefaultValueForAttribute
}
