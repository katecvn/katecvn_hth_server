const { STATUS_CODE } = require("../constants")
const ForgotPasswordService = require("../services/ForgotPasswordService")
const http = require("../utils/http")

const forgotPassword = async (req, res, next) => {
    const { email } = req.body

    try {
        const forgotPassword = await ForgotPasswordService.forgotPassword(email)
        return http.json(res, 'Gửi yêu cầu thành công. Vui lòng kiểm tra email', STATUS_CODE.OK, forgotPassword)
    } catch (error) {
        next(error)
    }
}

module.exports = {
    forgotPassword
}