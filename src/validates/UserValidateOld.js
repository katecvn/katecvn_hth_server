const { body, query } = require('express-validator')
const { message } = require('../constants/message')
const UserService = require('../services/UserService')
const RoleService = require('../services/RoleService')
const { STATUS_CODE } = require('../constants')
const { validateVietnamesePhone } = require('./ValidateOther')

const bodyUserInfo = [
  body('role_id')
    .notEmpty()
    .withMessage(message.notEmpty)
    .bail()
    .custom(async (role_id, { req }) => {
      const getRole = await RoleService.getRoleById({ id: role_id })

      if (!getRole) throw new Error(message.notExist)

      return true
    }),
  body('code')
    .optional({ checkFalsy: true })
    .isLength({ max: 20 })
    .withMessage(message.isLength(null, 20))
    .bail()
    .custom(async (code, { req }) => {
      const { id } = req.body

      const getUser = await UserService.getUseByCode({ code: code, notInIds: [id] })

      if (getUser.status === STATUS_CODE.OK) throw new Error(message.isExisted)

      return true
    }),
  body('full_name').notEmpty().withMessage(message.notEmpty).bail().isLength({ max: 100 }).withMessage(message.isLength(null, 100)).bail(),
  body('phone_number')
    .optional({ checkFalsy: true })
    .isLength({ max: 20 })
    .withMessage(message.isLength(null, 20))
    .bail()
    .custom(async (userPhone, { req }) => {
      if (!validateVietnamesePhone(String(userPhone))) throw new Error(message.invalidPhone)
      const { id } = req.body

      const getUser = await UserService.getUser({ userPhone, notInIds: [id] })

      if (getUser.status === STATUS_CODE.OK) throw new Error(message.isExisted)

      return true
    }),
  body('email')
    .optional({ checkFalsy: true })
    .isLength({ max: 100 })
    .withMessage(message.isLength(null, 100))
    .bail()
    .isEmail()
    .withMessage(message.isEmail)
    .bail()
    .custom(async (userEmail, { req }) => {
      const { id } = req.body

      const getUser = await UserService.getUser({ userEmail, notInIds: [id] })

      if (getUser.status === STATUS_CODE.OK) throw new Error(message.isExisted)

      return true
    }),
  body('userAddress').optional({ checkFalsy: true }).isLength({ max: 255 }).withMessage(message.isLength(null, 255))
]

const create = [
  ...bodyUserInfo,
  body('account')
    .notEmpty()
    .withMessage(message.notEmpty)
    .bail()
    .isLength({ max: 255 })
    .withMessage(message.isLength(null, 255))
    .bail()
    .custom(async (account, { req }) => {
      const getUser = await UserService.getUser({ account })

      if (getUser.status === STATUS_CODE.OK) throw new Error(message.isExisted)

      return true
    }),
  body('password')
    .notEmpty()
    .withMessage(message.notEmpty)
    .bail()
    .isStrongPassword({ minLength: 8, minSymbols: 1, minUppercase: 1, minNumbers: 1 })
    .withMessage(message.isStrongPassword)
    .bail()
    .isLength({ max: 255 })
    .withMessage(message.isLength(null, 255)),
  body('rePassword')
    .if((rePassword, { req }) => req.body.password)
    .notEmpty()
    .withMessage(message.notEmpty)
    .bail()
    .isStrongPassword({ minLength: 8, minSymbols: 1, minUppercase: 1, minNumbers: 1 })
    .withMessage(message.isStrongPassword)
    .bail()
    .isLength({ min: 8, max: 255 })
    .withMessage(message.isLength(8, 255))
    .bail()
    .custom((rePassword, { req }) => {
      if (rePassword !== req.body.password) throw new Error(message.passwordMismatch)

      return true
    })
]

const show = [
  query('id')
    .notEmpty()
    .bail()
    .withMessage(message.notEmpty)
    .custom(async (id, { req }) => {
      const getUser = await UserService.getUser({ id: id })

      if (getUser.status !== STATUS_CODE.OK) throw new Error(message.notExist)

      req.userData = getUser.data

      return true
    })
]

const update = [
  ...bodyUserInfo,
  body('id')
    .notEmpty()
    .withMessage(message.notEmpty)
    .bail()
    .isLength({ max: 255 })
    .withMessage(message.isLength(null, 255))
    .bail()
    .custom(async (id, { req }) => {
      const getUser = await UserService.getUser({ id })

      if (getUser.status !== STATUS_CODE.OK) throw new Error(message.notExist)

      req.userData = getUser.data

      return true
    }),
  body('account')
    .optional({ checkFalsy: true })
    .isLength({ max: 255 })
    .withMessage(message.isLength(null, 255))
    .bail()
    .custom(async (account, { req }) => {
      const { id } = req.body

      const getUser = await UserService.getUser({ account, notInIds: [id] })

      if (getUser.status === STATUS_CODE.OK) throw new Error(message.isExisted)

      return true
    }),
  body('password')
    .if((password, { req }) => req.body.account)
    .optional({ checkFalsy: true })
    .isStrongPassword({ minLength: 8, minSymbols: 1, minUppercase: 1, minNumbers: 1 })
    .withMessage(message.isStrongPassword)
    .bail()
    .isLength({ max: 255 })
    .withMessage(message.isLength(null, 255)),
  body('rePassword')
    .if((rePassword, { req }) => req.body.password)
    .notEmpty()
    .withMessage(message.notEmpty)
    .bail()
    .isStrongPassword({ minLength: 8, minSymbols: 1, minUppercase: 1, minNumbers: 1 })
    .withMessage(message.isStrongPassword)
    .bail()
    .isLength({ min: 8, max: 255 })
    .withMessage(message.isLength(8, 255))
    .bail()
    .custom((rePassword, { req }) => {
      if (rePassword !== req.body.password) throw new Error(message.passwordMismatch)

      return true
    })
]

const destroy = [
  body('ids').notEmpty().bail().withMessage(message.notEmpty).bail().isArray().withMessage(message.isArray),
  body('ids.*').custom(async (id, { req }) => {
    if (id === 1) throw new Error(message.youDoNotHaveAccess)

    const getUser = await UserService.getUser({ id: id })

    if (getUser.status !== STATUS_CODE.OK) throw new Error(message.notExist)

    req.userData = getUser.data

    return true
  })
]

module.exports = { create, show, update, destroy }
