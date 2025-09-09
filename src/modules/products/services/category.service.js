const { STATUS_CODE } = require('../../../constants')
const ServiceException = require('../../../exceptions/ServiceException')
const db = require('../models')

const getAllCategories = async ({ page = 1, limit = 9999 }) => {
  const offset = (page - 1) * limit

  try {
    const { count, rows: categories } = await db.Category.findAndCountAll({
      where: {
        parentId: null
      },
      attributes: {
        exclude: ['deletedAt'],
        include: [
          [
            db.sequelize.literal(`
              (
                SELECT COUNT(*)
                FROM \`Products\` AS p
                WHERE p.\`categoryId\` = \`Category\`.\`id\`
                   OR p.\`categoryId\` IN (
                        SELECT id FROM \`Categories\` WHERE \`parentId\` = \`Category\`.\`id\`
                   )
              )
            `),
            'productCount'
          ]
        ]
      },
      limit,
      offset,
      subQuery: false,
      distinct: true
    })

    return {
      totalItems: count,
      categories,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    }
  } catch (e) {
    throw new ServiceException(e.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const getCategoryById = async ({ id }) => {
  try {
    return await db.Category.findByPk(id)
  } catch (e) {
    throw new ServiceException(e.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const createCategory = async ({ name, parentId, level, thumbnail, createdBy }) => {
  try {
    return await db.Category.create({ name, parentId, level, thumbnail, createdBy })
  } catch (e) {
    throw new ServiceException(e.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const updateCategory = async ({ id, name, parentId, level, thumbnail, updatedBy }) => {
  try {
    const category = await db.Category.findOne({ where: { id } })

    if (!category) return null

    await category.update({ name, parentId, level, thumbnail, updatedBy })

    return await db.Category.findByPk(id)
  } catch (e) {
    throw new ServiceException(e.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const deleteCategory = async (id) => {
  try {
    const category = await db.Category.findByPk(id)

    if (!category) return null

    await category.destroy()

    return category
  } catch (e) {
    throw new ServiceException(e.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const getAllCategoriesWithChildren = async () => {
  try {
    return await db.Category.findAll({
      where: { parentId: null },
      include: {
        model: db.Category,
        as: 'subCategories',
        require: false,
        include: { model: db.Category, as: 'subCategories' }
      }
    })
  } catch (e) {
    throw new ServiceException(e.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategoriesWithChildren
}
