const { body, param, query } = require('express-validator')
const { message } = require('../../../constants/message')

const validateCreate = [
  body('name').notEmpty().withMessage(message.notEmpty),
  body('code').notEmpty().withMessage(message.notEmpty),
  body('inputType').notEmpty().withMessage(message.notEmpty)
]

const validateUpdate = [param('id').isInt().withMessage(message.isInt), ...validateCreate]

const validateShow = [param('id').isInt().withMessage(message.isInt)]

const validateDestroy = validateShow

const validateIndex = [
  query('page').optional().isInt({ min: 1 }).withMessage(message.isInt(1)),
  query('limit').optional().isInt({ min: 1 }).withMessage(message.isInt(1)),
  query('search').optional().isString().trim()
]

const validateUpdateDisplayPriority = [param('id').isInt().withMessage(message.isInt), body('displayPriority').isInt().withMessage(message.isInt(1))]

const validateBulkUpdateDisplayPriority = [
  body('list').isArray({ min: 1 }).withMessage(message.mustBeArray),
  body('list.*.id').isInt().withMessage(message.isInt()),
  body('list.*.displayPriority').isInt().withMessage(message.isInt())
]

const validateCheckCodeExists = [
  query('code').notEmpty().withMessage(message.notEmpty),
  query('excludeId').optional().isInt().withMessage(message.isInt())
]

const validateGetWithValues = validateShow

const validateSearchAdvanced = [query('inputType').optional().isString().trim(), query('isRequired').optional().isBoolean().toBoolean()]

const validateFindByCode = [query('code').notEmpty().withMessage(message.notEmpty)]

module.exports = {
  create: validateCreate,
  update: validateUpdate,
  show: validateShow,
  destroy: validateDestroy,
  shows: validateIndex,
  updateDisplayPriority: validateUpdateDisplayPriority,
  bulkUpdateDisplayPriority: validateBulkUpdateDisplayPriority,
  checkCodeExists: validateCheckCodeExists,
  getWithValues: validateGetWithValues,
  searchAdvanced: validateSearchAdvanced,
  findByCode: validateFindByCode
}
