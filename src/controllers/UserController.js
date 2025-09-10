const { kem } = require('node-forge')
const { STATUS_CODE } = require('../constants')
const { message } = require('../constants/message')
const UserService = require('../services/UserService')
const { sendResponse } = require('../utils/APIResponse')
const bcrypt = require('bcryptjs')

const create = async (req, res) => {
  try {
    const {
      role_id,
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
      user_type,
      customerGroupId
    } = { ...req.query, ...req.body }

    const createUser = await UserService.create({
      role_id,
      code,
      full_name,
      date_of_birth: date_of_birth || null,
      gender,
      email,
      phone_number,
      avatar_url,
      address,
      username,
      password,
      user_type,
      customerGroupId
    })

    sendResponse(res, {
      status: STATUS_CODE.OK,
      messages: message.createdSuccessfully,
      data: createUser
    })
  } catch (error) {
    sendResponse(res, { status: error.status, messages: error.message })
  }
}


const show = async (req, res) => {
  try {
    const id = req.params.id

    const user = await UserService.getUserById({ id })

    sendResponse(res, { status: STATUS_CODE.OK, data: user })
  } catch (e) {
    sendResponse(res, { status: e.status, messages: e.message })
  }
}

const shows = async (req, res) => {
  try {
    const { page, limit, type } = req.query

    const users = await UserService.shows({ page, limit, type })

    sendResponse(res, { status: STATUS_CODE.OK, data: users })
  } catch (e) {
    sendResponse(res, { status: e.status, messages: e.message })
  }
}

const update = async (req, res) => {
  try {
    const {
      role_id,
      code,
      full_name,
      date_of_birth,
      gender,
      email,
      phone_number,
      avatar_url,
      address,
      username,
      customerGroupId
    } = { ...req.query, ...req.body }

    await UserService.update(req.params.id, {
      role_id,
      code,
      full_name,
      date_of_birth: date_of_birth || null,
      gender,
      email,
      phone_number,
      avatar_url,
      address,
      username,
      customerGroupId
    })

    return sendResponse(res, {
      status: STATUS_CODE.OK,
      messages: message.updatedSuccessfully
    })
  } catch (e) {
    sendResponse(res, { status: e.status, messages: e.message })
  }
}


const destroy = async (req, res) => {
  try {
    const id = req.params.id

    await UserService.destroy({ ids: [id] })

    sendResponse(res, { status: STATUS_CODE.OK, messages: message.deletedSuccessfully })
  } catch (e) {
    sendResponse(res, { status: e.status, messages: e.message })
  }
}

const changePassword = async (req, res) => {
  try {
    const { username, new_password } = req.body
    const authId = req.user.id
    let conditions = {}

    if (username) {
      conditions.username = username
    }
    if (new_password) {
      const hashedPassword = bcrypt.hashSync(new_password, 10)
      conditions.password = hashedPassword
    }

    await UserService.update(authId, conditions)

    return sendResponse(res, { status: STATUS_CODE.OK, messages: message.updatedSuccessfully })
  } catch (error) {
    return sendResponse(res, { status: STATUS_CODE.INTERNAL_SERVER_ERROR, messages: error.message })
  }
}

const getUserProfile = async (req, res) => {
  const authId = req.user.id
  try {
    const userProfile = await UserService.getUserProfile(authId)
    return sendResponse(res, { status: STATUS_CODE.OK, data: userProfile })
  } catch (error) {
    return sendResponse(res, { status: STATUS_CODE.INTERNAL_SERVER_ERROR, messages: error.message })
  }
}

const updateUserProfile = async (req, res) => {
  const authId = req.user.id
  const data = req.body
  try {
    await UserService.updateUserProfile(authId, data)
    return sendResponse(res, { status: STATUS_CODE.OK, messages: message.updatedSuccessfully })
  } catch (error) {
    return sendResponse(res, { status: STATUS_CODE.INTERNAL_SERVER_ERROR, messages: error.message })
  }
}

const createUserAddress = async (req, res) => {
  const { id } = req.user
  const data = req.body
  try {
    const result = await UserService.createUserAddress(id, data)
    return sendResponse(res, { status: STATUS_CODE.OK, messages: message.createdSuccessfully, data: result })
  } catch (error) {
    return sendResponse(res, { status: STATUS_CODE.INTERNAL_SERVER_ERROR, messages: error.message })
  }
}

const updateUserAddress = async (req, res) => {
  const { id: userId } = req.user
  const { id } = req.params
  const data = req.body
  try {
    const result = await UserService.updateUserAddress(id, userId, data)
    return sendResponse(res, { status: STATUS_CODE.OK, messages: message.updatedSuccessfully, data: result })
  } catch (error) {
    return sendResponse(res, { status: STATUS_CODE.INTERNAL_SERVER_ERROR, messages: error.message })
  }
}

const deleteUserAddress = async (req, res) => {
  const { id: userId } = req.user
  const { id } = req.params
  try {
    const result = await UserService.deleteUserAddress(id, userId)
    return sendResponse(res, { status: STATUS_CODE.OK, messages: message.deletedSuccessfully, data: result })
  } catch (error) {
    return sendResponse(res, { status: STATUS_CODE.INTERNAL_SERVER_ERROR, messages: error.message })
  }
}

module.exports = {
  create,
  show,
  shows,
  update,
  destroy,
  changePassword,
  updateUserProfile,
  getUserProfile,
  createUserAddress,
  updateUserAddress,
  deleteUserAddress
}
