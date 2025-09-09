const { Op } = require('sequelize')
const { STATUS_CODE } = require('../../../constants')
const { message } = require('../../../constants/message')
const ServiceException = require('../../../exceptions/ServiceException')
const db = require('../../../models')

const createAttribute = async (data) => {
  const { name, code, level, inputType, valueType, creator, values = [] } = data

  const isExistedCode = await db.Attribute.findOne({ where: { code } })
  if (isExistedCode) throw new ServiceException({ code: message.isExisted }, STATUS_CODE.UNPROCESSABLE_ENTITY)

  const transaction = await db.sequelize.transaction()
  try {
    const attribute = await db.Attribute.create(
      {
        name,
        code,
        level: level || 0,
        inputType,
        valueType,
        createdBy: creator
      },
      { transaction }
    )

    if (values.length) {
      for (const value of values) {
        await db.AttributeValue.create(
          {
            attributeId: attribute.id,
            value
          },
          { transaction }
        )
      }
    }

    await transaction.commit()
    return attribute
  } catch (error) {
    await transaction.rollback()
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const updateAttribute = async (id, data) => {
  const { name, code, level, inputType, valueType, updater, values = [] } = data
  const existingAttribute = await db.Attribute.findByPk(id)

  if (!existingAttribute) {
    throw new ServiceException({ id: message.notExist }, STATUS_CODE.NOT_FOUND)
  }

  const isExistedCode = await db.Attribute.findOne({
    where: {
      id: { [Op.ne]: id },
      code
    }
  })

  if (isExistedCode) throw new ServiceException({ code: message.isExisted }, STATUS_CODE.UNPROCESSABLE_ENTITY)

  const currentAttributeValues = await db.AttributeValue.findAll({
    where: { attributeId: id }
  })

  const currentAttributeValuesMap = currentAttributeValues.map((item) => item.value)

  const valuesToDeleteMap = currentAttributeValuesMap.filter((item) => !values.includes(item))
  const valuesToCreateMap = values.filter((item) => !currentAttributeValuesMap.includes(item))

  const transaction = await db.sequelize.transaction()
  try {
    await existingAttribute.update(
      {
        name,
        code,
        level: level || 0,
        inputType,
        valueType,
        updatedBy: updater
      },
      { transaction }
    )

    if (valuesToDeleteMap.length) {
      for (const valuesToDelete of valuesToDeleteMap) {
        const attributeValue = await db.AttributeValue.findOne({ where: { value: valuesToDelete } })
        const isUsedValue = await db.VariantAttributeAssignment.findOne({
          where: {
            attributeValueId: attributeValue.id
          }
        })
        if (isUsedValue) continue

        await db.AttributeValue.destroy({
          where: {
            attributeId: id,
            value: valuesToDelete
          },
          transaction
        })
      }
    }

    for (const valueToCreate of valuesToCreateMap) {
      await db.AttributeValue.create(
        {
          attributeId: id,
          value: valueToCreate
        },
        { transaction }
      )
    }

    await transaction.commit()
    return true
  } catch (error) {
    await transaction.rollback()
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const getAttributes = async ({ page = 1, limit = 9999, keyword = null }) => {
  const offset = (parseInt(page) - 1) * parseInt(limit)
  const where = {}

  if (keyword) {
    where[Op.or] = [{ name: { [Op.like]: `%${keyword}%` } }, { code: { [Op.like]: `%${keyword}%` } }]
  }

  const { count, rows } = await db.Attribute.findAndCountAll({
    where,
    offset,
    limit,
    include: [
      {
        model: db.AttributeValue,
        as: 'values'
      }
    ],
    distinct: true,
    order: [['createdAt', 'DESC']],
    attributes: { exclude: ['deletedAt'] }
  })

  return {
    totalItems: count,
    totalPages: Math.ceil(count / parseInt(limit)),
    currentPage: page,
    attributes: rows
  }
}

const getAttributeById = async (id) => {
  const attribute = await db.Attribute.findByPk(id, {
    include: [
      {
        model: db.AttributeValue,
        as: 'values',
        required: false,
        order: [['id', 'ASC']],
        attributes: { exclude: ['attributeId'] }
      }
    ],
    attributes: { exclude: ['deletedAt'] }
  })

  if (!attribute) {
    throw new ServiceException({ id: message.notExist }, STATUS_CODE.NOT_FOUND)
  }

  return attribute
}

const deleteAttribute = async (id) => {
  const attribute = await db.Attribute.findByPk(id)

  if (!attribute) {
    throw new ServiceException({ id: message.notExist }, STATUS_CODE.NOT_FOUND)
  }

  const attributeValues = await db.AttributeValue.findAll({
    where: {
      attributeId: id
    }
  })

  for (const attributeValue of attributeValues) {
    const isUsedValue = await db.VariantAttributeAssignment.findOne({
      where: {
        attributeValueId: attributeValue.id
      }
    })
    if (isUsedValue) {
      throw new ServiceException({ id: 'Không thể xóa thuộc tính đang được sử dụng' }, STATUS_CODE.BAD_REQUEST)
    }
  }

  try {
    await attribute.destroy()
    return true
  } catch (error) {
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

module.exports = {
  createAttribute,
  updateAttribute,
  getAttributes,
  getAttributeById,
  deleteAttribute
}
