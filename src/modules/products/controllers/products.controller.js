const { STATUS_CODE } = require('../../../constants')
const { message } = require('../../../constants/message')
const { sendResponse } = require('../../../utils/APIResponse')
const productsService = require('../services/products.service')

const create = async (req, res) => {
  try {
    const data = { ...req.query, ...req.body }
    const product = await productsService.create(data)
    return sendResponse(res, { status: STATUS_CODE.OK, messages: message.createdSuccessfully, data: product })
  } catch (error) {
    return sendResponse(res, { status: error.status || STATUS_CODE.INTERNAL_SERVER_ERROR, messages: error.message })
  }
}

const findAll = async (req, res) => {
  try {
    const { page, limit, search, productGroupId } = req.query
    const products = await productsService.findAll({ page, limit, search, productGroupId })
    return sendResponse(res, { status: STATUS_CODE.OK, data: products })
  } catch (error) {
    return sendResponse(res, { status: error.status || STATUS_CODE.INTERNAL_SERVER_ERROR, messages: error.message })
  }
}

const findOne = async (req, res) => {
  try {
    const product = await productsService.findOne(req.params.id)
    return sendResponse(res, { status: STATUS_CODE.OK, data: product })
  } catch (error) {
    return sendResponse(res, { status: error.status || STATUS_CODE.INTERNAL_SERVER_ERROR, messages: error.message })
  }
}

const update = async (req, res) => {
  try {
    const data = { ...req.query, ...req.body }
    const product = await productsService.update(req.params.id, data)
    return sendResponse(res, { status: STATUS_CODE.OK, messages: message.updatedSuccessfully, data: product })
  } catch (error) {
    return sendResponse(res, { status: error.status || STATUS_CODE.INTERNAL_SERVER_ERROR, messages: error.message })
  }
}

const remove = async (req, res) => {
  try {
    await productsService.remove(req.params.id)
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
