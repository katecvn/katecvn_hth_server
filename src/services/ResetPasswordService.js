const db = require('../models')

const resetPassword = async (data) => {
    const { token, password } = data

    try {
        const passwordResetToken = await db.PasswordResetToken.findOne({ where: { token } })
        const user = await passwordResetToken.getUser()
        await user.update({ password }) // Không cần hash vì model User đã có hook hash

        await db.AccessLog.update(
            { logoutAt: new Date() },
            {
                where: {
                    user_id: user.id,
                    logoutAt: null
                }
            }
        )

        return !!(await passwordResetToken.destroy())
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = {
    resetPassword
}