const { body, param } = require('express-validator')
const { message } = require('../constants/message')
const BASE_STATUS = require('../constants/status')
const { COMMENT_ABLE_TYPE } = require('../constants')
const CommentService = require('../services/CommentService')
const ServiceException = require('../exceptions/ServiceException')

const create = [
  param('provider')
    .notEmpty()
    .withMessage(message.notEmpty)
    .isIn(Object.values(COMMENT_ABLE_TYPE))
    .withMessage(message.isIn(Object.values(COMMENT_ABLE_TYPE))),
  body('ableId')
    .notEmpty()
    .withMessage(message.notEmpty)
    .isInt()
    .withMessage(message.isInt())
    .custom(async (ableId, { req }) => {
      req.params.provider === COMMENT_ABLE_TYPE.POST ? await CommentService.findPost(ableId) : await CommentService.findProduct(ableId)
      return true
    }),
  body('content')
    .notEmpty()
    .withMessage(message.notEmpty)
    .isString()
    .withMessage(message.isString)
    .isLength({ min: 1 })
    .withMessage(message.isLength(1, null)),
  body('parentId')
    .optional({ checkFalsy: true })
    .isInt()
    .withMessage(message.isInt())
    .custom(async (value, { req }) => {
      await CommentService.findComment(value, req.params.provider)
      return true
    }),
  body('replyTo').optional({ checkFalsy: true }).isInt().withMessage(message.isInt())
]

const shows = [
  param('provider')
    .notEmpty()
    .withMessage(message.notEmpty)
    .isIn(Object.values(COMMENT_ABLE_TYPE))
    .withMessage(message.isIn(Object.values(COMMENT_ABLE_TYPE)))
]

const updateStatus = [
  param('provider')
    .notEmpty()
    .withMessage(message.notEmpty)
    .isIn(Object.values(COMMENT_ABLE_TYPE))
    .withMessage(message.isIn(Object.values(COMMENT_ABLE_TYPE))),
  body('status')
    .notEmpty()
    .withMessage(message.notEmpty)
    .isIn(Object.values(BASE_STATUS))
    .withMessage(message.isIn(Object.values(BASE_STATUS)))
]

const update = [
  param('provider')
    .notEmpty()
    .withMessage(message.notEmpty)
    .isIn(Object.values(COMMENT_ABLE_TYPE))
    .withMessage(message.isIn(Object.values(COMMENT_ABLE_TYPE))),
  body('content')
    .notEmpty()
    .withMessage(message.notEmpty)
    .isString()
    .withMessage(message.isString)
    .isLength({ min: 1 })
    .withMessage(message.isLength(1, null))
    .bail()
    .custom(async (value, { req }) => {
      const comment = await CommentService.findComment(req.params.id)
      if (req.user.id !== comment.userId) {
        throw new ServiceException('Không thể sửa bình luận của người khác.')
      }
      return true
    })
]

const deleteByUser = [
  param('id')
    .notEmpty()
    .withMessage(message.notEmpty)
    .isInt()
    .withMessage(message.isInt())
    .custom(async (value, { req }) => {
      const comment = await CommentService.findComment(value)
      if (req.user.id !== comment.userId) {
        throw new ServiceException('Không thể xóa bình luận của người khác.')
      }
      return true
    })
]

module.exports = { create, updateStatus, shows, update, deleteByUser }
