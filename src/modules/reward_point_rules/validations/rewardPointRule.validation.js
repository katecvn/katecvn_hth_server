const { body, param } = require('express-validator')
const { message } = require('../../../constants/message')
const db = require('../../../models')
const { Op } = db.Sequelize

const create = [
  body('type')
    .notEmpty().withMessage(message.notEmpty)
    .isIn(['order_value', 'time_slot']).withMessage(message.invalid),

  body('points')
    .notEmpty().withMessage(message.notEmpty)
    .isInt({ min: 0 }).withMessage(message.isInt),

  body('minOrderValue')
    .if(body('type').equals('order_value'))
    .notEmpty().withMessage(message.notEmpty)
    .isFloat({ min: 0 }).withMessage(message.isFloat)
    .bail()
    .custom(async (value) => {
      const exists = await db.RewardPointRule.findOne({
        where: { type: 'order_value', minOrderValue: value },
      })
      if (exists) throw new Error(message.isExisted)
      return true
    }),

  body('beforeTime')
    .if(body('type').equals('time_slot'))
    .notEmpty().withMessage(message.notEmpty)
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Sai định dạng giờ (HH:mm)')
    .bail()
    .custom(async (value) => {
      const exists = await db.RewardPointRule.findOne({
        where: { type: 'time_slot', beforeTime: value },
      })
      if (exists) throw new Error(message.isExisted)
      return true
    }),
]

const update = [
  param('id')
    .notEmpty().withMessage(message.notEmpty)
    .isInt().withMessage(message.isInt),

  body('points')
    .optional()
    .isInt({ min: 0 }).withMessage(message.isInt),

  body('minOrderValue')
    .optional()
    .isFloat({ min: 0 }).withMessage(message.isFloat)
    .bail()
    .custom(async (value, { req }) => {
      const exists = await db.RewardPointRule.findOne({
        where: {
          type: 'order_value',
          minOrderValue: value,
          id: { [Op.ne]: req.params.id },
        },
      })
      if (exists) throw new Error(message.isExisted)
      return true
    }),

  body('beforeTime')
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Sai định dạng giờ (HH:mm)')
    .bail()
    .custom(async (value, { req }) => {
      const exists = await db.RewardPointRule.findOne({
        where: {
          type: 'time_slot',
          beforeTime: value,
          id: { [Op.ne]: req.params.id },
        },
      })
      if (exists) throw new Error(message.isExisted)
      return true
    }),
]

module.exports = {
  create,
  update,
}
