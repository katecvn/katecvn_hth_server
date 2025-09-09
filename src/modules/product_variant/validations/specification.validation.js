const { body } = require('express-validator')
const { message } = require('../../../constants/message')

const createSpecificationGroup = [
  body('name').notEmpty().withMessage(message.notEmpty).bail().isString().withMessage(message.isString),
  body('position').optional({ checkFalsy: true }).isInt({ min: 0 }).withMessage(message.isInt(0, null))
]

const updateSpecificationGroup = [
  body('name').notEmpty().withMessage(message.notEmpty).bail().isString().withMessage(message.isString),
  body('position').optional({ checkFalsy: true }).isInt({ min: 0 }).withMessage(message.isInt(0, null))
]

const createSpecification = [
  body('name').notEmpty().withMessage(message.notEmpty).bail().isString().withMessage(message.isString),
  body('groupId').notEmpty().withMessage(message.notEmpty).bail().isInt().withMessage(message.isInt()),
  body('isRequired')
    .isInt()
    .withMessage(message.isInt())
    .bail()
    .isIn([0, 1])
    .withMessage(message.isIn([0, 1]))
]

const updateSpecification = [
  body('name').notEmpty().withMessage(message.notEmpty).bail().isString().withMessage(message.isString),
  body('groupId').notEmpty().withMessage(message.notEmpty).bail().isInt().withMessage(message.isInt()),
  body('isRequired')
    .isInt()
    .withMessage(message.isInt())
    .bail()
    .isIn([0, 1])
    .withMessage(message.isIn([0, 1]))
]

module.exports = {
  createSpecificationGroup,
  updateSpecificationGroup,
  createSpecification,
  updateSpecification
}
