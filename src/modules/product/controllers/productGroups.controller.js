const { STATUS_CODE } = require('../../../constants')
const { message } = require('../../../constants/message')
const { sendResponse } = require('../../../utils/APIResponse')
const productGroupsService = require('../services/productGroups.service')

const create = async (req, res) => {
  try {
    const data = { ...req.query, ...req.body }
    const productGroup = await productGroupsService.create(data)
    return sendResponse(res, { status: STATUS_CODE.OK, messages: message.createdSuccessfully, data: productGroup })
  } catch (error) {
    return sendResponse(res, { status: error.status || STATUS_CODE.INTERNAL_SERVER_ERROR, messages: error.message })
  }
}

const findAll = async (req, res) => {
  try {
    const { page, limit, search } = req.query
    const productGroups = await productGroupsService.findAll({ page, limit, search })
    return sendResponse(res, { status: STATUS_CODE.OK, data: productGroups })
  } catch (error) {
    return sendResponse(res, { status: error.status || STATUS_CODE.INTERNAL_SERVER_ERROR, messages: error.message })
  }
}

const findOne = async (req, res) => {
  try {
    const productGroup = await productGroupsService.findOne(req.params.id)
    return sendResponse(res, { status: STATUS_CODE.OK, data: productGroup })
  } catch (error) {
    return sendResponse(res, { status: error.status || STATUS_CODE.INTERNAL_SERVER_ERROR, messages: error.message })
  }
}

const update = async (req, res) => {
  try {
    const data = { ...req.query, ...req.body }
    const productGroup = await productGroupsService.update(req.params.id, data)
    return sendResponse(res, { status: STATUS_CODE.OK, messages: message.updatedSuccessfully, data: productGroup })
  } catch (error) {
    console.log('error>>', error)
    return sendResponse(res, { status: error.status || STATUS_CODE.INTERNAL_SERVER_ERROR, messages: error.message })
  }
}

const remove = async (req, res) => {
  try {
    await productGroupsService.remove(req.params.id)
    return sendResponse(res, { status: STATUS_CODE.OK, messages: message.deletedSuccessfully })
  } catch (error) {
    return sendResponse(res, { status: error.status || STATUS_CODE.INTERNAL_SERVER_ERROR, messages: error.message })
  }
}

module.exports = {
  create,
  findAll,
  findOne,
  update,
  remove
}
