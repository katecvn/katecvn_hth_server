const transporter = require("../config/mail");
const { ACCOUNT_STATUS } = require("../constants");
const db = require("../models");
const generateResetPasswordToken = require("../utils/GeneratePasswordResetToken");

const generateUniqueTokenForUser = async (user) => {
    const token = generateResetPasswordToken()

    const existingToken = await db.PasswordResetToken.findOne({ where: { token } })

    if (existingToken) {
        await existingToken.destroy()
        return generateUniqueTokenForUser(user)
    }

    await user.createPasswordResetToken({ token })
    return token
}

const forgotPassword = async (email) => {
    try {
        const user = await db.User.findOne({
            where: { email, status: ACCOUNT_STATUS.ACTIVE }
        })

        const existingToken = await user.getPasswordResetToken()
        if (existingToken) {
            await existingToken.destroy()
        }

        const token = await generateUniqueTokenForUser(user)

        return !!(await sendForgotPasswordEmail(email, token))
    } catch (error) {
        throw new Error(error.message)
    }
}

const sendForgotPasswordEmail = async (email, token) => {
    try {
        const html = `Tuyệt đối không cung cấp OTP cho người khác. Mã OTP là: <strong>${token}</strong> sẽ có hiệu lực trong vòng 15 phút.`

        return await transporter.sendMail({
            from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
            to: email,
            subject: 'Khôi phục mật khẩu',
            html
        })
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = {
    forgotPassword
}