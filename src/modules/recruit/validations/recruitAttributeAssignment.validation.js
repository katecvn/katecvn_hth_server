const { body, param, query } = require('express-validator')
const { message } = require('../../../constants/message')

const create = [
  body('recruitPostId').notEmpty().withMessage(message.notEmpty).isInt().withMessage(message.isInt()),
  body('attributeId').notEmpty().withMessage(message.notEmpty).isInt().withMessage(message.isInt()),
  body('attributeValueId').optional().isInt().withMessage(message.isInt()),
  body('customValue').optional().isString().withMessage(message.isString)
]

const update = [param('id').notEmpty().withMessage(message.notEmpty).isInt().withMessage(message.isInt()), ...create]

const remove = [param('id').notEmpty().withMessage(message.notEmpty).isInt().withMessage(message.isInt())]

const show = [...remove]

const byRecruitPostId = [param('recruitPostId').notEmpty().withMessage(message.notEmpty).isInt().withMessage(message.isInt())]

const byAttributeId = [param('attributeId').notEmpty().withMessage(message.notEmpty).isInt().withMessage(message.isInt())]

const bulkCreateOrUpdateAssignments = [
  body('recruitPostId').notEmpty().withMessage(message.notEmpty).isInt().withMessage(message.isInt()),
  body('assignments').isArray({ min: 1 }).withMessage(message.isArray),
  body('assignments.*.attributeId').notEmpty().withMessage(message.notEmpty).isInt().withMessage(message.isInt()),
  body('assignments.*.attributeValueId').optional().isInt().withMessage(message.isInt()),
  body('assignments.*.customValue').optional().isString().withMessage(message.isString)
]

const deleteAllByRecruitPostId = [param('recruitPostId').notEmpty().withMessage(message.notEmpty).isInt().withMessage(message.isInt())]

const getAssignmentsByRecruitPostIds = [query('recruitPostIds').notEmpty().withMessage(message.notEmpty)]

const checkAssignmentExist = [
  body('recruitPostId').notEmpty().withMessage(message.notEmpty).isInt().withMessage(message.isInt()),
  body('attributeId').notEmpty().withMessage(message.notEmpty).isInt().withMessage(message.isInt())
]

const deleteByRecruitPostAndAttributeId = [
  body('recruitPostId').notEmpty().withMessage(message.notEmpty).isInt().withMessage(message.isInt()),
  body('attributeId').notEmpty().withMessage(message.notEmpty).isInt().withMessage(message.isInt())
]

const countAssignmentsByRecruitPostId = [param('recruitPostId').notEmpty().withMessage(message.notEmpty).isInt().withMessage(message.isInt())]

const filterAssignments = [
  body('recruitPostId').optional().isInt().withMessage(message.isInt()),
  body('attributeId').optional().isInt().withMessage(message.isInt()),
  body('attributeValueId').optional().isInt().withMessage(message.isInt()),
  body('customValue').optional().isString().withMessage(message.isString)
]

module.exports = {
  create,
  update,
  remove,
  show,
  byRecruitPostId,
  byAttributeId,
  bulkCreateOrUpdateAssignments,
  deleteAllByRecruitPostId,
  getAssignmentsByRecruitPostIds,
  checkAssignmentExist,
  deleteByRecruitPostAndAttributeId,
  countAssignmentsByRecruitPostId,
  filterAssignments
}
