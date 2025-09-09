const { STATUS_CODE } = require('../constants')
const { message } = require('../constants/message')
const PermissionService = require('../services/PermissionService')
const { sendResponse, sendResponseError } = require('../utils/APIResponse')

const getAll = async (req, res) => {
  try {
    const permissions = await PermissionService.getAllPermissions()
    sendResponse(res, { status: STATUS_CODE.OK, data: permissions })
  } catch (error) {
    sendResponseError(res, { errorMessage: error.message })
  }
}

const getById = async (req, res) => {
  try {
    const permission = await PermissionService.getPermissionById({ id: req.params.id })
    if (!permission) return res.status(404).json({ success: false, message: 'Permission not found' })

    sendResponse(res, { status: STATUS_CODE.OK, data: permission })
  } catch (error) {
    sendResponseError(res, { errorMessage: error.message })
  }
}

const create = async (req, res) => {
  try {
    const permission = await PermissionService.createPermission(req.body)

    sendResponse(res, { status: STATUS_CODE.OK, messages: message.createdSuccessfully, data: permission })
  } catch (error) {
    sendResponseError(res, { errorMessage: error.message })
  }
}

const update = async (req, res) => {
  try {
    await PermissionService.updatePermission(req.params.id, req.body)

    const permission = await PermissionService.getPermissionById({ id: req.params.id })

    sendResponse(res, { status: STATUS_CODE.OK, messages: message.updatedSuccessfully, data: permission })
  } catch (error) {
    sendResponseError(res, { errorMessage: error.message })
  }
}

const remove = async (req, res) => {
  try {
    await PermissionService.deletePermission(req.params.id)
    sendResponse(res, { status: STATUS_CODE.OK, messages: message.deletedSuccessfully })
  } catch (error) {
    sendResponseError(res, { errorMessage: error.message })
  }
}

module.exports = { getAll, getById, create, update, remove }
