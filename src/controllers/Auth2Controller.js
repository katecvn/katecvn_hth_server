const { generateAccessToken, generateRefreshToken, verifyRefreshToken, verifyAccessToken } = require('../utils/jwt')
const { comparePassword } = require('../utils/bcrypt')
const UserService = require('../services/UserService')
const { message } = require('../constants/message')
const { STATUS_CODE } = require('../constants')
const { sendResponse } = require('../utils/APIResponse')
const ServiceException = require('../exceptions/ServiceException')
const AuthService = require('../services/AuthService')

const authenticate2 = async (req, res, next) => {
  try {
    const accessToken = req.cookies?.accessToken

    // const userAgent = req.headers['user-agent']

    if (!accessToken) {
      throw new ServiceException(message.noAccessTokenProvided, STATUS_CODE.UNAUTHORIZED)
    }

    const decoded = verifyAccessToken(accessToken)

    if (!decoded) {
      throw new ServiceException(message.invalidToken, STATUS_CODE.UNAUTHORIZED)
    }

    const user = await UserService.getUserById({ id: decoded.id })

    if (!user) {
      throw new ServiceException(message.notFoundUser, STATUS_CODE.NOT_FOUND)
    }

    const permissionNames = Array.from(new Set(user?.roles.flatMap((role) => role?.permissions.map((p) => p.name))))

    req.user = {
      id: decoded.id,
      username: decoded.username,
      fullName: user.full_name,
      permissions: permissionNames
    }

    next()
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const authorize2 = (permissionSlugs = [], option = 'every') => {
  return async (req, res, next) => {
    try {
      req.query = { ...req.query }

      const user = req.user

      if (!permissionSlugs.length) return next()

      const permissions = user?.permissions || []

      if (!['every', 'some'].includes(option)) {
        throw new ServiceException('Lỗi xác thực quyền truy cập chỉ được phép giá trị "every" hoặc "some"', 500)
      }

      isValidPermission =
        option === 'every'
          ? permissionSlugs.every((permission) => permissions.includes(permission))
          : permissionSlugs.some((permission) => permissions.includes(permission))

      if (!isValidPermission) {
        throw new ServiceException('Bạn không có quyền truy cập!', 403)
      }

      return next()
    } catch (error) {
      return sendResponse(res, { status: error.status, messages: error.message })
    }
  }
}

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body
    const ipAddress = req.ip
    const userAgent = req.headers['user-agent']

    const user = await UserService.getUserByUsername({ username })

    if (!user) {
      throw new ServiceException(message.invalidUsernameOrPassword, STATUS_CODE.UNAUTHORIZED)
    }

    const isPasswordValid = await comparePassword(password, user.password)

    if (!isPasswordValid) {
      throw new ServiceException(message.invalidUsernameOrPassword, STATUS_CODE.UNAUTHORIZED)
    }
    const accessToken = generateAccessToken({ id: user.id, username: user.username })

    const refreshToken = generateRefreshToken({ id: user.id, username: user.username })

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'None',
      maxAge: 15 * 60 * 1000
      // domain: '.domain.com',
    })

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'None',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    await AuthService.createAccessLog({
      user_id: user.id,
      ip_address: ipAddress,
      user_agent: userAgent,
      access_token: refreshToken,
      status: 'success',
      domain: 'localhost',
      message: 'User logged in successfully'
    })

    const permissionNames = Array.from(new Set(user?.roles.flatMap((role) => role?.permissions.map((p) => p.name))))

    const result = {
      userInformation: {
        id: user.id,
        code: user.code,
        full_name: user.full_name,
        avatar_url: user.avatar_url,
        username: user.username,
        email: user.email,
        phone_number: user.phone_number,
        address: user.address,
        roles: user?.roles?.map((item) => {
          return {
            id: item.id,
            name: item.name
          }
        }),
        permissions: permissionNames
      }
    }

    return sendResponse(res, { status: STATUS_CODE.OK, messages: message.loginSuccessfully, data: result })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
      throw new ServiceException(message.noRefreshTokenProvided, STATUS_CODE.UNAUTHORIZED)
    }

    const logout = await AuthService.logout({ access_token: refreshToken })

    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })

    return sendResponse(res, { status: STATUS_CODE.OK, messages: message.logoutSuccessfully })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken

    if (!refreshToken) {
      throw new ServiceException(message.noRefreshTokenProvided, STATUS_CODE.UNAUTHORIZED)
    }

    const decoded = verifyRefreshToken(refreshToken)

    if (!decoded) {
      throw new ServiceException(message.invalidToken, STATUS_CODE.UNAUTHORIZED)
    }

    const user = await UserService.getUserById({ id: decoded.id })

    if (!user) {
      throw new ServiceException(message.notFoundUser, STATUS_CODE.NOT_FOUND)
    }

    const newAccessToken = generateAccessToken({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      permissions: user.permissions
    })

    const newRefreshToken = generateRefreshToken({
      id: user.id,
      username: user.username,
      email: user.email
    })

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      maxAge: 15 * 60 * 1000
    })

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    const result = {
      userInformation: {
        id: user.id,
        code: user.code,
        full_name: user.full_name,
        avatar_url: user.avatar_url,
        username: user.username,
        email: user.email,
        phone_number: user.phone_number,
        address: user.address,
        roles: user.roles
      }
    }

    return sendResponse(res, { status: STATUS_CODE.OK, messages: message.refreshTokenSuccessfully, data: result })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const checkAuth = async (req, res, next) => {
  try {
    const { id } = req.user

    res.json({
      user: req.user
    })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

module.exports = {
  login,
  checkAuth,
  refreshToken,
  logout,
  authenticate2,
  authorize2
}
