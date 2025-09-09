const { STATUS_CODE } = require('../../../constants')
const { message } = require('../../../constants/message')
const { sendResponse } = require('../../../utils/APIResponse')
const recruitAttributeService = require('../services/recruitAttribute.service')

const createRecruitAttribute = async (req, res) => {
  try {
    const { name, code, defaultValue, isRequired, description, displayPriority, isDefaultFilter, isAdvancedFilter, icon, authId } = {
      ...req.body,
      ...req.query
    }

    const newAttribute = await recruitAttributeService.create({
      name,
      code,
      defaultValue,
      isRequired,
      description,
      displayPriority,
      isDefaultFilter,
      isAdvancedFilter,
      icon,
      createdBy: authId
    })

    return sendResponse(res, {
      status: STATUS_CODE.OK,
      messages: message.createdSuccessfully,
      data: newAttribute
    })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const getAllRecruitAttributes = async (req, res) => {
  try {
    const { page, limit, search } = req.query

    const result = await recruitAttributeService.findAll({ page, limit, search })

    return sendResponse(res, { status: STATUS_CODE.OK, data: result })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const getRecruitAttributeById = async (req, res) => {
  try {
    const { id } = req.params
    const attribute = await recruitAttributeService.findOne(id)

    if (!attribute) {
      return sendResponse(res, {
        status: STATUS_CODE.NOT_FOUND,
        messages: message.notExist
      })
    }

    return sendResponse(res, { status: STATUS_CODE.OK, data: attribute })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const updateRecruitAttribute = async (req, res) => {
  try {
    const { name, code, defaultValue, isRequired, description, displayPriority, isDefaultFilter, isAdvancedFilter, icon, authId } = {
      ...req.body,
      ...req.query
    }

    const updated = await recruitAttributeService.update(req.params.id, {
      name,
      code,
      defaultValue,
      isRequired,
      description,
      displayPriority,
      isDefaultFilter,
      isAdvancedFilter,
      icon,
      updatedBy: authId
    })

    return sendResponse(res, {
      status: STATUS_CODE.OK,
      messages: message.updatedSuccessfully,
      data: updated
    })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const deleteRecruitAttribute = async (req, res) => {
  try {
    const { id, authId } = { ...req.params, ...req.query }
    await recruitAttributeService.remove(id, authId)

    return sendResponse(res, {
      status: STATUS_CODE.OK,
      messages: message.deletedSuccessfully
    })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const getDefaultFilterAttributes = async (req, res) => {
  try {
    const result = await recruitAttributeService.getDefaultFilters()
    return sendResponse(res, { status: STATUS_CODE.OK, data: result })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const getAdvancedFilterAttributes = async (req, res) => {
  try {
    const result = await recruitAttributeService.getAdvancedFilters()
    return sendResponse(res, { status: STATUS_CODE.OK, data: result })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const getRequiredAttributes = async (req, res) => {
  try {
    const result = await recruitAttributeService.getRequiredAttributes()
    return sendResponse(res, { status: STATUS_CODE.OK, data: result })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const getAttributesByDisplayPriority = async (req, res) => {
  try {
    const result = await recruitAttributeService.getAttributesByDisplayPriority()
    return sendResponse(res, { status: STATUS_CODE.OK, data: result })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const getAttributesWithValues = async (req, res) => {
  try {
    const result = await recruitAttributeService.getAttributesWithValues()
    return sendResponse(res, { status: STATUS_CODE.OK, data: result })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const getDetailWithValues = async (req, res) => {
  try {
    const { id } = req.params
    const result = await recruitAttributeService.getDetailWithValues(id)
    if (!result) {
      return sendResponse(res, { status: STATUS_CODE.NOT_FOUND, messages: message.notExist })
    }
    return sendResponse(res, { status: STATUS_CODE.OK, data: result })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const findRecruitAttributeByCode = async (req, res) => {
  try {
    const { code } = req.query
    const result = await recruitAttributeService.findByCode({ code })
    if (!result) {
      return sendResponse(res, { status: STATUS_CODE.NOT_FOUND, messages: message.notExist })
    }
    return sendResponse(res, { status: STATUS_CODE.OK, data: result })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const checkCodeExists = async (req, res) => {
  try {
    const { code } = req.query
    const exists = await recruitAttributeService.checkCodeExists(code)
    return sendResponse(res, { status: STATUS_CODE.OK, data: { exists } })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const updateDisplayPriority = async (req, res) => {
  try {
    const { id } = req.params
    const { displayPriority } = req.body
    const result = await recruitAttributeService.updateOneDisplayPriority(id, displayPriority)
    return sendResponse(res, { status: STATUS_CODE.OK, messages: message.updatedSuccessfully, data: result })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const bulkUpdateDisplayPriority = async (req, res) => {
  try {
    const { list } = req.body // list = [{id, displayPriority}]
    await recruitAttributeService.bulkUpdateDisplayPriority(list)
    return sendResponse(res, { status: STATUS_CODE.OK, messages: message.updatedSuccessfully })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const searchAdvancedRecruitAttributes = async (req, res) => {
  try {
    const { page, limit, keyword, isDefaultFilter, isAdvancedFilter, isRequired } = req.query
    const filter = {
      page,
      limit,
      keyword,
      isDefaultFilter: isDefaultFilter !== undefined ? JSON.parse(isDefaultFilter) : undefined,
      isAdvancedFilter: isAdvancedFilter !== undefined ? JSON.parse(isAdvancedFilter) : undefined,
      isRequired: isRequired !== undefined ? JSON.parse(isRequired) : undefined
    }
    const result = await recruitAttributeService.searchAdvanced(filter)
    return sendResponse(res, { status: STATUS_CODE.OK, data: result })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const countRecruitAttributeByType = async (req, res) => {
  try {
    const result = await recruitAttributeService.countByType()
    return sendResponse(res, { status: STATUS_CODE.OK, data: result })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

module.exports = {
  createRecruitAttribute,
  getAllRecruitAttributes,
  getRecruitAttributeById,
  updateRecruitAttribute,
  deleteRecruitAttribute,
  getDefaultFilterAttributes,
  getAdvancedFilterAttributes,
  getRequiredAttributes,
  getAttributesByDisplayPriority,
  getAttributesWithValues,
  getDetailWithValues,
  findRecruitAttributeByCode,
  checkCodeExists,
  updateDisplayPriority,
  bulkUpdateDisplayPriority,
  searchAdvancedRecruitAttributes,
  countRecruitAttributeByType
}
