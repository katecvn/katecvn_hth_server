const { STATUS_CODE } = require('../constants')
const ServiceException = require('../exceptions/ServiceException')
const db = require('../models')

const createPage = async (data) => {
  return await db.Page.create(data)
}

const updatePage = async (id, data) => {
  return await db.Page.update(data, { where: { id } })
}

const deletePage = async (id) => {
  return await db.Page.destroy({ where: { id } })
}

const getPageById = async ({ id }) => {
  return await db.Page.findByPk(id, { include: [{ model: db.Page, as: 'children' }] })
}

const getAllPages = async () => {
  return await db.Page.findAll({ where: { parentId: null }, include: [{ model: db.Page, as: 'children' }] })
}

const getPageBySlug = async ({ slug, notInIds = [] }) => {
  try {
    const whereClause = { slug }

    if (notInIds.length) {
      whereClause.id = { [db.Sequelize.Op.notIn]: notInIds }
    }

    const page = await db.Page.findOne({
      where: whereClause,
      include: [{ model: db.Page, as: 'children', include: [{ model: db.Page, as: 'children' }] }]
    })

    return page
  } catch (error) {
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

module.exports = { createPage, updatePage, deletePage, getPageById, getAllPages, getPageBySlug }
