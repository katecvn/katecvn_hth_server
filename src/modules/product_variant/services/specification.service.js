const { Op } = require('sequelize')
const { STATUS_CODE } = require('../../../constants')
const { message } = require('../../../constants/message')
const ServiceException = require('../../../exceptions/ServiceException')
const db = require('../../../models')

const createSpecificationGroup = async (data) => {
  const { name, position, creator } = data

  try {
    return await db.SpecificationGroup.create({
      name,
      position: position || 0,
      createdBy: creator
    })
  } catch (error) {
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const updateSpecificationGroup = async (id, data) => {
  const { name, position, updater } = data
  const group = await db.SpecificationGroup.findByPk(id)
  if (!group) {
    throw new ServiceException({ id: message.notExist }, STATUS_CODE.NOT_FOUND)
  }

  try {
    await group.update({ name, position, updatedBy: updater })
    return true
  } catch (error) {
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const getSpecificationGroups = async ({ page = 1, limit = 9999, keyword = null }) => {
  const offset = (parseInt(page) - 1) * parseInt(limit)
  const where = {}

  if (keyword) {
    where.name = { [Op.like]: `%${keyword}%` }
  }

  const { count, rows } = await db.SpecificationGroup.findAndCountAll({
    where,
    offset,
    limit,
    distinct: true,
    order: [
      ['position', 'ASC'],
      ['createdAt', 'DESC']
    ],
    attributes: { exclude: ['deletedAt'] }
  })

  return {
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: parseInt(page),
    groups: rows
  }
}

const getSpecificationGroupById = async (id) => {
  const group = await db.SpecificationGroup.findByPk(id, { attributes: { exclude: ['deletedAt'] } })

  if (!group) {
    throw new ServiceException({ id: message.notExist }, STATUS_CODE.NOT_FOUND)
  }

  return group
}

const deleteSpecificationGroup = async (id) => {
  const group = await db.SpecificationGroup.findByPk(id)
  if (!group) {
    throw new ServiceException({ id: message.notExist }, STATUS_CODE.NOT_FOUND)
  }

  const isUsedGroup = await db.Specification.findOne({
    where: {
      groupId: id
    }
  })

  if (isUsedGroup) {
    throw new ServiceException({ id: message.isUsed }, STATUS_CODE.BAD_REQUEST)
  }

  try {
    await group.destroy()
    return true
  } catch (error) {
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const createSpecification = async (data) => {
  const { groupId, name, isRequired, creator } = data

  const isExistingGroup = await db.SpecificationGroup.findByPk(groupId)

  if (!isExistingGroup) {
    throw new ServiceException({ groupId: message.notExist }, STATUS_CODE.UNPROCESSABLE_ENTITY)
  }

  try {
    return await db.Specification.create({ groupId, name, isRequired, createdBy: creator })
  } catch (error) {
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const updateSpecification = async (id, data) => {
  const { groupId, name, isRequired, updater } = data

  const spec = await db.Specification.findByPk(id)
  if (!spec) {
    throw new ServiceException({ id: message.notExist }, STATUS_CODE.NOT_FOUND)
  }

  const isExistingGroup = await db.SpecificationGroup.findByPk(groupId)

  if (!isExistingGroup) {
    throw new ServiceException({ groupId: message.notExist }, STATUS_CODE.UNPROCESSABLE_ENTITY)
  }

  try {
    await spec.update({
      groupId,
      name,
      isRequired: isRequired || false,
      updatedBy: updater
    })
    return true
  } catch (error) {
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const getSpecifications = async ({ page = 1, limit = 9999, keyword = null }) => {
  const offset = (parseInt(page) - 1) * parseInt(limit)
  const where = {}

  if (keyword) {
    where.name = { [Op.like]: `%${keyword}%` }
  }

  const { count, rows } = await db.Specification.findAndCountAll({
    where,
    offset,
    limit,
    distinct: true,
    include: [
      {
        model: db.SpecificationGroup,
        as: 'group',
        required: false
      }
    ],
    order: [['createdAt', 'DESC']]
  })

  return {
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: parseInt(page),
    specifications: rows
  }
}

const getSpecificationById = async (id) => {
  const spec = await db.Specification.findByPk(id, {
    include: [{ model: db.SpecificationGroup, as: 'group' }]
  })

  if (!spec) {
    throw new ServiceException({ id: message.notExist }, STATUS_CODE.NOT_FOUND)
  }

  return spec
}

const deleteSpecification = async (id) => {
  const spec = await db.Specification.findByPk(id)
  if (!spec) {
    throw new ServiceException({ id: message.notExist }, STATUS_CODE.NOT_FOUND)
  }

  const transaction = await db.sequelize.transaction()
  try {
    await spec.destroy({ transaction })
    await db.CategorySpecification.destroy({
      where: {
        specificationId: id
      },
      transaction
    })
    await db.ProductSpecification.destroy({
      where: {
        specificationId: id
      },
      transaction
    })

    await transaction.commit()
    return true
  } catch (error) {
    await transaction.rollback()
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

module.exports = {
  createSpecificationGroup,
  updateSpecificationGroup,
  getSpecificationGroups,
  getSpecificationGroupById,
  deleteSpecificationGroup,
  createSpecification,
  updateSpecification,
  getSpecifications,
  getSpecificationById,
  deleteSpecification
}
