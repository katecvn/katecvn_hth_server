const { body, param, query } = require('express-validator')
const { message } = require('../constants/message')
const UserService = require('../services/UserService')
const RoleService = require('../services/RoleService')
const bcrypt = require('bcryptjs')
const AUTH_PROVIDER = require('../constants/auth-provider')
const { validateVietnamesePhone } = require('./ValidateOther')

const validateBody = [
  body('role_id').custom(async (role_id, { req }) => {
    const user = await UserService.getUserById({ id: req.params.id })

    if (user?.user_type === 'customer' || req.body.user_type === 'customer') {
      // Bỏ qua validate nếu là customer
      return true
    }

    if (!role_id) throw new Error(message.notEmpty)
    if (!Number.isInteger(Number(role_id))) throw new Error(message.isInt)

    const getRole = await RoleService.getRoleById({ id: role_id })
    if (!getRole) throw new Error(message.notExist)

    return true
  }),

  body('code')
    .optional({ checkFalsy: true })
    .isLength({ max: 50 })
    .withMessage(message.isLength(0, 50))
    .custom(async (code, { req }) => {
      const { id } = req.params

      let conditions = { code }

      if (id) conditions.notInIds = [id]

      const existingUser = await UserService.getUserByCode(conditions)

      if (existingUser) throw new Error(message.isExisted)

      return true
    }),

  body('full_name').notEmpty().withMessage(message.notEmpty).isLength({ max: 255 }).withMessage(message.isLength(0, 255)),

  body('date_of_birth').optional({ checkFalsy: true }).isISO8601().withMessage(message.invalidDate),

  body('gender')
    .optional({ checkFalsy: true })
    .isIn(['male', 'female', 'other'])
    .withMessage(message.isIn(['male', 'female', 'other'])),

  body('email')
    .optional({ checkFalsy: true })
    .isEmail()
    .withMessage(message.invalidEmail)
    .custom(async (email, { req }) => {
      const { id } = req.params

      let conditions = { email }

      if (id) conditions.notInIds = [id]

      const existingUser = await UserService.getUserByEmail(conditions)

      if (existingUser) throw new Error(message.isExisted)

      return true
    }),

  body('phone_number').optional({ checkFalsy: true }).isMobilePhone('vi-VN').withMessage(message.invalidPhone),

  body('avatar_url').optional({ checkFalsy: true }).isURL().withMessage(message.invalidUrl),

  body('address').optional({ checkFalsy: true }).isLength({ max: 500 }).withMessage(message.isLength(0, 500))
]

const validateParam = [
  param('id')
    .isInt()
    .withMessage(message.isInt)
    .custom(async (id) => {
      const user = await UserService.getUserById({ id })
      if (!user) throw new Error(message.notExist)
      return true
    })
]

const create = [
  ...validateBody,
  body('username')
    .optional({ checkFalsy: true })
    .isLength({ max: 100 })
    .withMessage(message.isLength(0, 100))
    .custom(async (username, { req }) => {
      let conditions = { username }

      const existingUser = await UserService.getUserByUsername(conditions)

      if (existingUser) throw new Error(message.isExisted)
      return true
    }),

  body('password')
    .if((password, { req }) => req.body?.username)
    .notEmpty()
    .withMessage(message.notEmpty)
    .bail()
    .isStrongPassword({ minLength: 8, minSymbols: 1, minUppercase: 1, minNumbers: 1 })
    .withMessage(message.isStrongPassword)
    .bail()
    .isLength({ min: 8, max: 255 })
    .withMessage(message.isLength(8, 255)),

  body('rePassword')
    .if((rePassword, { req }) => req.body?.username)
    .notEmpty()
    .withMessage(message.notEmpty)
    .bail()
    .isStrongPassword({ minLength: 8, minSymbols: 1, minUppercase: 1, minNumbers: 1 })
    .withMessage(message.isStrongPassword)
    .bail()
    .isLength({ min: 8, max: 255 })
    .withMessage(message.isLength(8, 255))
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error(message.passwordMismatch)
      }
      return true
    })
]
const update = [...validateBody, ...validateParam]
const show = [...validateParam]

