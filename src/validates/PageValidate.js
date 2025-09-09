const { body, param } = require('express-validator')
const { message } = require('../constants/message')
const PageService = require('../services/PageService')

const validateBody = [
  body('parentId')
    .optional({ checkFalsy: true })
    .isInt()
    .withMessage(message.isInt)
    .bail()
    .custom(async (parentId) => {
      const page = await PageService.getPageById({ id: parentId })
      if (!page) throw new Error(message.notExist)
      return true
    }),

  body('title').notEmpty().withMessage(message.notEmpty).bail().isLength({ max: 255 }).withMessage(message.isLength(0, 255)).bail(),

  body('slug')
    .notEmpty()
    .withMessage(message.notEmpty)
    .bail()
    .isLength({ max: 255 })
    .withMessage(message.isLength(0, 255))
    .bail()
    .custom(async (slug, { req }) => {
      const { id } = req.params

      let conditions = { slug }

      if (id) conditions.notInIds = [id]

      const page = await PageService.getPageBySlug(conditions)
      console.log(page)
      if (page) throw new Error(message.isExisted)

      return true
    }),

  body('template')
    .optional({ checkFalsy: true })
    .isString()
    .withMessage(message.isString)
    .isLength({ max: 255 })
    .withMessage(message.isLength(0, 255))
    .bail(),

  body('content').optional().isString().withMessage(message.isString),

  body('metaTitle').optional().isLength({ max: 255 }).withMessage(message.isLength(0, 255)),

  body('metaDescription').optional().isLength({ max: 500 }).withMessage(message.isLength(0, 500))
]

const showBySlug = [
  param('slug')
    .notEmpty()
    .withMessage(message.notEmpty)
    .bail()
    .isLength({ max: 255 })
    .withMessage(message.isLength(0, 255))
    .bail()
    .custom(async (slug) => {
      const page = await PageService.getPageBySlug({ slug: slug })

      if (!page) throw new Error(message.notFound)

      return true
    })
]

const validateParam = [
  param('id')
    .isInt()
    .withMessage(message.isInt)
    .bail()
    .custom(async (id) => {
      const page = await PageService.getPageById({ id })
      if (!page) throw new Error(message.notExist)
      return true
    })
]

const create = [...validateBody]

const update = [...validateBody, ...validateParam]

const show = [...validateParam]

const destroy = [...validateParam]

module.exports = { create, show, update, destroy, showBySlug }
