const ReviewService = require('../services/review.service')
const { STATUS_CODE } = require('../../../constants')
const http = require('../../../utils/http')

const getAllReviews = async (req, res, next) => {
  const query = req.query
  const { provider: ableType } = req.params

  try {
    const result = await ReviewService.getAllReviews({ ...query, ableType })
    return http.json(res, 'Thành công', STATUS_CODE.OK, result)
  } catch (error) {
    next(error)
  }
}

const getPublicReviews = async (req, res, next) => {
  const query = req.query
  const { provider: ableType } = req.params

  try {
    const result = await ReviewService.getPublicReviews({ ...query, ableType })
    return http.json(res, 'Thành công', STATUS_CODE.OK, result)
  } catch (error) {
    next(error)
  }
}

const getReviewById = async (req, res, next) => {
  const { id } = req.params
  try {
    const review = await ReviewService.getReviewById(id)
    return http.json(res, 'Thành công', STATUS_CODE.OK, review)
  } catch (error) {
    next(error)
  }
}

const createReview = async (req, res, next) => {
  const { provider: ableType } = req.params
  const { user } = req
  const data = req.body
  try {
    await ReviewService.createReview({ ...data, ableType, userId: user.id })
    return http.json(res, 'Thành công', STATUS_CODE.OK)
  } catch (error) {
    next(error)
  }
}

const updateStatus = async (req, res, next) => {
  const { status } = req.body
  const { id } = req.params
  try {
    await ReviewService.updateStatus({ status, id })
    return http.json(res, 'Thành công', STATUS_CODE.OK)
  } catch (error) {
    next(error)
  }
}

const deleteReview = async (req, res, next) => {
  const { id } = req.params
  try {
    await ReviewService.deleteReview(id)
    return http.json(res, 'Thành công', STATUS_CODE.OK)
  } catch (error) {
    next(error)
  }
}

const reviewController = {
  getAllReviews,
  getPublicReviews,
  getReviewById,
  createReview,
  updateStatus,
  deleteReview
}

module.exports = reviewController
