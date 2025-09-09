const { message } = require('../constants/message')
const jwt = require('jsonwebtoken')
const db = require('../models')
const UserService = require('../services/UserService')
const ForbiddenException = require('../exceptions/ForbiddenException')
const InternalServerErrorException = require('../exceptions/InternalServerErrorException')
const AuthenticatedException = require('../exceptions/AuthenticatedException')

const createJWT = (id, expiresIn = '180d') => {
  const key = process.env.JWT_SECRET
  let token = null

  try {
    token = jwt.sign({ id }, key, { expiresIn: expiresIn })
  } catch (error) {
    console.log(error.message)
  }

  return token
}

const isValidToken = async ({ access_token }) => {
  return db.AccessLog.findOne({ where: { access_token, logoutAt: { [db.Sequelize.Op.eq]: null } } })
}

/**
 * Middleware function to authenticate a user based on a JWT token.
 *
 * Extracts the token from the request headers and verifies its validity.
 * If the token is missing or invalid, responds with an unauthorized status.
 * If the token is valid, decodes the token to retrieve user information
 * and attaches it to the request object, then proceeds to the next middleware.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 *
 * @throws {AuthenticatedException} If the token is invalid or expired.
 */
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(' ')[1]
    const key = process.env.JWT_SECRET

    if (!token) {
      return next(new AuthenticatedException(message.unauthenticated))
    }

    const validToken = await isValidToken({ access_token: token })

    if (!validToken) {
      return next(new AuthenticatedException(message.invalidToken))
    }
    req.user = jwt.verify(token, key)

    next()
  } catch (error) {
    const messages = { JsonWebTokenError: 'Token không hợp lệ', TokenExpiredError: 'Token đã hết hạn' }
    const message = messages[error.name] || 'Authentication error'
    return next(new AuthenticatedException(message))
  }
}

/**
 * Middleware to authorize user access based on required permissions.
 *
 * @param {(string|string[])} requiredPermissions - The permissions required to access the route.
 *   This can be a single permission as a string or an array of permissions.
 * @param {string} [option="every"] - The option to determine if the user needs to have
 *   "some" or "every" of the required permissions.
 *   - "some": User needs at least one of the required permissions.
 *   - "every": User needs all of the required permissions (default).
 *
 * @returns {Function} Express middleware function that checks the user's permissions.
 *
 * @throws {Error} Throws an error if the user cannot be found or if there is a server error.
 *
 * @example
 * // Route that requires a single permission
 * router.get('/user-profile', authenticate, authorize('user.view'), (req, res) => {
 *     res.send('You have access to view the user profile!');
 * });
 *
 * @example
 * // Route that requires multiple permissions
 * router.post('/user', authenticate, authorize(['user.create', 'user.update']), (req, res) => {
 *     res.send('You have access to create or update users!');
 * });
 */
const authorize = (permissionSlugs = [], option = 'every') => {
  return async (req, res, next) => {
    const { id } = req.user
    const user = await UserService.getUserById({ id })
    req.query = { ...req.query, authId: id }

    if (!permissionSlugs.length) return next()

    const role = user?.roles?.[0] || {}
    const permissions = role?.permissions?.map((item) => item.name) || []

    if (!['every', 'some'].includes(option)) {
      return next(new InternalServerErrorException('Lỗi xác thực quyền truy cập chỉ được phép giá trị "every" hoặc "some"'))
    }

    isValidPermission =
      option === 'every'
        ? permissionSlugs.every((permission) => permissions.includes(permission))
        : permissionSlugs.some((permission) => permissions.includes(permission))

    if (!isValidPermission) {
      return next(new ForbiddenException('Bạn không có quyền truy cập!'))
    }

    req.user = { ...req.user, role, permissions }

    return next()
  }
}

module.exports = { authenticate, authorize, createJWT }
