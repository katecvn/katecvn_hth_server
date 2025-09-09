const { OAuth2Client } = require('google-auth-library')
const db = require('../models')
const AUTH_PROVIDER = require('../constants/auth-provider')
const NotFoundException = require('../exceptions/NotFoundException')
const { ACCOUNT_STATUS } = require('../constants')
const { createJWT } = require('../middlewares/JWTAction')
const AuthService = require('../services/AuthService')
const generatePassword = require('../utils/GenerateRandomPassword')

const initializeOauth2Client = (from) => {
  const googleClientId = process.env.GOOGLE_CLIENT_ID
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET
  const redirectUri = {
    admin: process.env.GOOGLE_REDIRECT_ADMIN_URI,
    customer: process.env.GOOGLE_REDIRECT_CUSTOMER_URI
  }
  const googleRedirectUri = redirectUri[from]

  return new OAuth2Client(googleClientId, googleClientSecret, googleRedirectUri)
}

const redirect = async (from) => {
  const scope = ['https://www.googleapis.com/auth/userinfo.profile', 'email']
  const oAuth2Client = initializeOauth2Client(from)

  return oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope,
    prompt: 'consent'
  })
}

const callback = async (data) => {
  const { code, ipAddress, userAgent, from } = data
  const oAuth2Client = initializeOauth2Client(from)
  const tokenResponse = await oAuth2Client.getToken(code)
  const idToken = tokenResponse.tokens.id_token
  const verifiedPayload = await oAuth2Client.verifyIdToken({ idToken })
  const socialAccount = verifiedPayload.getPayload()
  const { email, name } = socialAccount

  return from === AUTH_PROVIDER.ADMIN
    ? handleAdminLogin({ email, userType: AUTH_PROVIDER.ADMIN, ipAddress, userAgent })
    : handleCustomerLogin({ email, name, userType: AUTH_PROVIDER.CUSTOMER, ipAddress, userAgent })
}

const findUserByEmail = async ({ email, user_type }) => {
  const conditions = { email }
  if (user_type) {
    conditions.user_type = user_type
  }
  return await db.User.findOne({
    where: conditions
  })
}

const handleLogin = async (data) => {
  const { userId, ipAddress, userAgent } = data
  const token = createJWT(userId)

  await AuthService.createAccessLog({
    user_id: userId,
    ip_address: ipAddress,
    user_agent: userAgent,
    access_token: token,
    status: 'success',
    message: 'User logged in successfully'
  })

  const userInformation = await AuthService.authenticated(userId)

  return { token, userInformation }
}

const handleCustomerLogin = async (data) => {
  const { email, name, userType, ipAddress, userAgent } = data
  const user = await findUserByEmail({ email })
  const hashedPassword = generatePassword()

  const findUser = user
    ? user
    : await db.User.create({
        full_name: name,
        email,
        username: email,
        password: hashedPassword
      })

  if (findUser.status === ACCOUNT_STATUS.BLOCKED) {
    throw new ServiceException(BAD_REQUEST, 'Tài khoản của bạn đã bị khóa')
  }

  return await handleLogin({ userId: findUser.id, ipAddress, userAgent })
}

const handleAdminLogin = async (data) => {
  const { email, userType, ipAddress, userAgent } = data
  const user = await findUserByEmail({ email, userType })
  if (!user) {
    throw new NotFoundException('Không tìm thấy người dùng.')
  }
  if (user?.status === ACCOUNT_STATUS.BLOCKED) {
    throw new ServiceException(BAD_REQUEST, 'Tài khoản của bạn đã bị khóa')
  }

  return await handleLogin({ userId: user.id, ipAddress, userAgent })
}

module.exports = { redirect, callback }
