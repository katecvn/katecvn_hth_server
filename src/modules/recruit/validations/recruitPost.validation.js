const { body, param, query } = require('express-validator')
const { message } = require('../../../constants/message')
const db = require('../../../models')

const baseFields = [
  body('title').notEmpty().withMessage(message.notEmpty),
  body('status')
    .notEmpty()
    .isIn(['draft', 'published'])
    .withMessage(message.isIn(['draft', 'published'])),

  body('slug')
    .notEmpty()
    .withMessage(message.notEmpty)
    .bail()
    .isLength({ min: 0, max: 255 })
    .withMessage(message.isLength(0, 255))
    .bail()
    .custom(async (slug, { req }) => {
      const { id } = req.params
      const where = { slug }
      if (id) where.id = { [db.Sequelize.Op.ne]: id }
      const exist = await db.RecruitPost.findOne({ where })
      if (exist) throw new Error(message.isExisted)
      return true
    }),

  body('jobDescription').notEmpty().withMessage(message.notEmpty),
  body('jobRequirements').notEmpty().withMessage(message.notEmpty),
  body('benefits').notEmpty().withMessage(message.notEmpty),
  body('applyRequirements').notEmpty().withMessage(message.notEmpty),
  body('contactInfo').notEmpty().withMessage(message.notEmpty),
  body('deadline').notEmpty().isISO8601().toDate().withMessage(message.invalidDate),
  body('applyAddress').optional({ nullable: true }).isLength({ max: 255 }).withMessage(message.isLength(0, 255)),
  body('applyEmail').optional({ nullable: true }).isEmail().withMessage(message.isEmail)
]

const attributesValidate = [
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

const create = [...baseFields]
const update = [param('id').isInt().withMessage(message.isInt()), ...baseFields]
const remove = [param('id').isInt().withMessage(message.isInt())]
const show = [param('id').isInt().withMessage(message.isInt())]

const fullCreate = [...baseFields, ...attributesValidate]
const fullUpdate = [param('id').isInt().withMessage(message.isInt()), ...baseFields, ...attributesValidate]

const paginationAndFilter = [
  query('page').optional().isInt({ min: 1 }).withMessage(message.isInt()),
  query('limit').optional().isInt({ min: 1 }).withMessage(message.isInt()),
  query('status')
    .optional()
    .isIn(['draft', 'published'])
    .withMessage(message.isIn(['draft', 'published'])),
  query('search').optional().isString().withMessage(message.isString),
  query('deadlineBefore').optional().isISO8601().toDate().withMessage(message.invalidDate)
]

const bulkUpdateStatus = [
  body('ids').isArray({ min: 1 }).withMessage(message.notEmpty),
  body('ids.*').isInt().withMessage(message.isInt),
  body('status')
    .notEmpty()
    .isIn(['draft', 'published'])
    .withMessage(message.isIn(['draft', 'published']))
]

const updateStatus = [
  param('id').isInt().withMessage(message.isInt()),
  body('status')
    .notEmpty()
    .isIn(['draft', 'published'])
    .withMessage(message.isIn(['draft', 'published']))
]

const restore = [param('id').isInt().withMessage(message.isInt())]

const permanentlyDelete = [param('id').isInt().withMessage(message.isInt())]

const getByUser = [param('userId').isInt().withMessage(message.isInt()), ...paginationAndFilter]

const extendDeadline = [
  param('id').isInt().withMessage(message.isInt()),
  body('newDeadline').notEmpty().isISO8601().toDate().withMessage(message.invalidDate)
]

const countCandidates = [param('postId').isInt().withMessage(message.isInt())]

const getAlmostExpired = [query('days').optional().isInt({ min: 1 }).withMessage(message.isInt(1))]

const showBySlug = [
  param('slug')
    .notEmpty()
    .withMessage(message.notEmpty)
    .bail()
    .isString()
    .withMessage(message.isString)
    .bail()
    .isLength({ min: 1, max: 255 })
    .withMessage(message.isLength(1, 255))
]

module.exports = {
  create,
  update,
  remove,
  show,
  fullCreate,
  fullUpdate,
  paginationAndFilter,
  bulkUpdateStatus,
  updateStatus,
  restore,
  permanentlyDelete,
  getByUser,
  extendDeadline,
  countCandidates,
  getAlmostExpired,
  showBySlug
}
