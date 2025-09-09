const { Op } = require('sequelize')
const db = require('../../../models')
const { STATUS_CODE } = require('../../../constants')
const ServiceException = require('../../../exceptions/ServiceException')

const createCandidateAttributesValue = async (data) => {
  try {
    return await db.CandidateAttributesValue.create(data)
  } catch (err) {
    throw new ServiceException(err.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const findAllCandidateAttributesValues = async () => {
  try {
    return await db.CandidateAttributesValue.findAll({
      include: [{ model: db.CandidateAttribute, as: 'attribute' }],
      order: [['id', 'ASC']]
    })
  } catch (err) {
    throw new ServiceException(err.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const findCandidateAttributesValueById = async (id) => {
  try {
    const data = await db.CandidateAttributesValue.findByPk(id, {
      include: [{ model: db.CandidateAttribute, as: 'attribute' }]
    })
    if (!data) throw new ServiceException('Candidate Attribute Value not found', STATUS_CODE.NOT_FOUND)
    return data
  } catch (err) {
    throw new ServiceException(err.message, err.status || STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const updateCandidateAttributesValue = async (id, data) => {
  try {
    const item = await db.CandidateAttributesValue.findByPk(id)
    if (!item) throw new ServiceException('Candidate Attribute Value not found', STATUS_CODE.NOT_FOUND)
    await item.update(data)
    return item
  } catch (err) {
    throw new ServiceException(err.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const deleteCandidateAttributesValue = async (id) => {
  try {
    const item = await db.CandidateAttributesValue.findByPk(id)
    if (!item) throw new ServiceException('Candidate Attribute Value not found', STATUS_CODE.NOT_FOUND)
    await item.destroy()
    return true
  } catch (err) {
    throw new ServiceException(err.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const getValuesByAttributeId = async (attributeId) => {
  try {
    return await db.CandidateAttributesValue.findAll({
      where: { attributeId },
      order: [['id', 'ASC']]
    })
  } catch (err) {
    throw new ServiceException(err.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const getDefaultValueByAttributeId = async (attributeId) => {
  try {
    return await db.CandidateAttributesValue.findOne({
      where: { attributeId, isDefault: true }
    })
  } catch (err) {
    throw new ServiceException(err.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const setDefaultValueForAttribute = async (attributeId, valueId) => {
  const t = await db.sequelize.transaction()
  try {
    await db.CandidateAttributesValue.update({ isDefault: false }, { where: { attributeId }, transaction: t })
    await db.CandidateAttributesValue.update({ isDefault: true }, { where: { id: valueId, attributeId }, transaction: t })
    await t.commit()
    return true
  } catch (err) {
    await t.rollback()
    throw new ServiceException(err.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const checkDuplicateValueInAttribute = async (attributeId, value, excludeId = null) => {
  try {
    const where = { attributeId, value }
    if (excludeId) where.id = { [Op.ne]: excludeId }
    const exist = await db.CandidateAttributesValue.findOne({ where })
    return !!exist
  } catch (err) {
    throw new ServiceException(err.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const deleteAllValuesByAttributeId = async (attributeId) => {
  try {
    await db.CandidateAttributesValue.destroy({ where: { attributeId } })
    return true
  } catch (err) {
    throw new ServiceException(err.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const bulkCreateOrUpdateValues = async (attributeId, values = []) => {
  const t = await db.sequelize.transaction()
  try {
    for (const v of values) {
      if (v.id) {
        await db.CandidateAttributesValue.update({ value: v.value, isDefault: v.isDefault }, { where: { id: v.id, attributeId }, transaction: t })
      } else {
        await db.CandidateAttributesValue.create({ attributeId, value: v.value, isDefault: v.isDefault }, { transaction: t })
      }
    }
    await t.commit()
    return true
  } catch (err) {
    await t.rollback()
    throw new ServiceException(err.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const countValuesByAttributeId = async (attributeId) => {
  try {
    return await db.CandidateAttributesValue.count({ where: { attributeId } })
  } catch (err) {
    throw new ServiceException(err.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const getValuesByAttributeIds = async (attributeIds = []) => {
  try {
    return await db.CandidateAttributesValue.findAll({
      where: { attributeId: { [Op.in]: attributeIds } },
      order: [
        ['attributeId', 'ASC'],
        ['id', 'ASC']
      ]
    })
  } catch (err) {
    throw new ServiceException(err.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

module.exports = {
  createCandidateAttributesValue,
  findAllCandidateAttributesValues,
  findCandidateAttributesValueById,
  updateCandidateAttributesValue,
  deleteCandidateAttributesValue,
  getValuesByAttributeId,
  getDefaultValueByAttributeId,
  setDefaultValueForAttribute,
  checkDuplicateValueInAttribute,
  deleteAllValuesByAttributeId,
  bulkCreateOrUpdateValues,
  countValuesByAttributeId,
  getValuesByAttributeIds
}
