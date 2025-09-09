const { body } = require('express-validator')
const { message } = require('../constants/message')
const BASE_STATUS = require('../constants/status')
const TopicService = require('../services/TopicService')

const create = [
  body('name')
    .notEmpty()
    .withMessage(message.notEmpty)
    .isLength({ max: 100 })
    .withMessage(message.isLength(null, 100)),
  body('slug')
    .custom(async (slug, { req }) => {
      const existingSlug = await TopicService.checkExistingSlug(slug)
      if (existingSlug) {
        throw new Error(message.isExisted)
      }
      return true
    }),
  body('parentId')
    .optional()
    .isInt()
    .withMessage(message.isInt())
    .custom(async (parentId, { req }) => {
      await TopicService.findTopic(parentId)
      return true
    }),
  body('status')
    .notEmpty()
    .withMessage(message.notEmpty)
    .isIn(Object.values(BASE_STATUS))
    .withMessage(message.isIn(Object.values(BASE_STATUS)))
]

const update = [
  body('name')
    .notEmpty()
    .withMessage(message.notEmpty)
    .isLength({ max: 100 })
    .withMessage(message.isLength(null, 100)),
  body('slug')
    .custom(async (slug, { req }) => {
      const existingSlug = await TopicService.checkExistingSlug(slug, req.params.id)
      if (existingSlug) {
        throw new Error(message.isExisted)
      }
      return true
    }),
  body('parentId')
    .optional()
    .isInt()
    .withMessage(message.isInt())
    .custom(async (parentId, { req }) => {
      await TopicService.findTopic(parentId)
      if (parentId === req.params.id) {
        throw new Error('Chủ đề cha không thể trùng với chủ đề hiện tại')
      }
      return true
    }),
  body('status')
    .optional()
    .isIn(Object.values(BASE_STATUS))
    .withMessage(message.isIn(Object.values(BASE_STATUS)))
]

const updateStatus = [
  body('status')
    .notEmpty()
    .withMessage(message.notEmpty)
    .isIn(Object.values(BASE_STATUS))
    .withMessage(message.isIn(Object.values(BASE_STATUS)))
]

module.exports = { create, update, updateStatus }
