const { body, param } = require('express-validator')
const { message } = require('../../../constants/message')
const db = require('../../../models')
const { Op } = require('sequelize')

const validateBody = [
  body('parentId')
    .optional({ checkFalsy: true })
    .custom(async (parentId) => {
      const category = await db.Category.findByPk(parentId)
      if (!category) throw new Error(message.notExist)
      return true
    }),
  body('name')
    .notEmpty()
    .withMessage(message.notEmpty)
    .bail()
    .isLength(0, 255)
    .withMessage(message.isLength(0, 255))
    .bail()
    .custom(async (name, { req }) => {
      const { id } = req.params
      const where = { name }
      if (id) where.id = { [Op.ne]: id }

      const isExistedName = await db.Category.findOne({
        where
      })

      if (isExistedName) throw new Error(message.isExisted)
      return true
    }),
  body('slug')
    .notEmpty()
    .withMessage(message.notEmpty)
    .bail()
    .isLength(0, 255)
    .withMessage(message.isLength(0, 255))
    .bail()
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage('Slug chỉ được chứa chữ thường, số và dấu gạch ngang')
    .bail()
    .custom(async (slug, { req }) => {
      const { id } = req.params
      const where = { slug }
      if (id) where.id = { [Op.ne]: id }

      const isExistedSlug = await db.Category.findOne({
        where
      })

      if (isExistedSlug) throw new Error(message.isExisted)
      return true
    }),
  body('level').optional().isInt().withMessage(message.isInt()),
  body('thumbnail').optional({ checkFalsy: true }).isString().withMessage(message.isString),
  body('iconUrl').optional({ checkFalsy: true }).isString().withMessage(message.isString),
  body('specifications').optional({ checkFalsy: true }).isArray().withMessage(message.isArray),
  body('specifications.*.id').isInt().withMessage(message.isInt()),
  body('specifications.*.position').optional({ checkFalsy: true }).isInt({ min: 0 }).withMessage(message.isInt(0, null))
]

const validateParam = [
  param('id')
    .isInt()
    .withMessage(message.isInt)
    .custom(async (id) => {
      const category = await db.Category.findByPk(id)
      if (!category) throw new Error(message.notExist)
      return true
    })
]

const create = [...validateBody]

const update = [...validateBody, ...validateParam]

const destroy = [...validateParam]

const show = [...validateParam]

const showBySlug = [param('slug').isLength(0, 255).withMessage(message.isLength(0, 255)).bail().isSlug().withMessage(message.isSlug)]

module.exports = { create, update, destroy, show, showBySlug }
