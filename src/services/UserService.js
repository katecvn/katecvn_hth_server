const db = require('../models')
const { STATUS_CODE } = require('../constants')
const ServiceException = require('../exceptions/ServiceException')
const { Op } = require('sequelize')
const AUTH_PROVIDER = require('../constants/auth-provider')

const getUser = async (data) => {
  try {
    const { notInIds, ...conditions } = data

    const whereCondition = {}

    Object.entries(conditions).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        whereCondition[key] = value
      }
    })

    if (notInIds) {
      whereCondition.id = { [Op.notIn]: notInIds }
    }

    const user = await db.User.findOne({
      where: whereCondition,
      include: [{ model: db.Role, as: 'roles', attributes: ['id', 'name', 'description'] }]
    })

    return user
  } catch (e) {
    throw new ServiceException(e.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const getUseByUsername = async ({ username }) => {
  try {
    const getUser = await db.User.findOne({
      where: { username: username },
      include: [
        {
          model: db.Role,
          as: 'roles',
          attributes: ['id', 'name'],
          include: [{ model: db.Permission, as: 'permissions', attributes: ['id', 'name'] }]
        }
      ]
    })

    return getUser
  } catch (e) {
    throw new ServiceException(e.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const getUserById = async ({ id }) => {
  try {
    const getUser = await db.User.findOne({
      where: { id: id },
      include: [
        {
          model: db.UserAddress,
          as: 'userAddresses'
        },
        {
          model: db.Role,
          as: 'roles',
          attributes: ['id', 'name'],
          include: [{ model: db.Permission, as: 'permissions', attributes: ['id', 'name'] }]
        }
      ]
    })

    return getUser
  } catch (e) {
    return { status: STATUS_CODE.INTERNAL_SERVER_ERROR, messages: e.message }
  }
}

const create = async ({ role_id, code, full_name, date_of_birth, gender, email, phone_number, avatar_url, address, username, password }) => {
  try {
    const user = await db.User.create({
      code,
      full_name,
      date_of_birth,
      gender,
      email,
      phone_number,
      avatar_url,
      address,
      username,
      password,
      user_type: AUTH_PROVIDER.ADMIN
    })

    await db.UserHasRole.create({
      user_id: user.id,
      role_id
    })

    return user
  } catch (error) {
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const shows = async ({ page = 1, limit = 9999, type }) => {
  try {
    const offset = (page - 1) * limit
    const conditions = type ? { user_type: type } : {}

    const { count, rows: users } = await db.User.findAndCountAll({
      where: conditions,
      include: [
        { model: db.Role, as: 'roles', attributes: ['id', 'name', 'description'] },
        {
          model: db.UserAddress,
          as: 'userAddresses'
        }
      ],
      limit: limit,
      offset: offset
    })

    return { totalItems: count, users: users, totalPages: Math.ceil(count / limit), currentPage: page }
  } catch (e) {
    throw new ServiceException(e.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const update = async (id, data) => {
  const { role_id } = data
  const user = await db.User.findOne({ where: { id: id } })

  const transaction = await db.sequelize.transaction()
  try {
    await user.update(data, { transaction })

    await db.UserHasRole.update(
      {
        role_id
      },
      {
        where: {
          user_id: user.id
        }
      },
      { transaction }
    )

    await transaction.commit()
    return true
  } catch (e) {
    throw new ServiceException(e.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const destroy = async ({ ids }) => {
  try {
    await db.User.destroy({ where: { id: { [Op.in]: ids } } })

    return await db.User.destroy({ where: { id: { [Op.in]: ids } } })
  } catch (e) {
    throw new ServiceException(e.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const getUserByCode = async ({ code, notInIds = [] }) => {
  try {
    const whereClause = { code }

    if (notInIds.length) {
      whereClause.id = { [db.Sequelize.Op.notIn]: notInIds }
    }

    const user = await db.User.findOne({ where: whereClause })

    return user
  } catch (error) {
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const getUserByEmail = async ({ email, notInIds = [] }) => {
  try {
    let whereClause = { email }

    if (notInIds.length) {
      whereClause.id = { [db.Sequelize.Op.notIn]: notInIds }
    }

    const user = await db.User.findOne({ where: whereClause })

    return user
  } catch (error) {
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const getUserByUsername = async ({ username, notInIds = [] }) => {
  try {
    const whereClause = { username }

    if (notInIds.length) {
      whereClause.id = { [db.Sequelize.Op.notIn]: notInIds }
    }

    const user = await db.User.findOne({
      where: whereClause,
      include: [
        {
          model: db.Role,
          as: 'roles',
          attributes: ['id', 'name'],
          include: [{ model: db.Permission, as: 'permissions', attributes: ['id', 'name'] }]
        }
      ]
    })

    return user
  } catch (error) {
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const getUserProfile = async (id) => {
  return await db.User.findOne({
    where: { id },
    attributes: ['id', 'code', 'full_name', 'date_of_birth', 'gender', 'email', 'phone_number', 'avatar_url', 'address', 'username'],
    include: [{ model: db.UserAddress, as: 'userAddresses' }]
  })
}

const updateUserProfile = async (id, data) => {
  const { code, full_name, date_of_birth, gender, email, phone_number, avatar_url, address } = data
  const user = await db.User.findByPk(id)

  const transaction = await db.sequelize.transaction()
  try {
    await user.update(
      {
        code,
        full_name,
        date_of_birth,
        gender,
        email,
        phone_number,
        avatar_url,
        address
      },
      { transaction }
    )
    await transaction.commit()
    return true
  } catch (error) {
    await transaction.rollback()
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const createUserAddress = async (userId, data) => {
  const { name, phone, address, isDefault = false } = data
  const addressCount = await db.UserAddress.count({
    where: { userId }
  })
  if (addressCount >= 3) {
    throw new ServiceException({ address: 'Mỗi người dùng chỉ được tạo tối đa 3 địa chỉ' }, STATUS_CODE.BAD_REQUEST)
  }

  try {
    if (isDefault) {
      const existingDefaultAddress = await db.UserAddress.findOne({
        where: {
          userId,
          isDefault: true
        }
      })

      if (existingDefaultAddress) {
        await existingDefaultAddress.update({
          isDefault: false
        })
      }
    }

    const userAddress = await db.UserAddress.create({
      userId,
      name,
      phone,
      address,
      isDefault
    })

    return userAddress
  } catch (error) {
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const updateUserAddress = async (id, userId, data) => {
  const { name, phone, address, isDefault = false } = data
  const userAddress = await db.UserAddress.findOne({
    where: { id, userId }
  })
  if (!userAddress) {
    throw new ServiceException({ id: 'Địa chỉ không tồn tại' }, STATUS_CODE.NOT_FOUND)
  }

  const transaction = await db.sequelize.transaction()
  try {
    if (isDefault) {
      await db.UserAddress.update({ isDefault: false }, { where: { userId, isDefault: true }, transaction })
    }

    await userAddress.update({ name, phone, address, isDefault }, { transaction })

    await transaction.commit()
    return userAddress
  } catch (error) {
    await transaction.rollback()
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const deleteUserAddress = async (id, userId) => {
  try {
    const address = await db.UserAddress.findOne({
      where: { id, userId }
    })
    if (!address) {
      throw new ServiceException({ id: 'Địa chỉ không tồn tại' }, STATUS_CODE.NOT_FOUND)
    }

    await address.destroy()
    return true
  } catch (error) {
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

module.exports = {
  getUseByUsername,
  getUserById,
  getUser,
  create,
  shows,
  update,
  destroy,
  getUserByCode,
  getUserByEmail,
  getUserByUsername,
  getUserProfile,
  updateUserProfile,
  createUserAddress,
  updateUserAddress,
  deleteUserAddress
}
