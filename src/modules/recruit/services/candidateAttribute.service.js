const { Op } = require('sequelize')
const db = require('../../../models')
const ServiceException = require('../../../exceptions/ServiceException')
const { STATUS_CODE } = require('../../../constants')

const createCandidateAttribute = async ({
  name,
  code,
  inputType,
  defaultValue,
  isRequired,
  displayPriority,
  minLength,
  maxLength,
  description,
  icon,
  createdBy
}) => {
  try {
    return await db.CandidateAttribute.create({
      name,
      code,
      inputType,
      defaultValue,
      isRequired,
      displayPriority,
      minLength,
      maxLength,
      description,
      icon,
      createdBy
    })
  } catch (error) {
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const getAllCandidateAttributes = async ({ page = 1, limit = 10, search }) => {
  try {
    const offset = (page - 1) * limit
    const where = {}

    if (search) {
      where[Op.or] = [{ name: { [Op.like]: `%${search}%` } }, { code: { [Op.like]: `%${search}%` } }]
    }

    const { count, rows } = await db.CandidateAttribute.findAndCountAll({
      where,
      include: [
        {
          model: db.CandidateAttributesValue,
          as: 'values'
        }
      ],
      offset,
      limit,
      order: [['displayPriority', 'ASC']]
    })

    return {
      totalItems: count,
      data: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page)
    }
  } catch (error) {
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const getCandidateAttributeById = async (id) => {
  try {
    const attribute = await db.CandidateAttribute.findByPk(id, {
      include: [
        {
          model: db.CandidateAttributesValue,
          as: 'values'
        }
      ]
    })
    if (!attribute) {
      throw new ServiceException('CandidateAttribute not found', STATUS_CODE.NOT_FOUND)
    }
    return attribute
  } catch (error) {
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const updateCandidateAttribute = async (
  id,
  { name, code, inputType, defaultValue, isRequired, displayPriority, minLength, maxLength, description, icon, updatedBy }
) => {
  try {
    const attribute = await db.CandidateAttribute.findByPk(id)
    if (!attribute) {
      throw new ServiceException('CandidateAttribute not found', STATUS_CODE.NOT_FOUND)
    }

    await attribute.update({
      name,
      code,
      inputType,
      defaultValue,
      isRequired,
      displayPriority,
      minLength,
      maxLength,
      description,
      icon,
      updatedBy
    })

    return attribute
  } catch (error) {
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const deleteCandidateAttribute = async (id) => {
  try {
    const attribute = await db.CandidateAttribute.findByPk(id)
    if (!attribute) {
      throw new ServiceException('CandidateAttribute not found', STATUS_CODE.NOT_FOUND)
    }
    await attribute.destroy()
    return true
  } catch (error) {
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const updateOneDisplayPriority = async (id, displayPriority) => {
  try {
    const attr = await db.CandidateAttribute.findByPk(id)
    if (!attr) throw new ServiceException('CandidateAttribute not found', STATUS_CODE.NOT_FOUND)
    await attr.update({ displayPriority })
    return attr
  } catch (error) {
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const bulkUpdateDisplayPriority = async (list) => {
  const t = await db.sequelize.transaction()
  try {
    for (const item of list) {
      await db.CandidateAttribute.update({ displayPriority: item.displayPriority }, { where: { id: item.id }, transaction: t })
    }
    await t.commit()
    return true
  } catch (error) {
    await t.rollback()
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const checkCodeExists = async (code, excludeId = null) => {
  try {
    const where = { code }
    if (excludeId) where.id = { [Op.ne]: excludeId }
    const attr = await db.CandidateAttribute.findOne({ where })
    return !!attr
  } catch (error) {
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const getAttributeWithValues = async (id) => {
  try {
    return await db.CandidateAttribute.findByPk(id, {
      include: [{ model: db.CandidateAttributesValue, as: 'values' }]
    })
  } catch (error) {
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const searchAdvanced = async ({ inputType, isRequired }) => {
  try {
    const where = {}
    if (inputType) where.inputType = inputType
    if (isRequired !== undefined) where.isRequired = isRequired

    return await db.CandidateAttribute.findAll({
      where,
      order: [['displayPriority', 'ASC']]
    })
  } catch (error) {
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const getAllAttributesSorted = async () => {
  try {
    return await db.CandidateAttribute.findAll({
      include: [{ model: db.CandidateAttributesValue, as: 'values', required: false }],
      order: [['displayPriority', 'ASC']]
    })
  } catch (error) {
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const getRequiredAttributes = async () => {
  try {
    return await db.CandidateAttribute.findAll({
      where: { isRequired: true },
      order: [['displayPriority', 'ASC']]
    })
  } catch (error) {
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const findByCode = async (code) => {
  try {
    return await db.CandidateAttribute.findOne({ where: { code } })
  } catch (error) {
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

module.exports = {
  createCandidateAttribute,
  getAllCandidateAttributes,
  getCandidateAttributeById,
  updateCandidateAttribute,
  deleteCandidateAttribute,
  updateOneDisplayPriority,
  bulkUpdateDisplayPriority,
  checkCodeExists,
  getAttributeWithValues,
  searchAdvanced,
  getAllAttributesSorted,
  getRequiredAttributes,
  findByCode
}
