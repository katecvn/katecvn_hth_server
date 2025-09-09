const { STATUS_CODE } = require('../../../constants')
const ServiceException = require('../../../exceptions/ServiceException')
const db = require('../../../models')
const { Op } = require('sequelize')

const createRecruitAttributeValue = async ({ attributeId, value, isDefault }) => {
  try {
    return await db.RecruitAttributesValue.create({ attributeId, value, isDefault })
  } catch (error) {
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const getAllRecruitAttributeValues = async () => {
  try {
    return await db.RecruitAttributesValue.findAll({
      include: [
        {
          model: db.RecruitAttribute,
          as: 'attribute'
        }
      ],
      order: [['id', 'DESC']]
    })
  } catch (error) {
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const getRecruitAttributeValueById = async (id) => {
  try {
    const value = await db.RecruitAttributesValue.findByPk(id, {
      include: [{ model: db.RecruitAttribute, as: 'attribute' }]
    })
    if (!value) throw new ServiceException('RecruitAttributesValue not found', STATUS_CODE.NOT_FOUND)
    return value
  } catch (error) {
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const updateRecruitAttributeValue = async (id, data) => {
  try {
    const value = await db.RecruitAttributesValue.findByPk(id)
    if (!value) throw new ServiceException('RecruitAttributesValue not found', STATUS_CODE.NOT_FOUND)
    await value.update(data)
    return value
  } catch (error) {
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const deleteRecruitAttributeValue = async (id) => {
  try {
    const value = await db.RecruitAttributesValue.findByPk(id)
    if (!value) throw new ServiceException('RecruitAttributesValue not found', STATUS_CODE.NOT_FOUND)
    await value.destroy()
    return true
  } catch (error) {
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const getValuesByAttributeId = async (attributeId) => {
  try {
    return await db.RecruitAttributesValue.findAll({
      where: { attributeId },
      order: [['id', 'ASC']]
    })
  } catch (error) {
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const getDefaultValueByAttributeId = async (attributeId) => {
  try {
    return await db.RecruitAttributesValue.findOne({
      where: { attributeId, isDefault: true }
    })
  } catch (error) {
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const checkDuplicateValueInAttribute = async ({ attributeId, value, excludeId }) => {
  try {
    const where = { attributeId, value }
    if (excludeId) where.id = { [Op.ne]: excludeId }
    const exist = await db.RecruitAttributesValue.findOne({ where })
    return !!exist
  } catch (error) {
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const bulkCreateOrUpdateValues = async (attributeId, values) => {
  const t = await db.sequelize.transaction()
  try {
    const ids = values.filter((v) => v.id).map((v) => v.id)
    if (ids.length) {
      await db.RecruitAttributesValue.destroy({
        where: { attributeId, id: { [Op.notIn]: ids } },
        transaction: t
      })
    } else {
      await db.RecruitAttributesValue.destroy({ where: { attributeId }, transaction: t })
    }
    for (const v of values) {
      if (v.id) {
        await db.RecruitAttributesValue.update({ value: v.value, isDefault: v.isDefault }, { where: { id: v.id, attributeId }, transaction: t })
      } else {
        await db.RecruitAttributesValue.create({ attributeId, value: v.value, isDefault: v.isDefault }, { transaction: t })
      }
    }
    await t.commit()
    return true
  } catch (error) {
    await t.rollback()
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const getValuesByAttributeIds = async (attributeIds) => {
  try {
    const values = await db.RecruitAttributesValue.findAll({
      where: { attributeId: { [Op.in]: attributeIds } },
      order: [['id', 'ASC']]
    })
    const result = {}
    for (const v of values) {
      if (!result[v.attributeId]) result[v.attributeId] = []
      result[v.attributeId].push(v)
    }
    return result
  } catch (error) {
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const deleteAllValuesByAttributeId = async (attributeId) => {
  try {
    return await db.RecruitAttributesValue.destroy({ where: { attributeId } })
  } catch (error) {
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const countValuesByAttributeId = async (attributeId) => {
  try {
    return await db.RecruitAttributesValue.count({ where: { attributeId } })
  } catch (error) {
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const setDefaultValueForAttribute = async (attributeId, valueId) => {
  const t = await db.sequelize.transaction()
  try {
    await db.RecruitAttributesValue.update({ isDefault: false }, { where: { attributeId }, transaction: t })
    await db.RecruitAttributesValue.update({ isDefault: true }, { where: { id: valueId, attributeId }, transaction: t })
    await t.commit()
    return true
  } catch (error) {
    await t.rollback()
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

module.exports = {
  createRecruitAttributeValue,
  getAllRecruitAttributeValues,
  getRecruitAttributeValueById,
  updateRecruitAttributeValue,
  deleteRecruitAttributeValue,
  getValuesByAttributeId,
  getDefaultValueByAttributeId,
  checkDuplicateValueInAttribute,
  bulkCreateOrUpdateValues,
  getValuesByAttributeIds,
  deleteAllValuesByAttributeId,
  countValuesByAttributeId,
  setDefaultValueForAttribute
}
