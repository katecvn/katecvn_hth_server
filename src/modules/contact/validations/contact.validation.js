const { body, param } = require('express-validator')
const { message } = require('../../../constants/message')
const { CONTACT_STATUS } = require('../../../constants')
const db = require('../../../models')
const phoneRegex = /^\+?\d{1,}$/

const create = [
  body('name').isString().withMessage(message.isString).bail().isLength({ min: 3 }).withMessage(message.isLength(3)),
  body('email').optional().isEmail().withMessage(message.isEmail),
  body('phone').notEmpty().withMessage(message.notEmpty).bail().matches(phoneRegex).withMessage(message.invalidPhone),
  body('subject').isString().withMessage(message.isString).bail().isLength({ min: 3 }).withMessage(message.isLength(3)),
  body('message').isString().withMessage(message.isString).bail().isLength({ min: 10 }).withMessage(message.isLength(10))
]

const updateStatus = [
  body('status')
    .notEmpty()
    .withMessage(message.notEmpty)
    .bail()
    .isIn(Object.values(CONTACT_STATUS))
    .withMessage(message.isIn(Object.values(CONTACT_STATUS))),
  param('id').custom(async (id) => {
    const contact = await db.Contact.findByPk(id)
    if (!contact) {
      throw new Error('Không tìm thấy liên hệ.')
    }
    if (contact.status === CONTACT_STATUS.RESOLVED) {
      throw new Error('Liên hệ đã được giải quyết.')
    }
    return true
  })
]

const deleteById = [
  param('id').custom(async (id) => {
    const contact = await db.Contact.findByPk(id)
    if (!contact) {
      throw new Error('Không tìm thấy liên hệ.')
    }
    return true
  })
]

module.exports = {
  create,
  updateStatus,
  deleteById
}
