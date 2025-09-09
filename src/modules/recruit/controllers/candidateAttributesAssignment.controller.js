const { STATUS_CODE } = require('../../../constants')
const { sendResponse } = require('../../../utils/APIResponse')
const service = require('../services/candidateAttributesAssignment.service')

const createCandidateAttributeAssignment = async (req, res) => {
  try {
    const { candidateId, attributeId, attributeValueId, customValue } = req.body
    const data = { candidateId, attributeId, attributeValueId, customValue }
    const result = await service.createCandidateAttributeAssignment(data)
    return sendResponse(res, {
      status: STATUS_CODE.CREATED,
      messages: 'Created successfully',
      data: result
    })
  } catch (err) {
    return sendResponse(res, { status: err.status, messages: err.message })
  }
}

const getAllCandidateAttributeAssignments = async (req, res) => {
  try {
    const result = await service.getAllCandidateAttributeAssignments()
    return sendResponse(res, { status: STATUS_CODE.OK, data: result })
  } catch (err) {
    return sendResponse(res, { status: err.status, messages: err.message })
  }
}

const getCandidateAttributeAssignmentById = async (req, res) => {
  try {
    const { id } = req.params
    const result = await service.getCandidateAttributeAssignmentById(id)
    return sendResponse(res, { status: STATUS_CODE.OK, data: result })
  } catch (err) {
    return sendResponse(res, { status: err.status, messages: err.message })
  }
}

const updateCandidateAttributeAssignment = async (req, res) => {
  try {
    const { id } = req.params
    const { candidateId, attributeId, attributeValueId, customValue } = req.body
    const data = { candidateId, attributeId, attributeValueId, customValue }
    const result = await service.updateCandidateAttributeAssignment(id, data)
    return sendResponse(res, {
      status: STATUS_CODE.OK,
      messages: 'Updated successfully',
      data: result
    })
  } catch (err) {
    return sendResponse(res, { status: err.status, messages: err.message })
  }
}

const deleteCandidateAttributeAssignment = async (req, res) => {
  try {
    const { id } = req.params
    await service.deleteCandidateAttributeAssignment(id)
    return sendResponse(res, {
      status: STATUS_CODE.OK,
      messages: 'Deleted successfully'
    })
  } catch (err) {
    return sendResponse(res, { status: err.status, messages: err.message })
  }
}

const getAssignmentsByCandidateId = async (req, res) => {
  try {
    const { candidateId } = req.params
    const data = await service.getAssignmentsByCandidateId(candidateId)
    return sendResponse(res, { status: STATUS_CODE.OK, data })
  } catch (err) {
    return sendResponse(res, { status: err.status, messages: err.message })
  }
}

const getAssignmentsByAttributeId = async (req, res) => {
  try {
    const { attributeId } = req.params
    const data = await service.getAssignmentsByAttributeId(attributeId)
    return sendResponse(res, { status: STATUS_CODE.OK, data })
  } catch (err) {
    return sendResponse(res, { status: err.status, messages: err.message })
  }
}

const bulkCreateOrUpdateAssignments = async (req, res) => {
  try {
    const { candidateId, assignments } = req.body
    await service.bulkCreateOrUpdateAssignments(candidateId, assignments)
    return sendResponse(res, { status: STATUS_CODE.OK, messages: 'Bulk create/update successfully' })
  } catch (err) {
    return sendResponse(res, { status: err.status, messages: err.message })
  }
}

const deleteAllByCandidateId = async (req, res) => {
  try {
    const { candidateId } = req.params
    await service.deleteAllByCandidateId(candidateId)
    return sendResponse(res, { status: STATUS_CODE.OK, messages: 'Deleted all successfully' })
  } catch (err) {
    return sendResponse(res, { status: err.status, messages: err.message })
  }
}

const checkAssignmentExist = async (req, res) => {
  try {
    const { candidateId, attributeId, attributeValueId, customValue } = req.body
    const exists = await service.checkAssignmentExist({ candidateId, attributeId, attributeValueId, customValue })
    return sendResponse(res, { status: STATUS_CODE.OK, data: { exists } })
  } catch (err) {
    return sendResponse(res, { status: err.status, messages: err.message })
  }
}

const getAssignmentsByCandidateIds = async (req, res) => {
  try {
    const candidateIds = (req.query.candidateIds || '')
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean)
    const ids = candidateIds.map((id) => Number(id)).filter((id) => !isNaN(id))
    const data = await service.getAssignmentsByCandidateIds(ids)
    return sendResponse(res, { status: STATUS_CODE.OK, data })
  } catch (err) {
    return sendResponse(res, { status: err.status, messages: err.message })
  }
}

const deleteByCandidateAndAttributeId = async (req, res) => {
  try {
    const { candidateId, attributeId } = req.body
    await service.deleteByCandidateAndAttributeId(candidateId, attributeId)
    return sendResponse(res, { status: STATUS_CODE.OK, messages: 'Deleted successfully' })
  } catch (err) {
    return sendResponse(res, { status: err.status, messages: err.message })
  }
}

const countAssignmentsByCandidateId = async (req, res) => {
  try {
    const { candidateId } = req.params
    const count = await service.countAssignmentsByCandidateId(candidateId)
    return sendResponse(res, { status: STATUS_CODE.OK, data: { count } })
  } catch (err) {
    return sendResponse(res, { status: err.status, messages: err.message })
  }
}

const filterAssignments = async (req, res) => {
  try {
    const data = await service.filterAssignments(req.body)
    return sendResponse(res, { status: STATUS_CODE.OK, data })
  } catch (err) {
    return sendResponse(res, { status: err.status, messages: err.message })
  }
}

module.exports = {
  createCandidateAttributeAssignment,
  getAllCandidateAttributeAssignments,
  getCandidateAttributeAssignmentById,
  updateCandidateAttributeAssignment,
  deleteCandidateAttributeAssignment,
  getAssignmentsByCandidateId,
  getAssignmentsByAttributeId,
  bulkCreateOrUpdateAssignments,
  deleteAllByCandidateId,
  checkAssignmentExist,
  getAssignmentsByCandidateIds,
  deleteByCandidateAndAttributeId,
  countAssignmentsByCandidateId,
  filterAssignments
}