const changePassword = [
  body('username')
    .optional({ checkFalsy: true })
    .isLength({ max: 100 })
    .withMessage(message.isLength(0, 100))
    .custom(async (username, { req }) => {
      const user = req.user

      const userId = user.id

      const existingUser = await UserService.getUserByUsername({ notInIds: [userId], username })

      if (existingUser) throw new Error(message.isExisted)
      return true
    }),
  body('old_password')
    .notEmpty()
    .withMessage(message.notEmpty)
    .custom(async (old_password, { req }) => {
      const authId = req.user.id

      const userData = await UserService.getUserById({ id: authId })

      const isMatch = bcrypt.compareSync(old_password, userData.password)

      if (!isMatch) {
        throw new Error(message.oldPasswordIsIncorrect)
      }

      return true
    }),

  body('new_password')
    .optional({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage(message.isLength(6, null))
    .custom((value, { req }) => {
      if (value === req.body.old_password) {
        throw new Error(message.notTheSameOldPassword)
      }
      return true
    }),
  body('confirm_password')
    .if((confirm_password, { req }) => req.body?.new_password)
    .notEmpty()
    .withMessage(message.notEmpty)
    .bail()
    .custom((value, { req }) => {
      if (value !== req.body.new_password) {
        throw new Error(message.passwordMismatch)
      }
      return true
    })
]

const destroy = [
  param('id')
    .isInt()
    .withMessage(message.isInt)
    .custom(async (id, { req }) => {
      const user = req.user

      if (Number(id) === user.id) {
        throw new Error(message.canDeleteYourself)
      }

      const getUser = await UserService.getUserById({ id })

      if (!getUser) throw new Error(message.notExist)

      if (Number(id) === 1) throw new Error(message.cannotDeleteAdmin)

      return true
    })
]

const validateQuery = [
  query('type')
    .optional()
    .isIn(Object.values(AUTH_PROVIDER))
    .withMessage(message.isIn(Object.values(AUTH_PROVIDER)))
]

const updateProfile = [
  body('code')
    .optional({ checkFalsy: true })
    .isLength({ max: 20 })
    .withMessage(message.isLength(0, 20))
    .custom(async (code, { req }) => {
      const existingUser = await UserService.getUserByCode({ code, notInIds: [req.user.id] })
      if (existingUser) {
        throw new Error(message.isExisted)
      }
      return true
    }),

  body('full_name').notEmpty().withMessage(message.notEmpty).bail().isLength({ min: 2, max: 50 }).withMessage(message.isLength(2, 50)),

  body('date_of_birth')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('Ngày sinh không hợp lệ')
    .bail()
    .isBefore(new Date().toISOString().split('T')[0])
    .withMessage('Ngày sinh phải trước ngày hiện tại'),

  body('gender')
    .optional({ checkFalsy: true })
    .isIn(['male', 'female', 'other'])
    .withMessage(message.isIn(['male', 'female', 'other'])),

  body('email').notEmpty().withMessage(message.notEmpty).bail().isEmail().withMessage('Email không hợp lệ'),

  body('phone_number')
    .optional({ checkFalsy: true })
    .custom((phone) => {
      if (!validateVietnamesePhone(phone)) {
        throw new Error('Số điện thoại không hợp lệ')
      }
      return true
    }),

  body('avatar_url').optional({ checkFalsy: true }).isURL().withMessage('Avatar phải là một URL hợp lệ'),

  body('address').optional({ checkFalsy: true }).isLength({ max: 255 }).withMessage(message.isLength(0, 255))
]

const addressBody = [
  body('name').notEmpty().withMessage(message.notEmpty).bail().isString().withMessage(message.isString),
  body('address').notEmpty().withMessage(message.notEmpty).bail().isString().withMessage(message.isString),
  body('phone')
    .notEmpty()
    .withMessage(message.notEmpty)
    .bail()
    .custom((phone) => {
      if (!validateVietnamesePhone(phone)) {
        throw new Error('Số điện thoại không hợp lệ')
      }
      return true
    })
]

module.exports = { create, show, update, destroy, changePassword, validateQuery, updateProfile, addressBody }
