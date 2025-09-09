const { Op } = require('sequelize')
const { STATUS_CODE } = require('../../../constants')
const { message } = require('../../../constants/message')
const ServiceException = require('../../../exceptions/ServiceException')
const db = require('../../../models')

const getAllCategories = async ({ page = 1, limit = 9999 }) => {
  const offset = (page - 1) * limit

  try {
    const { count, rows: categories } = await db.Category.findAndCountAll({
      include: [
        {
          model: db.Category,
          as: 'parent',
          attributes: ['id', 'name', 'slug', 'thumbnail', 'iconUrl'],
          required: false
        },
        {
          model: db.Category,
          as: 'subCategories',
          attributes: ['id', 'name', 'slug', 'thumbnail', 'iconUrl'],
          required: false
        },
        {
          model: db.Specification,
          as: 'specifications',
          required: false,
          attributes: ['id', 'name']
        }
      ],
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
      order: [['createdAt', 'DESC']],
      subQuery: false,
      distinct: true
    })

    return {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      categories
    }
  } catch (e) {
    throw new ServiceException(e.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const getCategoryById = async ({ id }) => {
  try {
    return await db.Category.findOne({
      where: { id },
      include: {
        model: db.ProductAttribute,
        as: 'productAttributes',
        required: false
      }
    })
  } catch (e) {
    throw new ServiceException(e.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const createCategory = async (data) => {
  const { name, slug, parentId, level, thumbnail, iconUrl, createdBy, specifications = [] } = data

  if (specifications.length) {
    for (const spec of specifications) {
      const isExistSpec = await db.Specification.findByPk(spec.id)
      if (!isExistSpec) {
        throw new ServiceException({ specifications: `${spec.id} ${message.notExist}` })
      }
    }
  }

  const transaction = await db.sequelize.transaction()
  try {
    const category = await db.Category.create(
      {
        name,
        slug,
        parentId: parentId || null,
        level: level || 0,
        thumbnail,
        iconUrl: iconUrl || null,
        createdBy
      },
      { transaction }
    )

    if (specifications.length) {
      for (const spec of specifications) {
        await db.CategorySpecification.create(
          {
            categoryId: category.id,
            specificationId: spec.id,
            position: spec.position || 0
          },
          { transaction }
        )
      }
    }

    await transaction.commit()
    return category
  } catch (e) {
    await transaction.rollback()
    throw new ServiceException(e.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const updateCategory = async (data) => {
  const { id, name, slug, parentId, level, thumbnail, iconUrl, updatedBy, specifications = [] } = data

  const category = await db.Category.findOne({ where: { id } })
  if (!category) return null

  if (specifications.length) {
    for (const spec of specifications) {
      const isExistSpec = await db.Specification.findByPk(spec.id)
      if (!isExistSpec) {
        throw new ServiceException({ specifications: `${spec.id} ${message.notExist}` })
      }
    }
  }

  const transaction = await db.sequelize.transaction()
  try {
    const updatedCategory = await category.update(
      { name, slug, parentId: parentId || null, level: level || 0, thumbnail, iconUrl: iconUrl || null, updatedBy },
      { transaction }
    )

    await db.CategorySpecification.destroy({ where: { categoryId: id }, transaction })

    if (specifications.length) {
      for (const spec of specifications) {
        await db.CategorySpecification.create(
          {
            categoryId: id,
            specificationId: spec.id,
            position: spec.position || 0
          },
          { transaction }
        )
      }
    }
    await transaction.commit()
    return updatedCategory
  } catch (e) {
    await transaction.rollback()
    throw new ServiceException(e.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const deleteCategory = async (id) => {
  const category = await db.Category.findByPk(id)
  if (!category) return null

  const transaction = await db.sequelize.transaction()
  try {
    await category.destroy({ transaction })
    await db.CategorySpecification.destroy({
      where: { categoryId: id },
      transaction
    })

    await transaction.commit()
    return category
  } catch (e) {
    await transaction.rollback()
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

const getCategoryBySlug = async ({ slug, notInIds = [] }) => {
  const where = { slug }

  if (notInIds.length) {
    where.id = { [Op.notIn]: notInIds }
  }

  const category = await db.Category.findOne({
    where,
    include: [
      {
        model: db.ProductAttribute,
        as: 'productAttributes',
        required: false
      },
      {
        model: db.Specification,
        as: 'specifications',
        required: false,
        attributes: ['id', 'name']
      }
    ],
    attributes: { exclude: ['deletedAt'] }
  })

  if (!category) {
    throw new ServiceException({ slug: message.notExist }, STATUS_CODE.NOT_FOUND)
  }
  return category
}

const getCategoryByName = async ({ name, notInIds = [] }) => {
  const where = { name }

  if (notInIds.length) {
    where.id = { [Op.notIn]: notInIds }
  }

  const category = await db.Category.findOne({ where })

  if (!category) {
    throw new ServiceException({ name: message.notExist }, STATUS_CODE.NOT_FOUND)
  }

  return category
}

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategoriesWithChildren,
  getCategoryBySlug,
  getCategoryByName
}
