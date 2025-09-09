const { STATUS_CODE } = require('../../../constants')
const ServiceException = require('../../../exceptions/ServiceException')
const db = require('../models')

const createBrand = async ({ categoryIds, name, description, imageUrl, iconUrl, createdBy }) => {
  try {
    const brand = await db.Brand.create({ name, description, imageUrl, iconUrl: iconUrl || null, createdBy })

    if (categoryIds && categoryIds.length > 0) {
      await brand.setCategories(categoryIds)
    }

    return brand
  } catch (e) {
    throw new ServiceException(e.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const getAllBrands = async ({ page = 1, limit = 9999, categoryId }) => {
  try {
    let conditions = {}

    if (categoryId) {
      conditions.id = categoryId
    }

    const offset = (page - 1) * limit

    const { count, rows: brands } = await db.Brand.findAndCountAll({
      attributes: {
        exclude: ['deletedAt'],
        include: [
          [
            db.sequelize.literal(`
              (
                SELECT COUNT(*)
                FROM \`Products\` AS p
                WHERE p.\`brandId\` = \`Brand\`.\`id\`
              )
            `),
            'productCount'
          ]
        ]
      },
      include: [{ model: db.Category, as: 'categories', where: conditions, attributes: ['id', 'name'], required: false }],
      limit: limit,
      offset: offset,
      distinct: true,
      order: [['id', 'ASC']]
    })

    return { totalItems: count, brands: brands, totalPages: Math.ceil(count / limit), currentPage: page }
  } catch (e) {
    throw new ServiceException(e.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const getBrandById = async ({ id }) => {
  try {
    return await db.Brand.findOne({
      where: { id },
      include: [{ model: db.Category, as: 'categories', attributes: ['id', 'name'] }]
    })
  } catch (e) {
    throw new ServiceException(e.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const updateBrand = async ({ id, categoryIds, name, description, imageUrl, iconUrl = null, updatedBy }) => {
  const brand = await db.Brand.findOne({ where: { id } })

  try {
    await brand.update({ name, description, imageUrl, iconUrl, updatedBy })

    if (categoryIds) {
      await brand.setCategories(categoryIds)
    }

    const updatedCategory = await db.Brand.findByPk(id)
    return { success: true, data: updatedCategory }
  } catch (e) {
    throw new ServiceException(e.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const deleteBrand = async ({ id, updatedBy }) => {
  const brand = await db.Brand.findOne({ where: { id } })

  if (!brand) return null

  try {
    await brand.update({ updatedBy })
    await brand.destroy()

    return brand
  } catch (e) {
    throw new ServiceException(e.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

module.exports = { createBrand, getAllBrands, getBrandById, updateBrand, deleteBrand }
