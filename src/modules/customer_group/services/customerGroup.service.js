const db = require('../../../models')

const getCustomerGroups = async (data) => {
  const { page = 1, limit = 9999, keyword } = data
  const offset = (page - 1) * limit
  const conditions = {}

  if (keyword) {
    conditions[db.Sequelize.Op.or] = [
      { name: { [db.Sequelize.Op.like]: `%${keyword}%` } },
      { description: { [db.Sequelize.Op.like]: `%${keyword}%` } },
    ]
  }

  const { count, rows: groups } = await db.CustomerGroup.findAndCountAll({
    offset,
    limit,
    where: conditions,
    distinct: true,
    order: [['createdAt', 'DESC']],
  })

  return {
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    groups,
  }
}

const getCustomerGroupsWithoutDiscount = async (data) => {
  const { page = 1, limit = 20, keyword } = data
  const offset = (page - 1) * limit
  const conditions = {}

  if (keyword) {
    conditions[db.Sequelize.Op.or] = [
      { name: { [db.Sequelize.Op.like]: `%${keyword}%` } },
      { description: { [db.Sequelize.Op.like]: `%${keyword}%` } },
    ]
  }

  const { count, rows: groups } = await db.CustomerGroup.findAndCountAll({
    offset,
    limit,
    where: conditions,
    distinct: true,
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: db.CustomerGroupDiscount,
        as: 'discounts',
        required: false,
      },
    ],
    having: db.Sequelize.literal('COUNT(`discounts`.`id`) = 0'),
    group: ['CustomerGroup.id'],
  })

  return {
    totalItems: count.length ? count.length : 0,
    totalPages: Math.ceil((count.length ? count.length : 0) / limit),
    currentPage: page,
    groups,
  }
}


const getCustomerGroupById = async (id) => {
  return await db.CustomerGroup.findByPk(id)
}

const createCustomerGroup = async (data) => {
  const { name, description, type } = data
  const transaction = await db.sequelize.transaction()
  try {
    const group = await db.CustomerGroup.create(
      { name, description, type },
      { transaction },
    )
    await transaction.commit()
    return group
  } catch (error) {
    await transaction.rollback()
    throw new Error(error.message)
  }
}

const updateCustomerGroup = async (id, data) => {
  const group = await db.CustomerGroup.findByPk(id)
  if (!group) throw new Error('Không tìm thấy nhóm khách hàng')

  const transaction = await db.sequelize.transaction()
  try {
    await group.update(
      {
        name: data.name,
        description: data.description,
        type: data.type || group.type, // giữ nguyên nếu không truyền
      },
      { transaction },
    )
    await transaction.commit()
    return group
  } catch (error) {
    await transaction.rollback()
    throw new Error(error.message)
  }
}

const deleteCustomerGroup = async (id) => {
  const group = await db.CustomerGroup.findByPk(id)
  if (!group) throw new Error('Không tìm thấy nhóm khách hàng')

  const transaction = await db.sequelize.transaction()
  try {
    await group.destroy({ transaction })
    await transaction.commit()
    return true
  } catch (error) {
    await transaction.rollback()
    throw new Error(error.message)
  }
}

module.exports = {
  getCustomerGroupsWithoutDiscount,
  getCustomerGroups,
  getCustomerGroupById,
  createCustomerGroup,
  updateCustomerGroup,
  deleteCustomerGroup,
}
