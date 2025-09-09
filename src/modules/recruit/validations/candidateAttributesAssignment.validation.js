const { body, param, query } = require('express-validator')
const { message } = require('../../../constants/message')

const validateCreate = [
  body('candidateId').isInt({ min: 1 }).withMessage(message.isInt()),
  body('attributeId').isInt({ min: 1 }).withMessage(message.isInt()),
  body('attributeValueId').optional({ nullable: true }).isInt({ min: 1 }).withMessage(message.isInt()),
  body('customValue').optional({ checkFalsy: true }).isString().withMessage(message.isString)
]

const validateIdParam = [param('id').isInt({ min: 1 }).withMessage(message.isInt())]

const validateUpdate = [
  ...validateIdParam,
  body('candidateId').isInt({ min: 1 }).withMessage(message.isInt()),
  body('attributeId').isInt({ min: 1 }).withMessage(message.isInt()),
  body('attributeValueId').optional({ nullable: true }).isInt({ min: 1 }).withMessage(message.isInt()),
  body('customValue').optional({ checkFalsy: true }).isString().withMessage(message.isString)
]

const validateDelete = [...validateIdParam]
const validateGetOne = [...validateIdParam]

const byCandidateId = [param('candidateId').isInt({ min: 1 }).withMessage(message.isInt())]

const byAttributeId = [param('attributeId').isInt({ min: 1 }).withMessage(message.isInt())]

const bulkCreateOrUpdateAssignments = [
  body('candidateId').isInt({ min: 1 }).withMessage(message.isInt()),
  body('assignments').isArray({ min: 1 }).withMessage(message.mustBeArray),
  body('assignments.*.attributeId').isInt({ min: 1 }).withMessage(message.isInt()),
  body('assignments.*.attributeValueId').optional({ nullable: true }).isInt({ min: 1 }).withMessage(message.isInt()),
  body('assignments.*.customValue').optional({ checkFalsy: true }).isString().withMessage(message.isString)
]

const deleteAllByCandidateId = byCandidateId

const checkAssignmentExist = [
  body('candidateId').isInt({ min: 1 }).withMessage(message.isInt()),
  body('attributeId').isInt({ min: 1 }).withMessage(message.isInt()),
  body('attributeValueId').optional({ nullable: true }).isInt({ min: 1 }).withMessage(message.isInt()),
  body('customValue').optional({ checkFalsy: true }).isString().withMessage(message.isString)
]

const byCandidateIds = [query('candidateIds').notEmpty().withMessage(message.notEmpty)]

const deleteByCandidateAndAttributeId = [
  body('candidateId').isInt({ min: 1 }).withMessage(message.isInt()),
  body('attributeId').isInt({ min: 1 }).withMessage(message.isInt())
]

const countByCandidateId = byCandidateId

const filterAssignments = [
  body('candidateId').optional().isInt({ min: 1 }).withMessage(message.isInt()),
  body('attributeId').optional().isInt({ min: 1 }).withMessage(message.isInt()),
  body('attributeValueId').optional({ nullable: true }).isInt({ min: 1 }).withMessage(message.isInt()),
  body('customValue').optional({ checkFalsy: true }).isString().withMessage(message.isString)
]

module.exports = {
  validateCreate,
  validateUpdate,
  validateDelete,
  validateGetOne,
  byCandidateId,
  byAttributeId,
  bulkCreateOrUpdateAssignments,
  deleteAllByCandidateId,
  checkAssignmentExist,
  byCandidateIds,
  deleteByCandidateAndAttributeId,
  countByCandidateId,
  filterAssignments
}
