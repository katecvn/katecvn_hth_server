const { body } = require('express-validator')
const { message } = require('../constants/message')
const UserService = require('../services/UserService')
const bcrypt = require('bcryptjs')
const db = require('../models')

const login = [
  body('username')
    .notEmpty()
    .bail()
    .withMessage(message.notEmpty)
    .isLength({ max: 100 })
    .withMessage(message.isLength(null, 100))
    .bail()
    .custom(async (username, { req }) => {
      const user = await UserService.getUseByUsername({ username })
      if (!user) throw new Error(message.notExist)

      req.body.user = user

      return true
    }),

  body('password')
    .notEmpty()
    .bail()
    .withMessage(message.notEmpty)
    .custom(async (password, { req }) => {
      const { user } = req.body

      if (!user) {
        throw new Error(message.incorrectPassword)
      }

      const isMatchPassword = await bcrypt.compare(password, user.password)
      if (!isMatchPassword) {
        throw new Error(message.incorrectPassword)
      }

      return true
    })
]

const register = [
  body('email')
    .optional({ checkFalsy: true })
    .isEmail()
    .withMessage(message.isEmail)
    .custom(async (email, { req }) => {
      const existingUserEmail = await db.User.findOne({ where: { email } })
      if (existingUserEmail) throw new Error(message.isExisted)
      return true
    }),
  body('password')
    .notEmpty()
    .withMessage(message.notEmpty)
    .isLength({
      min: 8,
      max: 16
    })
    .withMessage(message.isLength(8, 16)),
  body('confirmPassword')
    .notEmpty()
    .withMessage(message.notEmpty)
    .custom(async (confirmPassword, { req }) => {
      if (confirmPassword !== req.body.password) {
        throw new Error(message.passwordMismatch)
      }
      return true
    }),
  body('username')
    .notEmpty()
    .withMessage(message.notEmpty)
    .bail()
    .isLength({ min: 3, max: 50 })
    .withMessage(message.isLength({ min: 3, max: 50 }))
    .custom(async (username, { req }) => {
      const existingUsername = await db.User.findOne({ where: { username } })
      if (existingUsername) throw new Error(message.isExisted)
      return true
    }),
  body('fullName')
    .optional({ checkFalsy: true })
    .isLength({ min: 3, max: 50 })
    .withMessage(message.isLength({ min: 3, max: 50 }))
]

const login2 = [
  body('username').notEmpty().bail().withMessage(message.notEmpty).isLength({ max: 100 }).withMessage(message.isLength(null, 100)).bail(),

  body('password').notEmpty().bail().withMessage(message.notEmpty)
]

module.exports = { login, register, login2 }
