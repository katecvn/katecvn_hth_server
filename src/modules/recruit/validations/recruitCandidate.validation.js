const { body, param, query } = require('express-validator')
const { message } = require('../../../constants/message')
const { getRecruitCandidateById } = require('../services/recruitCandidate.service')

const create = [
  body('candidateName').notEmpty().withMessage(message.notEmpty),
  body('candidatePhone').notEmpty().withMessage(message.notEmpty),
  body('candidateEmail').notEmpty().withMessage(message.notEmpty),
  body('dateOfBirth').notEmpty().withMessage(message.notEmpty),
  body('gender').notEmpty().withMessage(message.notEmpty),
  body('address').notEmpty().withMessage(message.notEmpty),
  body('cvUrl').notEmpty().withMessage(message.notEmpty)
]

const update = [
  param('id')
    .notEmpty()
    .bail()
    .custom(async (id) => {
      const data = await getRecruitCandidateById(id)
      if (!data) throw new Error(message.notExist)
    }),
  ...create
]

const remove = [
  param('id')
    .notEmpty()
    .bail()
    .custom(async (id) => {
      const data = await getRecruitCandidateById(id)
      if (!data) throw new Error(message.notExist)
    })
]

const show = [...remove]

const byRecruitPostId = [param('recruitPostId').isInt({ min: 1 }).withMessage(message.isInt())]

const byUserId = [param('userId').isInt({ min: 1 }).withMessage(message.isInt(1))]

const updateStatus = [param('id').isInt({ min: 1 }).withMessage(message.isInt(1)), body('status').notEmpty().withMessage(message.notEmpty)]

const bulkUpdateStatus = [body('ids').isArray({ min: 1 }).withMessage(message.mustBeArray), body('status').notEmpty().withMessage(message.notEmpty)]

const restore = [param('id').isInt({ min: 1 }).withMessage(message.isInt(1))]

const permanentlyDelete = [param('id').isInt({ min: 1 }).withMessage(message.isInt(1))]

const countCandidates = [param('recruitPostId').isInt({ min: 1 }).withMessage(message.isInt(1))]

const search = [
  query('keyword').optional().isString(),
  query('status').optional().isString(),
  query('recruitPostId').optional().isInt({ min: 1 }).withMessage(message.isInt(1)),
  query('page').optional().isInt({ min: 1 }).withMessage(message.isInt(1)),
  query('limit').optional().isInt({ min: 1 }).withMessage(message.isInt(1))
]

const filter = [
  body('filter').isObject().withMessage(message.isObject),
  body('page').optional().isInt({ min: 1 }).withMessage(message.isInt(1)),
  body('limit').optional().isInt({ min: 1 }).withMessage(message.isInt(1))
]

const countByStatus = [param('recruitPostId').isInt({ min: 1 }).withMessage(message.isInt(1))]

const fullCreate = [
  ...create,
  body('attributes').optional().isArray().withMessage('attributes must be an array'),
  body('attributes.*.attributeId').if(body('attributes').exists()).notEmpty().withMessage(message.notEmpty).isInt().withMessage(message.isInt()),
  body('attributes.*.attributeValueId').if(body('attributes').exists()).optional({ nullable: true }).isInt().withMessage(message.isInt()),
  body('attributes.*.customValue').if(body('attributes').exists()).optional({ nullable: true }).isString().withMessage(message.isString),
  body('attributes.*').custom((obj) => {
    if (!obj) return true
    if (
      (obj.attributeValueId === undefined || obj.attributeValueId === null) &&
      (obj.customValue === undefined || obj.customValue === null || obj.customValue === '')
    ) {
      throw new Error('Mỗi thuộc tính phải có ít nhất attributeValueId hoặc customValue')
    }
    return true
  })
]

const fullUpdate = [
  ...update,
  body('attributes').optional().isArray().withMessage(message.isArray),
  body('attributes.*.attributeId').if(body('attributes').exists()).notEmpty().withMessage(message.notEmpty).isInt().withMessage(message.isInt()),
  body('attributes.*.attributeValueId').if(body('attributes').exists()).optional({ nullable: true }).isInt().withMessage(message.isInt()),
  body('attributes.*.customValue').if(body('attributes').exists()).optional({ nullable: true }).isString().withMessage(message.isString),
  body('attributes.*').custom((obj) => {
    if (!obj) return true
    if (
      (obj.attributeValueId === undefined || obj.attributeValueId === null) &&
      (obj.customValue === undefined || obj.customValue === null || obj.customValue === '')
    ) {
      throw new Error('Mỗi thuộc tính phải có ít nhất attributeValueId hoặc customValue')
    }
    return true
  })
]

module.exports = {
  create,
  update,
  remove,
  show,
  byRecruitPostId,
  byUserId,
  updateStatus,
  bulkUpdateStatus,
  restore,
  permanentlyDelete,
  countCandidates,
  search,
  filter,
  countByStatus,
  fullCreate,
  fullUpdate
}
