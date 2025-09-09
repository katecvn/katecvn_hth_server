const { STATUS_CODE } = require('../../../constants')
const { message } = require('../../../constants/message')
const { sendResponse } = require('../../../utils/APIResponse')
const service = require('../services/candidateAttributesValue.service')

const createCandidateAttributesValue = async (req, res) => {
  try {
    const { attributeId, value, isDefault } = req.body
    const data = await service.createCandidateAttributesValue({ attributeId, value, isDefault })
    return sendResponse(res, { status: STATUS_CODE.CREATED, messages: message.createdSuccessfully, data })
  } catch (err) {
    return sendResponse(res, { status: err.status, messages: err.message })
  }
}

const getAllCandidateAttributesValues = async (req, res) => {
  try {
    const data = await service.findAllCandidateAttributesValues()
    return sendResponse(res, { status: STATUS_CODE.OK, data })
  } catch (err) {
    return sendResponse(res, { status: err.status, messages: err.message })
  }
}

const getCandidateAttributesValueById = async (req, res) => {
  try {
    const data = await service.findCandidateAttributesValueById(req.params.id)
    return sendResponse(res, { status: STATUS_CODE.OK, data })
  } catch (err) {
    return sendResponse(res, { status: err.status, messages: err.message })
  }
}

const updateCandidateAttributesValue = async (req, res) => {
  try {
    const { value, isDefault } = req.body
    const data = await service.updateCandidateAttributesValue(req.params.id, { value, isDefault })
    return sendResponse(res, { status: STATUS_CODE.OK, messages: message.updatedSuccessfully, data })
  } catch (err) {
    return sendResponse(res, { status: err.status, messages: err.message })
  }
}

const deleteCandidateAttributesValue = async (req, res) => {
  try {
    await service.deleteCandidateAttributesValue(req.params.id)
    return sendResponse(res, { status: STATUS_CODE.OK, messages: message.deletedSuccessfully })
  } catch (err) {
    return sendResponse(res, { status: err.status, messages: err.message })
  }
}

const getValuesByAttributeId = async (req, res) => {
  try {
    const { attributeId } = req.params
    const data = await service.getValuesByAttributeId(attributeId)
    return sendResponse(res, { status: STATUS_CODE.OK, data })
  } catch (err) {
    return sendResponse(res, { status: err.status, messages: err.message })
  }
}

const getDefaultValueByAttributeId = async (req, res) => {
  try {
    const { attributeId } = req.params
    const data = await service.getDefaultValueByAttributeId(attributeId)
    return sendResponse(res, { status: STATUS_CODE.OK, data })
  } catch (err) {
    return sendResponse(res, { status: err.status, messages: err.message })
  }
}

const setDefaultValueForAttribute = async (req, res) => {
  try {
    const { attributeId, valueId } = req.body
    await service.setDefaultValueForAttribute(attributeId, valueId)
    return sendResponse(res, { status: STATUS_CODE.OK, messages: message.updatedSuccessfully })
  } catch (err) {
    return sendResponse(res, { status: err.status, messages: err.message })
  }
}

const checkDuplicateValueInAttribute = async (req, res) => {
  try {
    const { attributeId, value, excludeId } = req.body
    const exists = await service.checkDuplicateValueInAttribute(attributeId, value, excludeId)
    return sendResponse(res, { status: STATUS_CODE.OK, data: { exists } })
  } catch (err) {
    return sendResponse(res, { status: err.status, messages: err.message })
  }
}

const deleteAllValuesByAttributeId = async (req, res) => {
  try {
    const { attributeId } = req.params
    await service.deleteAllValuesByAttributeId(attributeId)
    return sendResponse(res, { status: STATUS_CODE.OK, messages: message.deletedSuccessfully })
  } catch (err) {
    return sendResponse(res, { status: err.status, messages: err.message })
  }
}

const bulkCreateOrUpdateValues = async (req, res) => {
  try {
    const { attributeId, values } = req.body
    await service.bulkCreateOrUpdateValues(attributeId, values)
    return sendResponse(res, { status: STATUS_CODE.OK, messages: message.updatedSuccessfully })
  } catch (err) {
    return sendResponse(res, { status: err.status, messages: err.message })
  }
}

const countValuesByAttributeId = async (req, res) => {
  try {
    const { attributeId } = req.params
    const count = await service.countValuesByAttributeId(attributeId)
    return sendResponse(res, { status: STATUS_CODE.OK, data: { count } })
  } catch (err) {
    return sendResponse(res, { status: err.status, messages: err.message })
  }
}

const getValuesByAttributeIds = async (req, res) => {
  try {
    const attributeIds = (req.query.attributeIds || '')
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean)
    const ids = attributeIds.map((id) => Number(id)).filter((id) => !isNaN(id))
    const data = await service.getValuesByAttributeIds(ids)
    return sendResponse(res, { status: STATUS_CODE.OK, data })
  } catch (err) {
    return sendResponse(res, { status: err.status, messages: err.message })
  }
}

module.exports = {
  createCandidateAttributesValue,
  getAllCandidateAttributesValues,
  getCandidateAttributesValueById,
  updateCandidateAttributesValue,
  deleteCandidateAttributesValue,
  getValuesByAttributeId,
  getDefaultValueByAttributeId,
  setDefaultValueForAttribute,
  checkDuplicateValueInAttribute,
  deleteAllValuesByAttributeId,
  bulkCreateOrUpdateValues,
  countValuesByAttributeId,
  getValuesByAttributeIds
}
