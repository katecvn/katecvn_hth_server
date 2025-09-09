const db = require('../models/index')
const ServiceException = require('../../../exceptions/ServiceException')
const { STATUS_CODE } = require('../../../constants')
const { Op } = require('sequelize')

const create = async (data) => {
  const { name, slug, description, seoTitle, seoDescription, optionIds } = data
  const transaction = await db.sequelize.transaction()
  try {
    const productGroup = await db.ProductGroup.create(
      {
        name,
        slug,
        description,
        seoTitle,
        seoDescription
      },
      { transaction }
    )

    for (const optionId of optionIds) {
      await db.ProductGroupHasOption.create(
        {
          groupId: productGroup.id,
          optionId: optionId
        },
        { transaction }
      )
    }
    await transaction.commit()
    return productGroup
  } catch (e) {
    await transaction.rollback()
    throw new ServiceException(e.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const findAll = async ({ page = 1, limit = 10, search }) => {
  const offset = (page - 1) * limit
  const where = {}

  if (search) {
    where.name = {
      [Op.like]: `%${search}%`
    }
  }

  const { count, rows } = await db.ProductGroup.findAndCountAll({
    where,
    include: [
      {
        model: db.ProductOption,
        as: 'productGroupOptions'
      }
    ],
    limit,
    offset,
    order: [['createdAt', 'DESC']]
  })

  return {
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    items: rows
  }
}

const findOne = async (id) => {
  return await db.ProductGroup.findOne({
    where: { id },
    include: [
      {
        model: db.Product,
        as: 'products',
        attributes: { exclude: ['deletedAt'] },
        include: [
          {
            model: db.ProductOptionMapping,
            as: 'optionMappings'
          },
          {
            model: db.ProductAttributeValue,
            as: 'attributeValues'
          }
        ]
      },
      {
        model: db.ProductOption,
        as: 'productOptions'
      }
    ]
  })
}

const update = async (id, data) => {
  const { name, slug, description, seoTitle, seoDescription, optionIds } = data
  const productGroup = await db.ProductGroup.findByPk(id)
  if (!productGroup) throw new ServiceException({ id: 'Nhóm không tồn tại' }, STATUS_CODE.NOT_FOUND)

  const transaction = await db.sequelize.transaction()
  try {
    await productGroup.update({ name, slug, description, seoTitle, seoDescription }, { transaction })

    if (optionIds !== undefined) {
      const _optionIds = Array.isArray(optionIds) ? optionIds : []

      // Xóa hết option cũ
      await db.ProductGroupHasOption.destroy({
        where: { groupId: id },
        transaction
      })

      // Tạo lại option mới (nếu có)
      if (_optionIds.length > 0) {
        const mappings = _optionIds.map((optionId) => ({
          groupId: id,
          optionId
        }))
        await db.ProductGroupHasOption.bulkCreate(mappings, { transaction })
      }

      // Xóa ProductOptionMapping không còn hợp lệ
      const products = await db.Product.findAll({
        where: { productGroupId: id }
      })
      const productIds = products.map((product) => product.id)

      if (productIds.length > 0) {
        await db.ProductOptionMapping.destroy({
          where: {
            productId: { [Op.in]: productIds },
            optionId: { [Op.notIn]: _optionIds }
          },
          transaction
        })
      }
    }

    await transaction.commit()
    return { success: true }
  } catch (e) {
    await transaction.rollback()
    throw new ServiceException(e.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const remove = async (id) => {
  const productGroup = await db.ProductGroup.findByPk(id)
  if (!productGroup) {
    throw new Error('Product group not found')
  }
  const transaction = await db.sequelize.transaction()
  try {
    await productGroup.destroy({ transaction })
    await transaction.commit()
    return true
  } catch (e) {
    await transaction.rollback()
    throw new ServiceException(e.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const getProductGroupBySlug = async ({ slug, notInIds }) => {
  const conditions = {}

  if (notInIds) conditions.id = { [Op.notIn]: notInIds }

  if (slug) conditions.slug = slug

  return await db.ProductGroup.findOne({ where: conditions })
}

const getProductGroupById = async ({ id }) => {
  return await db.ProductGroup.findOne({ where: { id } })
}

module.exports = {
  create,
  findAll,
  findOne,
  update,
  remove,
  getProductGroupBySlug,
  getProductGroupById
}
