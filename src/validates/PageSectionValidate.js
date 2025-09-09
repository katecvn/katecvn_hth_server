const { body, param, query } = require('express-validator')
const { message } = require('../constants/message')
const PageSectionService = require('../services/PageSectionService')
const PageService = require('../services/PageService')

const validateBody = [
  body('pageId')
    .notEmpty()
    .withMessage(message.notEmpty)
    .bail()
    .isInt()
    .withMessage(message.isInt)
    .bail()
    .custom(async (pageId) => {
      const page = await PageService.getPageById({ id: pageId })
      if (!page) throw new Error(message.notExist)
      return true
    }),
  body('sectionType').notEmpty().withMessage(message.notEmpty).isLength({ max: 255 }).withMessage(message.isLength(0, 255)),
  body('content')
    .optional()
    .custom((value) => {
      if (typeof value !== 'string' && typeof value !== 'object') {
        throw new Error('Content phải là string, object hoặc array')
      }
      return true
    })
    .withMessage('Content không hợp lệ'),
  body('position').optional().isInt().withMessage(message.isInt())
]

const validateParam = [
  param('id')
    .isInt()
    .withMessage(message.isInt)
    .custom(async (id) => {
      const section = await PageSectionService.getPageSectionById({ id })
      if (!section) throw new Error(message.notExist)
      return true
    })
]

const shows = [
  query('pageId')
    .optional()
    .isInt()
    .withMessage(message.isInt)
    .bail()
    .custom(async (pageId) => {
      const page = await PageService.getPageById({ id: pageId })
      if (!page) throw new Error(message.notExist)
      return true
    }),

  query('pageSlug')
    .optional()
    .custom(async (pageSlug) => {
      const page = await PageService.getPageBySlug({ slug: pageSlug })
      if (!page) throw new Error(message.notExist)
      return true
    })
]

const create = [...validateBody]

const update = [...validateParam, ...validateBody]

const show = [...validateParam]

const destroy = [...validateParam]

module.exports = { create, show, shows, update, destroy }
