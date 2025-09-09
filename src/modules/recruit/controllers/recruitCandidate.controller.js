const { STATUS_CODE } = require('../../../constants')
const { message } = require('../../../constants/message')
const { sendResponse } = require('../../../utils/APIResponse')
const recruitCandidateService = require('../services/recruitCandidate.service')

const createRecruitCandidate = async (req, res) => {
  try {
    const { recruitPostId, candidateName, candidatePhone, candidateEmail, dateOfBirth, gender, address, cvUrl, status, createdBy } = req.body

    const result = await recruitCandidateService.createRecruitCandidate({
      recruitPostId,
      candidateName,
      candidatePhone,
      candidateEmail,
      dateOfBirth,
      gender,
      address,
      cvUrl,
      createdBy
    })

    return sendResponse(res, {
      status: STATUS_CODE.CREATED,
      messages: message.createdSuccessfully,
      data: result
    })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const fullCreateRecruitCandidate = async (req, res) => {
  try {
    const { recruitPostId, candidateName, candidatePhone, candidateEmail, dateOfBirth, gender, address, cvUrl, createdBy, attributes } = req.body

    const data = {
      recruitPostId,
      candidateName,
      candidatePhone,
      candidateEmail,
      dateOfBirth,
      gender,
      address,
      cvUrl,
      createdBy,
      attributes
    }

    const result = await recruitCandidateService.fullCreateCandidate(data)

    return sendResponse(res, {
      status: STATUS_CODE.CREATED,
      messages: message.createdSuccessfully,
      data: result
    })
  } catch (error) {
    return sendResponse(res, {
      status: error.status || STATUS_CODE.INTERNAL_SERVER_ERROR,
      messages: error.message
    })
  }
}

const fullUpdateRecruitCandidate = async (req, res) => {
  try {
    const { recruitPostId, candidateName, candidatePhone, candidateEmail, dateOfBirth, gender, address, cvUrl, status, updatedBy, attributes } =
      req.body

    const data = {
      recruitPostId,
      candidateName,
      candidatePhone,
      candidateEmail,
      dateOfBirth,
      gender,
      address,
      cvUrl,
      status,
      updatedBy,
      attributes
    }

    const result = await recruitCandidateService.fullUpdateCandidate(req.params.id, data)

    return sendResponse(res, {
      status: STATUS_CODE.OK,
      messages: message.updatedSuccessfully,
      data: result
    })
  } catch (error) {
    return sendResponse(res, {
      status: error.status || STATUS_CODE.INTERNAL_SERVER_ERROR,
      messages: error.message
    })
  }
}

const getAllRecruitCandidates = async (req, res) => {
  try {
    const result = await recruitCandidateService.getAllRecruitCandidates(req.query)
    return sendResponse(res, { status: STATUS_CODE.OK, data: result })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const getRecruitCandidateById = async (req, res) => {
  try {
    const result = await recruitCandidateService.getRecruitCandidateById(req.params.id)
    return sendResponse(res, { status: STATUS_CODE.OK, data: result })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const updateRecruitCandidate = async (req, res) => {
  try {
    const { candidateName, candidatePhone, candidateEmail, dateOfBirth, gender, address, cvUrl, status, updatedBy } = req.body

    const result = await recruitCandidateService.updateRecruitCandidate(req.params.id, {
      candidateName,
      candidatePhone,
      candidateEmail,
      dateOfBirth,
      gender,
      address,
      cvUrl,
      status,
      updatedBy
    })

    return sendResponse(res, {
      status: STATUS_CODE.OK,
      messages: message.updatedSuccessfully,
      data: result
    })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const deleteRecruitCandidate = async (req, res) => {
  try {
    await recruitCandidateService.deleteRecruitCandidate(req.params.id)
    return sendResponse(res, {
      status: STATUS_CODE.OK,
      messages: message.deletedSuccessfully
    })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const getRecruitCandidatesByRecruitPost = async (req, res) => {
  try {
    const result = await recruitCandidateService.getRecruitCandidatesByRecruitPost({
      recruitPostId: req.params.recruitPostId,
      ...req.query
    })
    return sendResponse(res, { status: STATUS_CODE.OK, data: result })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const getRecruitCandidatesByUser = async (req, res) => {
  try {
    const result = await recruitCandidateService.getRecruitCandidatesByUser({
      userId: req.params.userId,
      ...req.query
    })
    return sendResponse(res, { status: STATUS_CODE.OK, data: result })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const updateRecruitCandidateStatus = async (req, res) => {
  try {
    const { status } = req.body
    const result = await recruitCandidateService.updateRecruitCandidateStatus(req.params.id, status)
    return sendResponse(res, {
      status: STATUS_CODE.OK,
      messages: message.updatedSuccessfully,
      data: result
    })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const bulkUpdateRecruitCandidateStatus = async (req, res) => {
  try {
    const { ids, status } = req.body
    await recruitCandidateService.bulkUpdateRecruitCandidateStatus({ ids, status })
    return sendResponse(res, { status: STATUS_CODE.OK, messages: message.updatedSuccessfully })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const restoreRecruitCandidate = async (req, res) => {
  try {
    const result = await recruitCandidateService.restoreRecruitCandidate(req.params.id)
    return sendResponse(res, { status: STATUS_CODE.OK, messages: message.restoredSuccessfully, data: result })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const permanentlyDeleteRecruitCandidate = async (req, res) => {
  try {
    await recruitCandidateService.permanentlyDeleteRecruitCandidate(req.params.id)
    return sendResponse(res, { status: STATUS_CODE.OK, messages: message.deletedSuccessfully })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const countRecruitCandidatesByRecruitPost = async (req, res) => {
  try {
    const count = await recruitCandidateService.countRecruitCandidatesByRecruitPost(req.params.recruitPostId)
    return sendResponse(res, { status: STATUS_CODE.OK, data: { count } })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const searchRecruitCandidates = async (req, res) => {
  try {
    const result = await recruitCandidateService.searchRecruitCandidates(req.query)
    return sendResponse(res, { status: STATUS_CODE.OK, data: result })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const filterRecruitCandidates = async (req, res) => {
  try {
    const { filter = {} } = req.body
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 10

    const result = await recruitCandidateService.filterRecruitCandidates(filter, page, limit)

    return sendResponse(res, { status: STATUS_CODE.OK, data: result })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const countRecruitCandidateByStatus = async (req, res) => {
  try {
    const result = await recruitCandidateService.countRecruitCandidateByStatus(req.params.recruitPostId)
    return sendResponse(res, { status: STATUS_CODE.OK, data: result })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

module.exports = {
  createRecruitCandidate,
  getAllRecruitCandidates,
  getRecruitCandidateById,
  updateRecruitCandidate,
  deleteRecruitCandidate,
  getRecruitCandidatesByRecruitPost,
  getRecruitCandidatesByUser,
  updateRecruitCandidateStatus,
  bulkUpdateRecruitCandidateStatus,
  restoreRecruitCandidate,
  permanentlyDeleteRecruitCandidate,
  countRecruitCandidatesByRecruitPost,
  searchRecruitCandidates,
  filterRecruitCandidates,
  countRecruitCandidateByStatus,
  fullCreateRecruitCandidate,
  fullUpdateRecruitCandidate
}
