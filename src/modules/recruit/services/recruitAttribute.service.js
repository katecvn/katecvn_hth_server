const { Op } = require('sequelize')
const db = require('../../../models')
const { STATUS_CODE } = require('../../../constants')
const ServiceException = require('../../../exceptions/ServiceException')

const create = async (data) => {
  try {
    return await db.RecruitAttribute.create(data)
  } catch (err) {
    throw new ServiceException(err.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const findAll = async ({ page = 1, limit = 10, search }) => {
  try {
    const offset = (page - 1) * limit
    const where = {}

    if (search) {
      where[Op.or] = [{ name: { [Op.like]: `%${search}%` } }, { code: { [Op.like]: `%${search}%` } }]
    }

    const { count, rows } = await db.RecruitAttribute.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    })

    return {
      totalItems: count,
      attributes: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: +page
    }
  } catch (err) {
    throw new ServiceException(err.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const findOne = async (id) => {
  try {
    return await db.RecruitAttribute.findByPk(id, {
      include: [
        {
          model: db.RecruitAttributesValue,
          as: 'values',
          required: false
        }
      ]
    })
  } catch (err) {
    throw new ServiceException(err.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const update = async (id, data) => {
  try {
    const record = await db.RecruitAttribute.findByPk(id)
    if (!record) throw new ServiceException('RecruitAttribute not found', STATUS_CODE.NOT_FOUND)

    const fieldsToUpdate = {
      name: data.name,
      code: data.code,
      defaultValue: data.defaultValue,
      isRequired: data.isRequired,
      description: data.description,
      displayPriority: data.displayPriority,
      isDefaultFilter: data.isDefaultFilter,
      isAdvancedFilter: data.isAdvancedFilter,
      icon: data.icon,
      updatedBy: data.updatedBy
    }

    await record.update(fieldsToUpdate)
    return record
  } catch (err) {
    throw new ServiceException(err.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const remove = async (id, updatedBy) => {
  try {
    const record = await db.RecruitAttribute.findByPk(id)
    if (!record) throw new ServiceException('RecruitAttribute not found', STATUS_CODE.NOT_FOUND)

    await record.update({ updatedBy })
    await record.destroy()
    return true
  } catch (err) {
    throw new ServiceException(err.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const getDefaultFilters = async () => {
  try {
    return await db.RecruitAttribute.findAll({
      where: { isDefaultFilter: true },
      order: [['displayPriority', 'ASC']]
    })
  } catch (err) {
    throw new ServiceException(err.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const getAdvancedFilters = async () => {
  try {
    return await db.RecruitAttribute.findAll({
      where: { isAdvancedFilter: true },
      order: [['displayPriority', 'ASC']]
    })
  } catch (err) {
    throw new ServiceException(err.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const getRequiredAttributes = async () => {
  try {
    return await db.RecruitAttribute.findAll({
      where: { isRequired: true },
      order: [['displayPriority', 'ASC']]
    })
  } catch (err) {
    throw new ServiceException(err.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const getAttributesByDisplayPriority = async () => {
  try {
    return await db.RecruitAttribute.findAll({
      order: [['displayPriority', 'ASC']]
    })
  } catch (err) {
    throw new ServiceException(err.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const getAttributesWithValues = async () => {
  try {
    return await db.RecruitAttribute.findAll({
      include: [
        {
          model: db.RecruitAttributesValue,
          as: 'values',
          required: false
        }
      ],
      order: [['displayPriority', 'ASC']]
    })
  } catch (err) {
    throw new ServiceException(err.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const getDetailWithValues = async (id) => {
  try {
    return await db.RecruitAttribute.findByPk(id, {
      include: [
        {
          model: db.RecruitAttributesValue,
          as: 'values',
          required: false
        }
      ]
    })
  } catch (err) {
    throw new ServiceException(err.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const findByCode = async ({ code, excludeId }) => {
  try {
    const where = { code }
    if (excludeId) {
      where.id = { [Op.ne]: excludeId }
    }
    return await db.RecruitAttribute.findOne({ where })
  } catch (err) {
    throw new ServiceException(err.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const checkCodeExists = async (code) => {
  try {
    const attr = await db.RecruitAttribute.findOne({ where: { code } })
    return !!attr
  } catch (err) {
    throw new ServiceException(err.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const updateOneDisplayPriority = async (id, displayPriority) => {
  try {
    const attr = await db.RecruitAttribute.findByPk(id)
    if (!attr) throw new ServiceException('RecruitAttribute not found', STATUS_CODE.NOT_FOUND)
    await attr.update({ displayPriority })
    return attr
  } catch (err) {
    throw new ServiceException(err.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const bulkUpdateDisplayPriority = async (list) => {
  const t = await db.sequelize.transaction()
  try {
    for (const item of list) {
      await db.RecruitAttribute.update({ displayPriority: item.displayPriority }, { where: { id: item.id }, transaction: t })
    }
    await t.commit()
    return true
  } catch (err) {
    await t.rollback()
    throw new ServiceException(err.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const searchAdvanced = async ({ page = 1, limit = 10, keyword, isDefaultFilter, isAdvancedFilter, isRequired }) => {
  try {
    const offset = (page - 1) * limit
    const where = {}

    if (keyword) {
      where[Op.or] = [
        { name: { [Op.like]: `%${keyword}%` } },
        { code: { [Op.like]: `%${keyword}%` } },
        { description: { [Op.like]: `%${keyword}%` } }
      ]
    }
    if (isDefaultFilter !== undefined) where.isDefaultFilter = isDefaultFilter
    if (isAdvancedFilter !== undefined) where.isAdvancedFilter = isAdvancedFilter
    if (isRequired !== undefined) where.isRequired = isRequired

    const { count, rows } = await db.RecruitAttribute.findAndCountAll({
      where,
      limit,
      offset,
      order: [['displayPriority', 'ASC']]
    })

    return {
      totalItems: count,
      attributes: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: +page
    }
  } catch (err) {
    throw new ServiceException(err.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const countByType = async () => {
  try {
    const total = await db.RecruitAttribute.count()
    const required = await db.RecruitAttribute.count({ where: { isRequired: true } })
    const defaultFilter = await db.RecruitAttribute.count({ where: { isDefaultFilter: true } })
    const advancedFilter = await db.RecruitAttribute.count({ where: { isAdvancedFilter: true } })

    return {
      total,
      required,
      defaultFilter,
      advancedFilter
    }
  } catch (err) {
    throw new ServiceException(err.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

module.exports = {
  create,
  findAll,
  findOne,
  update,
  remove,
  getDefaultFilters,
  getAdvancedFilters,
  getRequiredAttributes,
  getAttributesByDisplayPriority,
  getAttributesWithValues,
  getDetailWithValues,
  findByCode,
  checkCodeExists,
  updateOneDisplayPriority,
  bulkUpdateDisplayPriority,
  searchAdvanced,
  countByType
}
