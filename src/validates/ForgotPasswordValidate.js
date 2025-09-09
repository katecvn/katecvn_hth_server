const { body } = require("express-validator")
const { message } = require("../constants/message")
const db = require("../models")
const { ACCOUNT_STATUS } = require("../constants")

const forgotPasswordValidate = [
    body('email')
        .notEmpty()
        .withMessage(message.notEmpty)
        .bail()
        .isEmail()
        .withMessage(message.isEmail)
        .bail()
        .custom(async (email) => {
            const user = await db.User.findOne({
                where: {
                    email,
                    status: ACCOUNT_STATUS.ACTIVE
                }
            })
            if (!user) throw new new Error(message.notExist)
            return true
        })
]

module.exports = { forgotPasswordValidate }