const { body, param } = require('express-validator')
const { message } = require('../../../constants/message')
const db = require('../../../models')
const BASE_STATUS = require('../../../constants/status')

const create = [
  param('provider')
    .isIn(['product'])
    .withMessage(message.isIn(['product'])),
  body('ableId')
    .notEmpty()
    .withMessage(message.notEmpty)
    .bail()
    .isInt()
    .withMessage(message.isInt)
    .bail()
    .custom(async (ableId, { req }) => {
      const { provider } = req.params

      if (provider === 'product') {
        const review = await db.Review.findOne({
          where: {
            ableId: ableId,
            ableType: 'product'
          }
        })
        if (review) {
          throw new Error('Bạn đã đánh giá sản phẩm này rồi.')
        }
      }

      return true
    }),
  body('rating')
    .notEmpty()
    .withMessage(message.notEmpty)
    .bail()
    .isInt({
      min: 1,
      max: 5
    })
    .withMessage(message.isInt(1, 5))
    .bail(),
  body('reviewText')
    .optional({ checkFalsy: true })
    .isLength({
      min: 5,
      max: 500
    })
    .withMessage(message.isLength(5, 500))
]

const validateParams = [
  param('id').custom(async (id) => {
    const review = await db.Review.findByPk(id)
    if (!review) {
      throw new Error(message.notFound)
    }
    return true
  })
]

const updateStatus = [
  ...validateParams,
  body('status')
    .notEmpty()
    .withMessage(message.notEmpty)
    .bail()
    .isIn([BASE_STATUS.ACTIVE, BASE_STATUS.BLOCKED])
    .withMessage(message.isIn([BASE_STATUS.ACTIVE, BASE_STATUS.BLOCKED]))
]

const destroy = [...validateParams]

module.exports = {
  create,
  updateStatus,
  destroy
}
