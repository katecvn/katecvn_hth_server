const { STATUS_CODE } = require('../constants')
const CommentService = require('../services/CommentService')
const http = require('../utils/http')

const createComment = async (req, res, next) => {
  const data = req.body
  const { provider } = req.params
  const { user } = req
  try {
    const comment = await CommentService.createComment({ ...data, ableType: provider }, user.id)
    return http.json(res, 'Thành công', STATUS_CODE.CREATED, comment)
  } catch (error) {
    next(error)
  }
}

const updateComment = async (req, res, next) => {
  const { user } = req
  const { id } = req.params
  const { content } = req.body
  try {
    const commentUpdated = await CommentService.updateComment(id, user.id, content)
    return http.json(res, 'Thành công', STATUS_CODE.OK, commentUpdated)
  } catch (error) {
    next(error)
  }
}

const updateCommentStatus = async (req, res, next) => {
  const { id } = req.params
  const { status } = req.body
  const { user } = req

  try {
    await CommentService.updateCommentStatus(id, status, user.id)
    return http.json(res, 'Thành công', STATUS_CODE.OK)
  } catch (error) {
    next(error)
  }
}

const deleteComment = async (req, res, next) => {
  const { id } = req.params

  try {
    await CommentService.deleteComment(id)
    return http.json(res, 'Thành công', STATUS_CODE.OK)
  } catch (error) {
    next(error)
  }
}

const getComments = async (req, res, next) => {
  const { userId, ableId } = req.query
  const { provider } = req.params
  try {
    const comments = await CommentService.getComments(userId, provider, ableId)
    return http.json(res, 'Thành công', STATUS_CODE.OK, comments)
  } catch (error) {
    next(error)
  }
}

const getPublicComments = async (req, res, next) => {
  const { userId, ableId } = req.query
  const { provider } = req.params

  try {
    const comments = await CommentService.getPublicComments(userId, provider, ableId)
    return http.json(res, 'Thành công', STATUS_CODE.OK, comments)
  } catch (error) {
    next(error)
  }
}

const deleteCommentByUser = async (req, res, next) => {
  const { id } = req.params

  try {
    await CommentService.deleteComment(id)
    return http.json(res, 'Thành công', STATUS_CODE.OK)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  createComment,
  updateComment,
  updateCommentStatus,
  deleteComment,
  deleteCommentByUser,
  getComments,
  getPublicComments
}
