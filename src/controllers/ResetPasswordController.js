const { STATUS_CODE } = require("../constants")
const http = require("../utils/http")
const ResetPasswordService = require('../services/ResetPasswordService')

const resetPassword = async (req, res, next) => {
    const data = req.body

    try {
        await ResetPasswordService.resetPassword(data)
        return http.json(res, 'Cập nhật mật khẩu thành công', STATUS_CODE.OK)
    } catch (error) {
        next(error)
    }
}

module.exports = {
    resetPassword
}