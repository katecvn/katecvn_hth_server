const { STATUS_CODE } = require('../../../constants')
const { message } = require('../../../constants/message')
const { sendResponse } = require('../../../utils/APIResponse')
const service = require('../services/recruitAttributesValue.service')

const createRecruitAttributeValue = async (req, res) => {
  try {
    const { attributeId, value, isDefault } = req.body
    const result = await service.createRecruitAttributeValue({ attributeId, value, isDefault })
    return sendResponse(res, {
      status: STATUS_CODE.OK,
      messages: message.createdSuccessfully,
      data: result
    })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const getAllRecruitAttributeValues = async (req, res) => {
  try {
    const result = await service.getAllRecruitAttributeValues()
    return sendResponse(res, { status: STATUS_CODE.OK, data: result })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const getRecruitAttributeValue = async (req, res) => {
  try {
    const result = await service.getRecruitAttributeValueById(req.params.id)
    return sendResponse(res, { status: STATUS_CODE.OK, data: result })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const updateRecruitAttributeValue = async (req, res) => {
  try {
    const { value, isDefault } = req.body
    const result = await service.updateRecruitAttributeValue(req.params.id, { value, isDefault })
    return sendResponse(res, {
      status: STATUS_CODE.OK,
      messages: message.updatedSuccessfully,
      data: result
    })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const deleteRecruitAttributeValue = async (req, res) => {
  try {
    await service.deleteRecruitAttributeValue(req.params.id)
    return sendResponse(res, { status: STATUS_CODE.OK, messages: message.deletedSuccessfully })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const getValuesByAttributeId = async (req, res) => {
  try {
    const { attributeId } = req.params
    const result = await service.getValuesByAttributeId(attributeId)
    return sendResponse(res, { status: STATUS_CODE.OK, data: result })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const getDefaultValueByAttributeId = async (req, res) => {
  try {
    const { attributeId } = req.params
    const result = await service.getDefaultValueByAttributeId(attributeId)
    return sendResponse(res, { status: STATUS_CODE.OK, data: result })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const checkDuplicateValueInAttribute = async (req, res) => {
  try {
    const { attributeId, value, excludeId } = req.body
    const isDuplicate = await service.checkDuplicateValueInAttribute({ attributeId, value, excludeId })
    return sendResponse(res, { status: STATUS_CODE.OK, data: { isDuplicate } })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const bulkCreateOrUpdateValues = async (req, res) => {
  try {
    const { attributeId, values } = req.body // values: [{id?, value, isDefault}]
    await service.bulkCreateOrUpdateValues(attributeId, values)
    return sendResponse(res, { status: STATUS_CODE.OK, messages: message.updatedSuccessfully })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const getValuesByAttributeIds = async (req, res) => {
  try {
    let { attributeIds } = req.query
    if (typeof attributeIds === 'string') attributeIds = attributeIds.split(',').map(Number)
    const result = await service.getValuesByAttributeIds(attributeIds)
    return sendResponse(res, { status: STATUS_CODE.OK, data: result })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const deleteAllValuesByAttributeId = async (req, res) => {
  try {
    const { attributeId } = req.params
    await service.deleteAllValuesByAttributeId(attributeId)
    return sendResponse(res, { status: STATUS_CODE.OK, messages: message.deletedSuccessfully })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const countValuesByAttributeId = async (req, res) => {
  try {
    const { attributeId } = req.params
    const count = await service.countValuesByAttributeId(attributeId)
    return sendResponse(res, { status: STATUS_CODE.OK, data: { count } })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const setDefaultValueForAttribute = async (req, res) => {
  try {
    const { attributeId, valueId } = req.body
    await service.setDefaultValueForAttribute(attributeId, valueId)
    return sendResponse(res, { status: STATUS_CODE.OK, messages: message.updatedSuccessfully })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

module.exports = {
  createRecruitAttributeValue,
  getAllRecruitAttributeValues,
  getRecruitAttributeValue,
  updateRecruitAttributeValue,
  deleteRecruitAttributeValue,
  getValuesByAttributeId,
  getDefaultValueByAttributeId,
  checkDuplicateValueInAttribute,
  bulkCreateOrUpdateValues,
  getValuesByAttributeIds,
  deleteAllValuesByAttributeId,
  countValuesByAttributeId,
  setDefaultValueForAttribute
}
