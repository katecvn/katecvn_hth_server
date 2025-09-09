const db = require('../../../models')
const BASE_STATUS = require('../../../constants/status')
const ServiceException = require('../../../exceptions/ServiceException')
const { STATUS_CODE } = require('../../../constants')
const { message } = require('../../../constants/message')

const reviewsMapping = async ({ reviews }) => {
  const activeReviews = reviews.filter((review) => (review.get ? review.get({ plain: true }) : review).status === BASE_STATUS.ACTIVE)
  const totalRating = activeReviews.reduce((sum, review) => sum + ((review.get ? review.get({ plain: true }) : review).rating || 0), 0)
  const avgRating = activeReviews.length > 0 ? totalRating / activeReviews.length : 0

  const productIds = [
    ...new Set(
      reviews.map((review) => {
        const plainReview = review.get ? review.get({ plain: true }) : review
        return plainReview.ableId
      })
    )
  ]

  const products = await db.Product.findAll({
    where: { id: productIds },
    attributes: ['id', 'name', 'slug', 'sku']
  })
  const productMap = {}
  products.forEach((product) => {
    productMap[product.id] = product.get ? product.get({ plain: true }) : product
  })

  const mappedReviews = reviews.map((review) => {
    const plainReview = review.get ? review.get({ plain: true }) : review
    const { ableType, ableId } = plainReview
    let plainProduct = null
    if (ableType === 'product') {
      plainProduct = productMap[ableId] || null
    }
    return {
      ...plainReview,
      product: plainProduct,
      avgRating
    }
  })
  return mappedReviews
}

const getReviews = async ({ page = 1, limit = 9999, status, ableType, ableId }) => {
  const offset = (page - 1) * limit
  const conditions = {}

  if (status) {
    conditions.status = status
  }

  if (ableType && ableId) {
    conditions.ableType = ableType
    conditions.ableId = ableId
  }

  const { count, rows: reviews } = await db.Review.findAndCountAll({
    where: conditions,
    include: [
      {
        model: db.User,
        as: 'user',
        attributes: ['id', 'code', 'full_name', 'email', 'phone_number']
      }
    ],
    attributes: ['id', 'ableType', 'ableId', 'userId', 'rating', 'reviewText', 'status', 'createdAt'],
    limit,
    offset,
    distinct: true
  })

  const reviewsResponse = await reviewsMapping({ reviews })

  return {
    totalItems: count,
    currentPage: page,
    totalPages: Math.ceil(count / limit),
    reviews: reviewsResponse
  }
}

const getAllReviews = async (data) => {
  return await getReviews(data)
}

const getPublicReviews = async (data) => {
  return await getReviews({ ...data, status: BASE_STATUS.ACTIVE })
}

const getReviewById = async (id) => {
  return await db.Review.findByPk(id)
}

const createReview = async (data) => {
  const { ableType, ableId, userId, rating, reviewText } = data

  if (ableType !== 'product') {
    throw new ServiceException({ ableType: 'Không hợp lệ' }, STATUS_CODE.BAD_REQUEST)
  }

  const isExistProduct = await db.ProductVariant.findOne({
    where: { id: ableId }
  })

  if (!isExistProduct) {
    throw new ServiceException({ ableId: message.notFound }, STATUS_CODE.NOT_FOUND)
  }

  try {
    return await db.Review.create({
      ableType,
      ableId,
      userId,
      rating,
      reviewText,
      createdBy: userId,
      status: BASE_STATUS.BLOCKED
    })
  } catch (error) {
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const updateStatus = async ({ status, id }) => {
  const review = await db.Review.findOne({ where: { id } })

  try {
    await review.update({
      status
    })

    return true
  } catch (error) {
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const deleteReview = async (id) => {
  const review = await db.Review.findOne({ where: { id } })

  try {
    await review.destroy()
    return review
  } catch (error) {
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

module.exports = {
  getAllReviews,
  getPublicReviews,
  getReviewById,
  createReview,
  updateStatus,
  deleteReview
}
