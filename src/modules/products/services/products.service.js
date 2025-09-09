const { Op } = require('sequelize')
const { STATUS_CODE } = require('../../../constants')
const ServiceException = require('../../../exceptions/ServiceException')
const db = require('../../../models')

const create = async (data) => {
  try {
    return await db.Products.create(data)
  } catch (e) {
    throw new ServiceException(e.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const findAll = async ({ page = 1, limit = 10, search, productGroupId }) => {
  try {
    const offset = (page - 1) * limit

    const where = {}

    if (search) {
      where[Op.or] = [{ name: { [Op.like]: `%${search}%` } }, { sku: { [Op.like]: `%${search}%` } }]
    }

    if (productGroupId) {
      where.productGroupId = productGroupId
    }

    const { count, rows: products } = await db.Products.findAndCountAll({
      where,
      include: [
        {
          model: db.ProductGroups,
          as: 'productGroup'
        },
        {
          model: db.ProductOptions,
          as: 'options',
          include: [
            {
              model: db.ProductOptionValues,
              as: 'values'
            }
          ]
        }
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    })

    return {
      totalItems: count,
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    }
  } catch (e) {
    throw new ServiceException(e.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const findOne = async (id) => {
  try {
    const product = await db.Products.findByPk(id, {
      include: [
        {
          model: db.ProductGroups,
          as: 'productGroup'
        },
        {
          model: db.ProductOptions,
          as: 'options',
          include: [
            {
              model: db.ProductOptionValues,
              as: 'values'
            }
          ]
        }
      ]
    })
    if (!product) {
      throw new ServiceException('Product not found', STATUS_CODE.NOT_FOUND)
    }
    return product
  } catch (e) {
    throw new ServiceException(e.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const update = async (id, data) => {
  try {
    const product = await db.Products.findByPk(id)
    if (!product) {
      throw new ServiceException('Product not found', STATUS_CODE.NOT_FOUND)
    }
    await product.update(data)
    return product
  } catch (e) {
    throw new ServiceException(e.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const remove = async (id) => {
  try {
    const product = await db.Products.findByPk(id)
    if (!product) {
      throw new ServiceException('Product not found', STATUS_CODE.NOT_FOUND)
    }
    await product.destroy()
    return true
  } catch (e) {
    throw new ServiceException(e.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

module.exports = {
  create,
  findAll,
  findOne,
  update,
  remove
}
