const { STATUS_CODE } = require('../../../constants')
const { message } = require('../../../constants/message')
const { sendResponse } = require('../../../utils/APIResponse')
const productOptionsService = require('../services/productOptions.service')

const create = async (req, res) => {
  try {
    const data = { ...req.query, ...req.body }
    const productOption = await productOptionsService.create(data)
    return sendResponse(res, { status: STATUS_CODE.OK, messages: message.createdSuccessfully, data: productOption })
  } catch (error) {
    console.log('error>>', error)
    return sendResponse(res, { status: error.status || STATUS_CODE.INTERNAL_SERVER_ERROR, messages: error.message })
  }
}

const findAll = async (req, res) => {
  try {
    const { page, limit, search, categoryId } = req.query
    const productOptions = await productOptionsService.findAll({ page, limit, search, categoryId })

    return sendResponse(res, { status: STATUS_CODE.OK, data: productOptions })
  } catch (error) {
    console.log(error)
    return sendResponse(res, { status: error.status || STATUS_CODE.INTERNAL_SERVER_ERROR, messages: error.message })
  }
}

const findOne = async (req, res) => {
  try {
    const productOption = await productOptionsService.findOne(req.params.id)
    return sendResponse(res, { status: STATUS_CODE.OK, data: productOption })
  } catch (error) {
    return sendResponse(res, { status: error.status || STATUS_CODE.INTERNAL_SERVER_ERROR, messages: error.message })
  }
}

const update = async (req, res) => {
  try {
    const data = { ...req.query, ...req.body }
    const productOption = await productOptionsService.update(req.params.id, data)
    return sendResponse(res, { status: STATUS_CODE.OK, messages: message.updatedSuccessfully, data: productOption })
  } catch (error) {
    return sendResponse(res, { status: error.status || STATUS_CODE.INTERNAL_SERVER_ERROR, messages: error.message })
  }
}

const remove = async (req, res) => {
  try {
    await productOptionsService.remove(req.params.id)
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
