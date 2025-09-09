const { STATUS_CODE } = require('../constants')
const http = require('../utils/http')
const googleOauthService = require('../services/GoogleOauthService')

const redirect = async (req, res, next) => {
  const { from } = req.params

  try {
    const url = await googleOauthService.redirect(from)
    return http.json(res, 'Đường dẫn chuyển hướng', STATUS_CODE.OK, url)
  } catch (error) {
    next(error)
  }
}

const callback = async (req, res, next) => {
  const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  const userAgent = req.get('user-agent')
  const { from } = req.params

  try {
    const data = await googleOauthService.callback({ ...req.query, ipAddress, userAgent, from })
    return http.json(res, 'Đăng nhập thành công', STATUS_CODE.OK, data)
  } catch (error) {
    next(error)
  }
}

module.exports = { redirect, callback }
