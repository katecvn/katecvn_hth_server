const db = require('../../../models')

const getHistories = async ({ userId, page = 1, limit = 50 }) => {
  const offset = (page - 1) * limit
  const where = {}
  if (userId) {
    where.userId = userId
  }

  const { count, rows } = await db.RewardPointHistory.findAndCountAll({
    where,
    limit,
    offset,
    include: [
      { model: db.User, as: 'user', attributes: ['id', 'full_name', 'email'] },
      { model: db.Order, as: 'order', attributes: ['id', 'code'] },
    ],
    order: [['createdAt', 'DESC']],
  })

  return {
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    histories: rows,
  }
}

module.exports = {
  getHistories,
}
