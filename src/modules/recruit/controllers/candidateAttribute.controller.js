const { STATUS_CODE } = require('../../../constants')
const { message } = require('../../../constants/message')
const { sendResponse } = require('../../../utils/APIResponse')
const candidateAttributeService = require('../services/candidateAttribute.service')

const createCandidateAttribute = async (req, res) => {
  try {
    const { name, code, inputType, defaultValue, isRequired, displayPriority, minLength, maxLength, description, icon, authId } = {
      ...req.body,
      ...req.query
    }

    const data = await candidateAttributeService.createCandidateAttribute({
      name,
      code,
      inputType,
      defaultValue,
      isRequired,
      displayPriority,
      minLength,
      maxLength,
      description,
      icon,
      createdBy: authId
    })

    return sendResponse(res, {
      status: STATUS_CODE.CREATED,
      messages: message.createdSuccessfully,
      data
    })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const getAllCandidateAttributes = async (req, res) => {
  try {
    const result = await candidateAttributeService.getAllCandidateAttributes(req.query)
    return sendResponse(res, { status: STATUS_CODE.OK, data: result })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const getCandidateAttribute = async (req, res) => {
  try {
    const data = await candidateAttributeService.getCandidateAttributeById(req.params.id)
    return sendResponse(res, { status: STATUS_CODE.OK, data })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const updateCandidateAttribute = async (req, res) => {
  try {
    const { name, code, inputType, defaultValue, isRequired, displayPriority, minLength, maxLength, description, icon, authId } = {
      ...req.body,
      ...req.query
    }

    const data = await candidateAttributeService.updateCandidateAttribute(req.params.id, {
      name,
      code,
      inputType,
      defaultValue,
      isRequired,
      displayPriority,
      minLength,
      maxLength,
      description,
      icon,
      updatedBy: authId
    })

    return sendResponse(res, {
      status: STATUS_CODE.OK,
      messages: message.updatedSuccessfully,
      data
    })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const deleteCandidateAttribute = async (req, res) => {
  try {
    await candidateAttributeService.deleteCandidateAttribute(req.params.id)
    return sendResponse(res, {
      status: STATUS_CODE.OK,
      messages: message.deletedSuccessfully
    })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const updateDisplayPriority = async (req, res) => {
  try {
    const { displayPriority } = req.body
    const data = await candidateAttributeService.updateOneDisplayPriority(req.params.id, displayPriority)
    return sendResponse(res, {
      status: STATUS_CODE.OK,
      messages: message.updatedSuccessfully,
      data
    })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const bulkUpdateDisplayPriority = async (req, res) => {
  try {
    const list = req.body.list // [{ id, displayPriority }]
    await candidateAttributeService.bulkUpdateDisplayPriority(list)
    return sendResponse(res, {
      status: STATUS_CODE.OK,
      messages: message.updatedSuccessfully
    })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const checkCodeExists = async (req, res) => {
  try {
    const { code, excludeId } = req.query
    const exists = await candidateAttributeService.checkCodeExists(code, excludeId)
    return sendResponse(res, {
      status: STATUS_CODE.OK,
      data: { exists }
    })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const getAttributeWithValues = async (req, res) => {
  try {
    const data = await candidateAttributeService.getAttributeWithValues(req.params.id)
    return sendResponse(res, {
      status: STATUS_CODE.OK,
      data
    })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const searchAdvanced = async (req, res) => {
  try {
    const { inputType, isRequired } = req.query
    const data = await candidateAttributeService.searchAdvanced({ inputType, isRequired })
    return sendResponse(res, {
      status: STATUS_CODE.OK,
      data
    })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const getAllAttributesSorted = async (req, res) => {
  try {
    const data = await candidateAttributeService.getAllAttributesSorted()
    return sendResponse(res, {
      status: STATUS_CODE.OK,
      data
    })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const getRequiredAttributes = async (req, res) => {
  try {
    const data = await candidateAttributeService.getRequiredAttributes()
    return sendResponse(res, {
      status: STATUS_CODE.OK,
      data
    })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const findAttributeByCode = async (req, res) => {
  try {
    const { code } = req.query
    const data = await candidateAttributeService.findByCode(code)
    return sendResponse(res, {
      status: STATUS_CODE.OK,
      data
    })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

module.exports = {
  createCandidateAttribute,
  getAllCandidateAttributes,
  getCandidateAttribute,
  updateCandidateAttribute,
  deleteCandidateAttribute,
  updateDisplayPriority,
  bulkUpdateDisplayPriority,
  checkCodeExists,
  getAttributeWithValues,
  searchAdvanced,
  getAllAttributesSorted,
  getRequiredAttributes,
  findAttributeByCode
}
