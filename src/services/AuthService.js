const db = require('../models')
const { STATUS_CODE } = require('../constants')
const { message } = require('../constants/message')
const { createJWT } = require('../middlewares/JWTAction')

const createAccessLog = async ({ user_id, ip_address, user_agent, access_token, status, message = null }) => {
  try {
    return await db.AccessLog.create({ user_id, ip_address, user_agent, access_token, status, message })
  } catch (error) {
    throw new Error('Failed to create access log')
  }
}

const authenticated = async (userId) => {
  return await db.User.findOne({
    attributes: ['id', 'code', 'full_name', 'gender', 'email', 'phone_number', 'avatar_url', 'address'],
    where: { id: userId },
    include: [
      {
        model: db.UserAddress,
        as: 'userAddresses'
      },
      {
        model: db.Role,
        as: 'roles',
        attributes: ['id', 'name'],
        include: [
          {
            model: db.Permission,
            as: 'permissions',
            attributes: ['id', 'name']
          }
        ]
      }
    ]
  })
}

const login = async ({ user, ipAddress, userAgent }) => {
  const token = createJWT(user.id)
  try {
    await createAccessLog({
      user_id: user.id,
      ip_address: ipAddress,
      user_agent: userAgent,
      access_token: token,
      status: 'success',
      message: 'User logged in successfully'
    })

    const userInformation = await authenticated(user.id)

    return { token, userInformation }
  } catch (error) {
    throw new Error(error.message)
  }
}

const logout = async ({ access_token }) => {
  try {
    const findAccessLog = await db.AccessLog.findOne({ where: { access_token, logoutAt: null } })

    if (!findAccessLog) return { status: STATUS_CODE.NO_CONTENT, messages: message.notExist }

    await findAccessLog.update({ logoutAt: new Date() })

    return { status: STATUS_CODE.OK, messages: message.logoutSuccessfully }
  } catch (e) {
    throw new Error(e.message)
  }
}

const register = async ({ email = '', password, username, fullName }) => {
  const transaction = await db.sequelize.transaction()
  try {
    const user = await db.User.create(
      {
        email,
        password,
        username,
        full_name: fullName,
        user_type: 'customer'
      },
      { transaction }
    )

    const defaultRole = await db.Role.findOne({ where: { name: 'User' } })

    if (defaultRole) {
      await db.UserHasRole.create(
        {
          user_id: user.id,
          role_id: defaultRole.id
        },
        { transaction }
      )
    }

    await transaction.commit()
    return user
  } catch (error) {
    await transaction.rollback()
    throw new Error(error.message)
  }
}


const getAccessLogByToken = async ({ access_token }) => {
  return await db.AccessLog.findOne({ where: { access_token } })
}

module.exports = { createAccessLog, login, register, logout, authenticated, getAccessLogByToken }
