const db = require('../../../models')
const { STATUS_CODE } = require('../../../constants')
const ServiceException = require('../../../exceptions/ServiceException')

const getRules = async ({ page = 1, limit = 50 }) => {
  const offset = (page - 1) * limit
  const { count, rows } = await db.RewardPointRule.findAndCountAll({
    limit,
    offset,
    order: [['createdAt', 'DESC']],
  })

  return {
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    rules: rows,
  }
}

const createRule = async (data) => {
  return await db.RewardPointRule.create(data)
}

const updateRule = async (id, data) => {
  const rule = await db.RewardPointRule.findByPk(id)
  if (!rule) {
    throw new ServiceException('Không tìm thấy rule.', STATUS_CODE.NOT_FOUND)
  }
  await rule.update(data)
  return rule
}

const deleteRule = async (id) => {
  const rule = await db.RewardPointRule.findByPk(id)
  if (!rule) {
    throw new ServiceException('Không tìm thấy rule.', STATUS_CODE.NOT_FOUND)
  }
  await rule.destroy()
  return true
}

module.exports = {
  getRules,
  createRule,
  updateRule,
  deleteRule,
}
