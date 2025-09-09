const { STATUS_CODE } = require('../constants')
const { message } = require('../constants/message')
const NavigationMenuService = require('../services/NavigationMenuService')
const { sendResponse } = require('../utils/APIResponse')

exports.createMenu = async (req, res) => {
  try {
    const { authId, parentId, title, url, position, status } = { ...req.body, ...req.query }

    const menu = await NavigationMenuService.createMenu({ parentId, title, url, position, status, createdBy: authId, updatedBy: authId })
    return sendResponse(res, { status: STATUS_CODE.OK, messages: message.createdSuccessfully, data: menu })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

exports.getMenuById = async (req, res) => {
  try {
    const menu = await NavigationMenuService.getMenuById({ id: req.params.id })
    if (!menu) return res.status(404).json({ message: 'Menu not found' })
    return sendResponse(res, { status: STATUS_CODE.OK, data: menu })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

exports.getAllMenus = async (req, res) => {
  try {
    const menus = await NavigationMenuService.getAllMenus()
    return sendResponse(res, { status: STATUS_CODE.OK, data: menus })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

exports.updateMenu = async (req, res) => {
  try {
    const { authId, parentId, title, url, position, status } = { ...req.body, ...req.query }

    const updated = await NavigationMenuService.updateMenu(req.params.id, { parentId, title, url, position, status, updatedBy: authId })

    if (!updated[0]) return res.status(404).json({ message: 'Menu not found' })
    return sendResponse(res, { status: STATUS_CODE.OK, messages: message.updatedSuccessfully })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

exports.deleteMenu = async (req, res) => {
  try {
    await NavigationMenuService.deleteMenu(req.params.id)
    return sendResponse(res, { status: STATUS_CODE.OK, messages: message.deletedSuccessfully })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}
