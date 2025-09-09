const { STATUS_CODE } = require('../constants')
const { message } = require('../constants/message')
const InternalServerErrorException = require('../exceptions/InternalServerErrorException')
const AuthService = require('../services/AuthService')
const { sendResponse } = require('../utils/APIResponse')
const http = require('../utils/http')

const login = async (req, res, next) => {
  const { user } = { ...req.body }
  const ipAddress = req.ip
  const userAgent = req.headers['user-agent']

  try {
    const token = await AuthService.login({ user, ipAddress, userAgent })
    return http.json(res, message.loginSuccessfully, STATUS_CODE.OK, token)
  } catch (e) {
    next(new InternalServerErrorException(e.message))
  }
}

const logout = async (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(' ')[1]

    const handleLogout = await AuthService.logout({ access_token: token })

    return sendResponse(res, handleLogout)
  } catch (e) {
    next(new InternalServerErrorException(e.message))
  }
}

const authenticated = async (req, res, next) => {
  const { user } = req
  try {
    const authUser = await AuthService.authenticated(user.id)
    return http.json(res, 'Thông tin người dùng đăng nhập', STATUS_CODE.OK, authUser)
  } catch (error) {
    next(new InternalServerErrorException(error.message))
  }
}

const register = async (req, res, next) => {
  const data = req.body

  try {
    await AuthService.register(data)
    return http.json(res, 'Đăng ký thành công', STATUS_CODE.OK)
  } catch (error) {
    next(new InternalServerErrorException(error.message))
  }
}

module.exports = { login, logout, authenticated, register }
