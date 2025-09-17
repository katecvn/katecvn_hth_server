const db = require('../../../models')
const { STATUS_CODE } = require('../../../constants')
const ServiceException = require('../../../exceptions/ServiceException')
const { message } = require('../../../constants/message')
const { Op } = db.Sequelize

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

const ensureUniqueRule = async (data, excludeId = null) => {
  const where = { type: data.type }

  if (data.type === 'order_value') where.minOrderValue = data.minOrderValue
  if (data.type === 'time_slot') where.beforeTime = data.beforeTime

  if (excludeId) where.id = { [Op.ne]: excludeId }

  const exists = await db.RewardPointRule.findOne({ where })
  if (exists) {
    throw new ServiceException(
      message.isExisted,
      STATUS_CODE.BAD_REQUEST
    )
  }
}

const createRule = async (data) => {
  await ensureUniqueRule(data)
  return await db.RewardPointRule.create(data)
}

const updateRule = async (id, data) => {
  const rule = await db.RewardPointRule.findByPk(id)
  if (!rule) {
    throw new ServiceException('Không tìm thấy rule.', STATUS_CODE.NOT_FOUND)
  }

  await ensureUniqueRule(data, id)
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
