const db = require('../../../models')

/**
 * Lấy danh sách lịch sử giảm giá của nhóm
 */
const getHistories = async ({ page = 1, limit = 20, customerGroupId }) => {
  const offset = (page - 1) * limit
  const where = {}

  if (customerGroupId) {
    where.customerGroupId = customerGroupId
  }

  const { count, rows } = await db.CustomerGroupDiscountHistory.findAndCountAll({
    where,
    include: [
      { model: db.CustomerGroup, as: 'customerGroup' },
      { model: db.User, as: 'changedUser' }
    ],
    order: [['changedAt', 'DESC']],
    offset,
    limit,
    distinct: true
  })

  return {
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    histories: rows
  }
}

/**
 * Lấy chi tiết 1 record lịch sử
 */
const getHistoryById = async (id) => {
  return await db.CustomerGroupDiscountHistory.findByPk(id, {
    include: [
      { model: db.CustomerGroup, as: 'customerGroup' },
      { model: db.User, as: 'changedUser' }
    ]
  })
}

module.exports = {
  getHistories,
  getHistoryById
}
