const { sendResponse } = require('../../../utils/APIResponse')
const { STATUS_CODE } = require('../../../constants')
const { message } = require('../../../constants/message')
const recruitPostService = require('../services/recruitPost.service')

const createRecruitPost = async (req, res) => {
  try {
    const {
      title,
      slug,
      status,
      jobDescription,
      jobRequirements,
      benefits,
      applyRequirements,
      contactInfo,
      deadline,
      applyAddress,
      applyEmail,
      createdBy
    } = req.body

    const data = {
      title,
      slug,
      status,
      jobDescription,
      jobRequirements,
      benefits,
      applyRequirements,
      contactInfo,
      deadline,
      applyAddress,
      applyEmail,
      createdBy
    }

    const result = await recruitPostService.createRecruitPost(data)

    return sendResponse(res, {
      status: STATUS_CODE.CREATED,
      messages: message.createdSuccessfully,
      data: result
    })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const fullCreateRecruitPost = async (req, res) => {
  try {
    const data = req.body
    const result = await recruitPostService.fullCreateRecruitPost(data)
    return sendResponse(res, {
      status: STATUS_CODE.CREATED,
      messages: message.createdSuccessfully,
      data: result
    })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const fullUpdateRecruitPost = async (req, res) => {
  try {
    const data = req.body
    const result = await recruitPostService.fullUpdateRecruitPost(req.params.id, data)
    return sendResponse(res, {
      status: STATUS_CODE.OK,
      messages: message.updatedSuccessfully,
      data: result
    })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const getAllRecruitPosts = async (req, res) => {
  try {
    const result = await recruitPostService.getAllRecruitPosts(req.query)
    return sendResponse(res, { status: STATUS_CODE.OK, data: result })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const getRecruitPostById = async (req, res) => {
  try {
    const result = await recruitPostService.getRecruitPostById(req.params.id)
    return sendResponse(res, { status: STATUS_CODE.OK, data: result })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const getRecruitPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params
    const result = await recruitPostService.getRecruitPostBySlug(slug)
    return sendResponse(res, { status: STATUS_CODE.OK, data: result })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const updateRecruitPost = async (req, res) => {
  try {
    const {
      title,
      slug,
      status,
      jobDescription,
      jobRequirements,
      benefits,
      applyRequirements,
      contactInfo,
      deadline,
      applyAddress,
      applyEmail,
      updatedBy
    } = req.body

    const data = {
      title,
      slug,
      status,
      jobDescription,
      jobRequirements,
      benefits,
      applyRequirements,
      contactInfo,
      deadline,
      applyAddress,
      applyEmail,
      updatedBy
    }

    const result = await recruitPostService.updateRecruitPost(req.params.id, data)

    return sendResponse(res, {
      status: STATUS_CODE.OK,
      messages: message.updatedSuccessfully,
      data: result
    })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const deleteRecruitPost = async (req, res) => {
  try {
    await recruitPostService.deleteRecruitPost(req.params.id)
    return sendResponse(res, { status: STATUS_CODE.OK, messages: message.deletedSuccessfully })
  } catch (error) {
    return sendResponse(res, { status: error.status, messages: error.message })
  }
}

const getPublishedRecruitPosts = async (req, res) => {
  try {
    const result = await recruitPostService.getPublishedRecruitPosts(req.query)
    return sendResponse(res, { status: STATUS_CODE.OK, data: result })
  } catch (error) {
    return sendResponse(res, { status: error.status || STATUS_CODE.INTERNAL_SERVER_ERROR, messages: error.message })
  }
}

const getDraftRecruitPosts = async (req, res) => {
  try {
    const result = await recruitPostService.getDraftRecruitPosts(req.query)
    return sendResponse(res, { status: STATUS_CODE.OK, data: result })
  } catch (error) {
    return sendResponse(res, { status: error.status || STATUS_CODE.INTERNAL_SERVER_ERROR, messages: error.message })
  }
}

const filterRecruitPosts = async (req, res) => {
  try {
    const filter = req.body.filter || {}
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 10

    const result = await recruitPostService.filterRecruitPosts(filter, page, limit)
    return sendResponse(res, { status: STATUS_CODE.OK, data: result })
  } catch (error) {
    return sendResponse(res, {
      status: error.status || STATUS_CODE.INTERNAL_SERVER_ERROR,
      messages: error.message
    })
  }
}

const publicFilterRecruitPosts = async (req, res) => {
  try {
    const filter = req.body.filter || {}
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 10

    filter.status = 'published'

    const result = await recruitPostService.filterRecruitPosts(filter, page, limit)
    return sendResponse(res, { status: STATUS_CODE.OK, data: result })
  } catch (error) {
    return sendResponse(res, {
      status: error.status || STATUS_CODE.INTERNAL_SERVER_ERROR,
      messages: error.message
    })
  }
}

const bulkUpdateStatus = async (req, res) => {
  try {
    const { ids, status } = req.body
    await recruitPostService.bulkUpdateStatus(ids, status)
    return sendResponse(res, { status: STATUS_CODE.OK, messages: message.updatedSuccessfully })
  } catch (error) {
    return sendResponse(res, { status: error.status || STATUS_CODE.INTERNAL_SERVER_ERROR, messages: error.message })
  }
}

const updateStatusRecruitPost = async (req, res) => {
  try {
    const { status } = req.body
    const { id } = req.params
    const result = await recruitPostService.updateStatusRecruitPost(id, status)
    return sendResponse(res, { status: STATUS_CODE.OK, messages: message.updatedSuccessfully, data: result })
  } catch (error) {
    return sendResponse(res, { status: error.status || STATUS_CODE.INTERNAL_SERVER_ERROR, messages: error.message })
  }
}

const restoreRecruitPost = async (req, res) => {
  try {
    const { id } = req.params
    const result = await recruitPostService.restoreRecruitPost(id)
    return sendResponse(res, { status: STATUS_CODE.OK, messages: message.updatedSuccessfully, data: result })
  } catch (error) {
    return sendResponse(res, { status: error.status || STATUS_CODE.INTERNAL_SERVER_ERROR, messages: error.message })
  }
}

const permanentlyDeleteRecruitPost = async (req, res) => {
  try {
    const { id } = req.params
    await recruitPostService.permanentlyDeleteRecruitPost(id)
    return sendResponse(res, { status: STATUS_CODE.OK, messages: message.deletedSuccessfully })
  } catch (error) {
    return sendResponse(res, { status: error.status || STATUS_CODE.INTERNAL_SERVER_ERROR, messages: error.message })
  }
}

const getRecruitPostsByUser = async (req, res) => {
  try {
    const userId = req.params.userId
    const result = await recruitPostService.getRecruitPostsByUser(userId, req.query)
    return sendResponse(res, { status: STATUS_CODE.OK, data: result })
  } catch (error) {
    return sendResponse(res, { status: error.status || STATUS_CODE.INTERNAL_SERVER_ERROR, messages: error.message })
  }
}

const extendDeadline = async (req, res) => {
  try {
    const { id } = req.params
    const { newDeadline } = req.body
    const result = await recruitPostService.extendDeadline(id, newDeadline)
    return sendResponse(res, { status: STATUS_CODE.OK, messages: message.updatedSuccessfully, data: result })
  } catch (error) {
    return sendResponse(res, { status: error.status || STATUS_CODE.INTERNAL_SERVER_ERROR, messages: error.message })
  }
}

const countCandidatesByRecruitPost = async (req, res) => {
  try {
    const { postId } = req.params
    const count = await recruitPostService.countCandidatesByRecruitPost(postId)
    return sendResponse(res, { status: STATUS_CODE.OK, data: { candidateCount: count } })
  } catch (error) {
    return sendResponse(res, { status: error.status || STATUS_CODE.INTERNAL_SERVER_ERROR, messages: error.message })
  }
}

const getAlmostExpiredPosts = async (req, res) => {
  try {
    const days = parseInt(req.query.days, 10) || 3
    const posts = await recruitPostService.getAlmostExpiredPosts(days)
    return sendResponse(res, { status: STATUS_CODE.OK, data: posts })
  } catch (error) {
    return sendResponse(res, { status: error.status || STATUS_CODE.INTERNAL_SERVER_ERROR, messages: error.message })
  }
}

module.exports = {
  createRecruitPost,
  fullCreateRecruitPost,
  fullUpdateRecruitPost,
  getAllRecruitPosts,
  getRecruitPostById,
  getRecruitPostBySlug,
  updateRecruitPost,
  deleteRecruitPost,
  getPublishedRecruitPosts,
  getDraftRecruitPosts,
  filterRecruitPosts,
  publicFilterRecruitPosts,
  bulkUpdateStatus,
  updateStatusRecruitPost,
  restoreRecruitPost,
  permanentlyDeleteRecruitPost,
  getRecruitPostsByUser,
  extendDeadline,
  countCandidatesByRecruitPost,
  getAlmostExpiredPosts
}
