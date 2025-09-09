const { body, param } = require('express-validator')
const { message } = require('../constants/message')
const BASE_STATUS = require('../constants/status')
const db = require('../models')
const { Op } = require('sequelize')

const create = [
  body('title')
    .notEmpty()
    .withMessage(message.notEmpty)
    .isLength({ min: 3, max: 100 })
    .withMessage(message.isLength(3, 100))
    .isString()
    .withMessage(message.isString),
  body('slug')
    .isString()
    .withMessage(message.isString)
    .custom(async (slug) => {
      const existingSlug = await db.Post.findOne({ where: { slug } })
      if (existingSlug) {
        throw new Error(message.isExisted)
      }
      return true
    }),
  body('content').notEmpty().withMessage(message.notEmpty).isLength({ min: 5, max: 65535 }).withMessage('Nội dung quá dài'),
  body('thumbnail').optional().isString().withMessage(message.isString),
  body('metaTitle').optional().isString().withMessage(message.isString),
  body('metaDescription').optional().isString().withMessage(message.isString),
  body('metaKeywords').optional().isString().withMessage(message.isString),
  body('topics').notEmpty().withMessage(message.notEmpty).isArray({ min: 0 }).withMessage(message.isArray),
  body('topics.*')
    .isInt()
    .withMessage(message.isInt())
    .custom(async (id) => {
      const topic = await db.Topic.findByPk(id)
      if (!topic) {
        throw new Error('Không tìm thấy chủ đề.')
      }
      return true
    })
]

const update = [
  param('id').custom(async (id) => {
    const post = await db.Post.findByPk(id)
    if (!post) {
      throw new Error('Không tìm thấy bài viết.')
    }
    if (post.status === BASE_STATUS.ACTIVE || post.status === BASE_STATUS.PUBLISHED) {
      throw new Error('Bài viết đã được duyệt. Không thể cập nhật.')
    }
    return true
  }),
  body('title').isString().withMessage(message.isString).isLength({ min: 3, max: 100 }).withMessage(message.isLength(3, 100)),
  body('slug')
    .optional()
    .isString()
    .withMessage(message.isString)
    .bail()
    .custom(async (slug, { req }) => {
      const id = req.params.id
      const existingSlug = await db.Post.findOne({
        where: { slug, id: { [Op.ne]: id } }
      })
      if (existingSlug) {
        throw new Error(message.isExisted)
      }
      return true
    }),
  body('content').notEmpty().withMessage(message.notEmpty).isLength({ min: 5, max: 65535 }).withMessage('Nội dung quá dài'),
  body('thumbnail').optional().isString().withMessage(message.isString),
  body('metaTitle').optional().isString().withMessage(message.isString),
  body('metaDescription').optional().isString().withMessage(message.isString),
  body('metaKeywords').optional().isString().withMessage(message.isString),
  body('topics').notEmpty().withMessage(message.notEmpty).isArray({ min: 1 }).withMessage(message.isArray),
  body('topics.*')
    .isInt()
    .withMessage(message.isInt())
    .custom(async (id) => {
      const topic = await db.Topic.findByPk(id)
      if (!topic) {
        throw new Error('Không tìm thấy chủ đề.')
      }
      return true
    })
]

const updateStatus = [
  body('status')
    .notEmpty()
    .withMessage(message.notEmpty)
    .isIn(Object.values(BASE_STATUS))
    .withMessage(message.isIn(Object.values(BASE_STATUS)))
]

const deleteById = [
  param('id').custom(async (id) => {
    const post = await db.Post.findByPk(id)
    if (!post) {
      throw new Error('Không tìm thấy bài viết.')
    }
    if (post.status === BASE_STATUS.ACTIVE || post.status === BASE_STATUS.PUBLISHED) {
      throw new Error('Không thể xóa bài viết đã duyệt.')
    }
    return true
  })
]

module.exports = { create, update, updateStatus, deleteById }
