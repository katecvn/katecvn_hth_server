const { STATUS_CODE } = require('../constants')
const { message } = require('../constants/message')
const RoleService = require('../services/RoleService')
const { sendResponse, sendResponseError } = require('../utils/APIResponse')

const RoleController = {
  async getRoles(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query
      const roles = await RoleService.getAllRoles(Number(page), Number(limit))
      sendResponse(res, { status: STATUS_CODE.OK, data: roles })
    } catch (error) {
      sendResponseError(res, { errorMessage: error.message })
    }
  },

  async getRole(req, res) {
    try {
      const role = await RoleService.getRoleById({ id: req.params.id })
      sendResponse(res, { status: STATUS_CODE.OK, data: role })
    } catch (error) {
      sendResponseError(res, { errorMessage: error.message })
    }
  },

  async createRole(req, res) {
    try {
      const { name, description, permissionIds } = req.body

      const role = await RoleService.createRole({ name, description, permissionIds })
      sendResponse(res, { status: STATUS_CODE.OK, messages: message.createdSuccessfully, data: role })
    } catch (error) {
      sendResponseError(res, { errorMessage: error.message })
    }
  },

  async updateRole(req, res) {
    try {
      const id = req.params.id

      const { name, description, permissionIds } = req.body

      const updated = await RoleService.updateRole(id, { name, description, permissionIds })

      if (!updated) return res.status(404).json({ success: false, message: 'Role không tồn tại' })

      const role = await RoleService.getRoleById({ id })

      sendResponse(res, { status: STATUS_CODE.OK, messages: message.updatedSuccessfully, data: role })
    } catch (error) {
      sendResponseError(res, { errorMessage: error.message })
    }
  },

  async deleteRole(req, res) {
    try {
      await RoleService.deleteRole(req.params.id)
      sendResponse(res, { status: STATUS_CODE.OK, messages: message.deletedSuccessfully })
    } catch (error) {
      sendResponseError(res, { errorMessage: error.message })
    }
  }
}

module.exports = RoleController
