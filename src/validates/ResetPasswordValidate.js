const { body } = require("express-validator")
const { message } = require("../constants/message")
const db = require("../models")
const getDateNow = require("../utils/Timestamp")

const resetPasswordValidate = [
    body('token')
        .notEmpty()
        .bail()
        .withMessage(message.notEmpty)
        .isString()
        .withMessage(message.isString)
        .custom(async (token) => {
            const passwordResetToken = await db.PasswordResetToken.findOne({ where: { token } })

            if (!passwordResetToken) {
                throw new Error('Mã xác nhận không hợp lệ')
            }

            const currentTime = getDateNow().timestamp
            const tokenCreationTime = passwordResetToken.createdAt
            const expirationTime = 15 * 60

            if (currentTime - tokenCreationTime > expirationTime) {
                await passwordResetToken.destroy()
                throw new Error('Mã xác nhận đã hết hiệu lực')
            }

            return true
        }),

    body('password').notEmpty().bail().withMessage(message.notEmpty).isLength({ min: 8, max: 64 }).bail().withMessage(message.isLength(8, 64)),

    body('confirmPassword')
        .exists({ checkFalsy: true })
        .bail()
        .withMessage(message.confirmPassword)
        .custom((value, { req }) => value === req.body.password)
        .withMessage(message.passwordMismatch)
]

module.exports = { resetPasswordValidate }