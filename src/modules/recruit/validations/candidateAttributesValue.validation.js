const { body, param, query } = require('express-validator')
const { message } = require('../../../constants/message')
const db = require('../../../models')

const checkExistById = async (id) => {
  const item = await db.CandidateAttributesValue.findByPk(id)
  if (!item) throw new Error(message.notExist)
  return true
}

const create = [
  body('attributeId').notEmpty().withMessage(message.notEmpty),
  body('value').notEmpty().withMessage(message.notEmpty),
  body('isDefault')
    .isBoolean()
    .withMessage(message.isIn(['true', 'false']))
]

const update = [
  param('id').isInt().withMessage(message.isInt()).bail().custom(checkExistById),
  body('value').optional().notEmpty().withMessage(message.notEmpty),
  body('isDefault')
    .optional()
    .isBoolean()
    .withMessage(message.isIn(['true', 'false']))
]

const destroy = [param('id').isInt().withMessage(message.isInt()).bail().custom(checkExistById)]
const show = [param('id').isInt().withMessage(message.isInt()).bail().custom(checkExistById)]

const byAttributeId = [param('attributeId').isInt().withMessage(message.isInt())]

const defaultByAttributeId = byAttributeId

const setDefaultValueForAttribute = [body('attributeId').isInt().withMessage(message.isInt()), body('valueId').isInt().withMessage(message.isInt())]

const checkDuplicateValueInAttribute = [
  body('attributeId').isInt().withMessage(message.isInt()),
  body('value').notEmpty().withMessage(message.notEmpty),
  body('excludeId').optional().isInt().withMessage(message.isInt())
]

const deleteAllByAttributeId = byAttributeId

const bulkCreateOrUpdateValues = [
  body('attributeId').isInt().withMessage(message.isInt()),
  body('values').isArray({ min: 1 }).withMessage(message.isArray),
  body('values.*.value').notEmpty().withMessage(message.notEmpty),
  body('values.*.isDefault')
    .isBoolean()
    .withMessage(message.isIn(['true', 'false'])),
  body('values.*.id').optional().isInt().withMessage(message.isInt())
]

const countByAttributeId = byAttributeId

const byAttributeIds = [query('attributeIds').notEmpty().withMessage(message.notEmpty)]

module.exports = {
  create,
  update,
  destroy,
  show,
  byAttributeId,
  defaultByAttributeId,
  setDefaultValueForAttribute,
  checkDuplicateValueInAttribute,
  deleteAllByAttributeId,
  bulkCreateOrUpdateValues,
  countByAttributeId,
  byAttributeIds
}
