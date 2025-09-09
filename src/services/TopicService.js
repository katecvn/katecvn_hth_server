const db = require('../models')
const NotFoundException = require('../exceptions/NotFoundException')
const createSlug = require('../utils/CreateSlug')
const ServiceException = require('../exceptions/ServiceException')
const { Op } = require('sequelize')
const BASE_STATUS = require('../constants/status')

const findTopic = async (id) => {
  const topic = await db.Topic.findByPk(id)
  if (!topic) {
    throw new NotFoundException('Không tìm thấy chủ đề.')
  }
  return topic
}

const getTopics = async ({ page, limit, ids, keyword, topicIds }, status = null) => {
  const offset = (page - 1) * limit
  const conditions = {}
  if (ids) {
    conditions.id = { [db.Sequelize.Op.in]: ids.split(',').map(Number) }
  }

  if (keyword) {
    conditions[db.Sequelize.Op.or] = [{ name: { [db.Sequelize.Op.like]: `%${keyword}%` } }]
  }

  if (status) {
    conditions.status = BASE_STATUS.ACTIVE
  }

  const { count, rows: topics } = await db.Topic.findAndCountAll({
    limit,
    offset,
    where: conditions,
    attributes: ['id', 'name', 'slug', 'parent_id', 'status']
  })

  return {
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    topics
  }
}

const getTopicById = async (id) => {
  return await db.Topic.findByPk(id, {
    attributes: ['id', 'name', 'slug', 'parent_id']
  })
}

const checkExistingSlug = async (slug, id = null) => {
  const conditions = {
    slug: slug
  }
  if (id) {
    conditions.id = { [Op.ne]: id }
  }
  return db.Topic.findOne({
    where: conditions
  })
}

const createTopic = async (data) => {
  const { name, slug, parentId, status } = data
  const transaction = await db.sequelize.transaction()
  try {
    const topic = await db.Topic.create(
      {
        name,
        slug,
        parent_id: parentId,
        status
      },
      { transaction }
    )

    await transaction.commit()
    return topic
  } catch (error) {
    await transaction.rollback()
    throw new Error(error.message)
  }
}

const updateTopic = async (id, data) => {
  const topic = await findTopic(id)
  const { name, slug, status, parentId } = data

  const transaction = await db.sequelize.transaction()
  try {
    await topic.update({
      name,
      slug,
      status,
      parent_id: parentId
    })
    await transaction.commit()
    return true
  } catch (error) {
    await transaction.rollback()
    throw new Error(error.message)
  }
}

const deleteTopic = async (id) => {
  const topic = await findTopic(id)

  try {
    await topic.destroy()
    return true
  } catch (error) {
    throw new Error(error.message)
  }
}

const updateTopicStatus = async (data) => {
  const { id, status } = data
  const topic = await findTopic(id)

  const transaction = await db.sequelize.transaction()
  try {
    await topic.update(
      {
        status
      },
      { transaction }
    )
    await transaction.commit()
    return true
  } catch (error) {
    await transaction.rollback()
    throw new Error(error.message)
  }
}

module.exports = {
  findTopic,
  getTopics,
  getTopicById,
  createTopic,
  updateTopic,
  deleteTopic,
  updateTopicStatus,
  checkExistingSlug
}
