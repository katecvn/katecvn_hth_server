const { STATUS_CODE } = require('../../../constants')
const ServiceException = require('../../../exceptions/ServiceException')
const db = require('../models')
const { Op } = require('sequelize')

const create = async (data) => {
  const { name, unit } = data

  const isExistingName = await db.ProductOption.findOne({
    where: { name }
  })

  if (isExistingName) {
    throw new ServiceException({ name: 'Tên tùy chọn đã tồn tại' }, STATUS_CODE.BAD_REQUEST)
  }

  try {
    return await db.ProductOption.create({
      name,
      unit
    })
  } catch (e) {
    throw new ServiceException(e.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const findAll = async ({ page = 1, limit = 10, search, groupId }) => {
  const offset = (page - 1) * limit
  const where = {}

  if (search) {
    where.name = {
      [Op.like]: `%${search}%`
    }
  }

  const include = []
  if (groupId) {
    include.push({
      model: db.ProductGroup,
      as: 'productGroups',
      through: { where: { groupId } },
      attributes: []
    })
  }

  const { count, rows } = await db.ProductOption.findAndCountAll({
    where,
    limit,
    offset,
    order: [['createdAt', 'DESC']],
    include
  })

  return {
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    items: rows
  }
}

const findOne = async (id) => {
  const productOption = await db.ProductOption.findOne({
    where: { id },
    include: [
      {
        model: db.ProductGroup,
        as: 'productGroup',
        attributes: ['id', 'name']
      }
    ]
  })
  if (!productOption) {
    throw new Error('Product option not found')
  }
  return productOption
}

const update = async (id, data) => {
  const { name, unit } = data

  const productOption = await db.ProductOption.findByPk(id)
  if (!productOption) {
    throw new ServiceException({ id: 'Không tìm thấy tùy chọn' }, BAD_REQUEST)
  }

  const isExistingName = await db.ProductOption.findOne({
    where: {
      name,
      id: { [Op.ne]: id }
    }
  })

  if (isExistingName) {
    throw new ServiceException({ name: 'Tên đã tồn tại' }, STATUS_CODE.BAD_REQUEST)
  }

  try {
    await productOption.update({
      name,
      unit
    })
    return true
  } catch (e) {
    throw new ServiceException(e.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const remove = async (id) => {
  const productOption = await db.ProductOption.findByPk(id)
  if (!productOption) {
    throw new Error('Product option not found')
  }

  const transaction = await db.sequelize.transaction()
  try {
    await productOption.destroy({ transaction })
    await transaction.commit()
    return true
  } catch (e) {
    await transaction.rollback()
    throw new ServiceException(e.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const getProductOptionByConditions = async ({ name, groupId, notInIds }) => {
  try {
    const conditions = {}

    if (name) {
      conditions.name = name
    }

    if (groupId) {
      conditions.groupId = groupId
    }

    if (notInIds) {
      conditions.id = { [db.Sequelize.Op.notIn]: notInIds }
    }

    return await db.ProductOption.findOne({ where: conditions })
  } catch (e) {
    throw new ServiceException(e.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const getProductOptionById = async ({ id }) => {
  return await db.ProductOption.findOne({ where: { id } })
}

module.exports = {
  create,
  findAll,
  findOne,
  update,
  remove,
  getProductOptionByConditions,
  getProductOptionById
}
