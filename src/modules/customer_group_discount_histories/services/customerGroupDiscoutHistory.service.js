const { STATUS_CODE } = require('../../../constants')
const { message } = require('../../../constants/message')
const ServiceException = require('../../../exceptions/ServiceException')
const db = require('../../../models')

/**
 * Lấy danh sách lịch sử giảm giá
 */
const getHistories = async ({ page = 1, limit = 20, customerGroupId, productId }) => {
  const offset = (page - 1) * limit
  const where = {}
  if (customerGroupId) where.customerGroupId = customerGroupId
  if (productId) where.productId = productId

  const { count, rows } = await db.CustomerGroupDiscountHistory.findAndCountAll({
    where,
    include: [
      { model: db.CustomerGroup, as: 'customerGroup', attributes: ['id', 'name'] },
      { 
        model: db.Product, 
        as: 'product', 
        attributes: ['id', 'name', 'salePrice', 'originalPrice'] 
      },
      { model: db.User, as: 'updatedUser', attributes: ['id', 'full_name'] },
    ],
    order: [['createdAt', 'DESC']],
    offset,
    limit,
    distinct: true,
  })

  const histories = rows.map((h) => {
    const history = h.toJSON()
    const basePrice = Number(history.product?.salePrice || history.product?.originalPrice || 0)

    let oldFinal = basePrice
    let newFinal = basePrice

    if (history.oldType === 'percentage') {
      oldFinal = basePrice - (basePrice * Number(history.oldValue || 0)) / 100
    } else if (history.oldType === 'fixed') {
      oldFinal = basePrice - Number(history.oldValue || 0)
    }

    if (history.newType === 'percentage') {
      newFinal = basePrice - (basePrice * Number(history.newValue || 0)) / 100
    } else if (history.newType === 'fixed') {
      newFinal = basePrice - Number(history.newValue || 0)
    }

    if (oldFinal < 0) oldFinal = 0
    if (newFinal < 0) newFinal = 0

    return {
      ...history,
      basePrice,
      oldFinal,
      newFinal,
    }
  })

  return {
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    histories,
  }
}

/**
 * Lấy chi tiết 1 record lịch sử
 */
const getHistoryById = async (id) => {
  const history = await db.CustomerGroupDiscountHistory.findByPk(id, {
    include: [
      { model: db.CustomerGroup, as: 'customerGroup', attributes: ['id', 'name'] },
      { 
        model: db.Product, 
        as: 'product', 
        attributes: ['id', 'name', 'salePrice', 'originalPrice'] 
      },
      { model: db.User, as: 'updatedUser', attributes: ['id', 'fullName'] },
    ],
  })

  if (!history) {
    throw new ServiceException({ message: message.notFound }, STATUS_CODE.NOT_FOUND)
  }

  const h = history.toJSON()
  const basePrice = Number(h.product?.salePrice || h.product?.originalPrice || 0)

  let oldFinal = basePrice
  let newFinal = basePrice

  if (h.oldType === 'percentage') {
    oldFinal = basePrice - (basePrice * Number(h.oldValue || 0)) / 100
  } else if (h.oldType === 'fixed') {
    oldFinal = basePrice - Number(h.oldValue || 0)
  }

  if (h.newType === 'percentage') {
    newFinal = basePrice - (basePrice * Number(h.newValue || 0)) / 100
  } else if (h.newType === 'fixed') {
    newFinal = basePrice - Number(h.newValue || 0)
  }

  if (oldFinal < 0) oldFinal = 0
  if (newFinal < 0) newFinal = 0

  return {
    ...h,
    basePrice,
    oldFinal,
    newFinal,
  }
}

module.exports = {
  getHistories,
  getHistoryById,
}
