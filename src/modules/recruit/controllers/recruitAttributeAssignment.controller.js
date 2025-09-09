const { sendResponse } = require('../../../utils/APIResponse')
const { STATUS_CODE } = require('../../../constants')
const recruitAttributeAssignmentService = require('../services/recruitAttributeAssignment.service')

const createRecruitAttributeAssignment = async (req, res) => {
  try {
    const { recruitPostId, attributeId, attributeValueId, customValue } = req.body

    const created = await recruitAttributeAssignmentService.createRecruitAttributeAssignment({
      recruitPostId,
      attributeId,
      attributeValueId,
      customValue
    })

    return sendResponse(res, {
      status: STATUS_CODE.CREATED,
      data: created
    })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const getAllRecruitAttributeAssignments = async (_req, res) => {
  try {
    const data = await recruitAttributeAssignmentService.getAllRecruitAttributeAssignments()

    return sendResponse(res, {
      status: STATUS_CODE.OK,
      data
    })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const getRecruitAttributeAssignmentById = async (req, res) => {
  try {
    const data = await recruitAttributeAssignmentService.getRecruitAttributeAssignmentById(req.params.id)

    return sendResponse(res, {
      status: STATUS_CODE.OK,
      data
    })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const updateRecruitAttributeAssignment = async (req, res) => {
  try {
    const { recruitPostId, attributeId, attributeValueId, customValue } = req.body

    const updated = await recruitAttributeAssignmentService.updateRecruitAttributeAssignment(req.params.id, {
      recruitPostId,
      attributeId,
      attributeValueId,
      customValue
    })

    return sendResponse(res, {
      status: STATUS_CODE.OK,
      messages: 'Cập nhật thành công',
      data: updated
    })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const deleteRecruitAttributeAssignment = async (req, res) => {
  try {
    await recruitAttributeAssignmentService.deleteRecruitAttributeAssignment(req.params.id)
    return sendResponse(res, {
      status: STATUS_CODE.OK,
      messages: 'Xóa thành công'
    })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const getAllByRecruitPostId = async (req, res) => {
  try {
    const { recruitPostId } = req.params
    const result = await recruitAttributeAssignmentService.getAllByRecruitPostId(recruitPostId)
    return sendResponse(res, { status: STATUS_CODE.OK, data: result })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const getAssignmentsByAttributeId = async (req, res) => {
  try {
    const { attributeId } = req.params
    const result = await recruitAttributeAssignmentService.getAssignmentsByAttributeId(attributeId)
    return sendResponse(res, { status: STATUS_CODE.OK, data: result })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const bulkCreateOrUpdateAssignments = async (req, res) => {
  try {
    const { recruitPostId, assignments } = req.body // assignments: [{attributeId, attributeValueId, customValue}]
    await recruitAttributeAssignmentService.bulkCreateOrUpdateAssignments(recruitPostId, assignments)
    return sendResponse(res, { status: STATUS_CODE.OK, messages: 'Cập nhật thành công' })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const deleteAllByRecruitPostId = async (req, res) => {
  try {
    const { recruitPostId } = req.params
    await recruitAttributeAssignmentService.deleteAllByRecruitPostId(recruitPostId)
    return sendResponse(res, { status: STATUS_CODE.OK, messages: 'Xóa thành công' })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const getAssignmentsByRecruitPostIds = async (req, res) => {
  try {
    let { recruitPostIds } = req.query
    if (typeof recruitPostIds === 'string') recruitPostIds = recruitPostIds.split(',').map(Number)
    const result = await recruitAttributeAssignmentService.getAssignmentsByRecruitPostIds(recruitPostIds)
    return sendResponse(res, { status: STATUS_CODE.OK, data: result })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const checkAssignmentExist = async (req, res) => {
  try {
    const { recruitPostId, attributeId } = req.body
    const exist = await recruitAttributeAssignmentService.checkAssignmentExist({ recruitPostId, attributeId })
    return sendResponse(res, { status: STATUS_CODE.OK, data: { exist } })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const deleteByRecruitPostAndAttributeId = async (req, res) => {
  try {
    const { recruitPostId, attributeId } = req.body
    await recruitAttributeAssignmentService.deleteByRecruitPostAndAttributeId(recruitPostId, attributeId)
    return sendResponse(res, { status: STATUS_CODE.OK, messages: 'Xóa thành công' })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const countAssignmentsByRecruitPostId = async (req, res) => {
  try {
    const { recruitPostId } = req.params
    const count = await recruitAttributeAssignmentService.countAssignmentsByRecruitPostId(recruitPostId)
    return sendResponse(res, { status: STATUS_CODE.OK, data: { count } })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const filterAssignments = async (req, res) => {
  try {
    const result = await recruitAttributeAssignmentService.filterAssignments(req.body)
    return sendResponse(res, { status: STATUS_CODE.OK, data: result })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

module.exports = {
  createRecruitAttributeAssignment,
  getAllRecruitAttributeAssignments,
  getRecruitAttributeAssignmentById,
  updateRecruitAttributeAssignment,
  deleteRecruitAttributeAssignment,
  getAllByRecruitPostId,
  getAssignmentsByAttributeId,
  bulkCreateOrUpdateAssignments,
  deleteAllByRecruitPostId,
  getAssignmentsByRecruitPostIds,
  checkAssignmentExist,
  deleteByRecruitPostAndAttributeId,
  countAssignmentsByRecruitPostId,
  filterAssignments
}
