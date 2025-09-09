const db = require('../../../models')
const { sequelize } = require('../../../models')
const { STATUS_CODE } = require('../../../constants')
const ServiceException = require('../../../exceptions/ServiceException')
const { Op, QueryTypes } = require('sequelize')

const createRecruitPost = async (data) => {
  try {
    return await db.RecruitPost.create(data)
  } catch (error) {
    throw error
  }
}

const getAllRecruitPosts = async (query) => {
  try {
    const page = parseInt(query.page, 10) || 1
    const limit = parseInt(query.limit, 10) || 10
    const offset = (page - 1) * limit

    const { count, rows } = await db.RecruitPost.findAndCountAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: db.RecruitAttributeAssignment,
          as: 'attributeAssignments',
          include: [
            { model: db.RecruitAttribute, as: 'attribute' },
            { model: db.RecruitAttributesValue, as: 'value' }
          ]
        }
      ],
      distinct: true
    })

    return {
      totalItems: count,
      posts: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    }
  } catch (error) {
    throw error
  }
}

const getRecruitPostById = async (id) => {
  try {
    const post = await db.RecruitPost.findByPk(id, {
      include: [
        {
          model: db.RecruitAttributeAssignment,
          as: 'attributeAssignments',
          include: ['attribute', 'value']
        },
        {
          model: db.RecruitCandidate,
          as: 'candidates'
        }
      ]
    })
    if (!post) throw new ServiceException('RecruitPost not found', STATUS_CODE.NOT_FOUND)
    return post
  } catch (error) {
    throw error
  }
}

const getRecruitPostBySlug = async (slug) => {
  try {
    const post = await db.RecruitPost.findOne({
      where: { slug },
      include: [
        {
          model: db.RecruitAttributeAssignment,
          as: 'attributeAssignments',
          include: ['attribute', 'value']
        },
        {
          model: db.RecruitCandidate,
          as: 'candidates'
        }
      ]
    })
    if (!post) throw new ServiceException('RecruitPost not found', STATUS_CODE.NOT_FOUND)
    return post
  } catch (error) {
    throw error
  }
}

const updateRecruitPost = async (id, data) => {
  try {
    const post = await db.RecruitPost.findByPk(id)
    if (!post) throw new ServiceException('RecruitPost not found', STATUS_CODE.NOT_FOUND)

    await post.update(data)
    return post
  } catch (error) {
    throw error
  }
}

const deleteRecruitPost = async (id) => {
  try {
    const post = await db.RecruitPost.findByPk(id)
    if (!post) throw new ServiceException('RecruitPost not found', STATUS_CODE.NOT_FOUND)

    await post.destroy()
    return true
  } catch (error) {
    throw error
  }
}

const getPublishedRecruitPosts = async (query) => {
  try {
    const page = parseInt(query.page, 10) || 1
    const limit = parseInt(query.limit, 10) || 10
    const offset = (page - 1) * limit

    const { count, rows } = await db.RecruitPost.findAndCountAll({
      where: { status: 'published' },
      limit,
      offset,
      order: [['deadline', 'ASC']],
      include: [
        {
          model: db.RecruitAttributeAssignment,
          as: 'attributeAssignments',
          include: ['attribute', 'value']
        }
      ],
      distinct: true
    })

    return {
      totalItems: count,
      posts: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    }
  } catch (error) {
    throw error
  }
}

const getDraftRecruitPosts = async (query) => {
  try {
    const page = parseInt(query.page, 10) || 1
    const limit = parseInt(query.limit, 10) || 10
    const offset = (page - 1) * limit

    const { count, rows } = await db.RecruitPost.findAndCountAll({
      where: { status: 'draft' },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: db.RecruitAttributeAssignment,
          as: 'attributeAssignments',
          include: ['attribute', 'value']
        }
      ],
      distinct: true
    })

    return {
      totalItems: count,
      posts: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    }
  } catch (error) {
    throw error
  }
}

const filterRecruitPosts = async (filters = {}, page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit

    const replacements = {}
    let whereClauses = []
    let attributeConditions = []

    if (filters.deadlineBefore) {
      whereClauses.push(`rp.deadline <= :deadlineBefore`)
      replacements.deadlineBefore = filters.deadlineBefore
    }

    if (filters.search) {
      const likeSearch = `%${filters.search}%`
      whereClauses.push(`(
        rp.title LIKE :search OR
        rp.jobDescription LIKE :search OR
        rp.jobRequirements LIKE :search OR
        rp.benefits LIKE :search OR
        rp.applyRequirements LIKE :search OR
        rp.contactInfo LIKE :search OR
        rp.applyAddress LIKE :search OR
        rp.applyEmail LIKE :search
      )`)
      replacements.search = likeSearch
    }

    const attributes = filters.attributes || []
    attributes.forEach((attr, index) => {
      const conds = [`raa.attributeId = :attrId${index}`]
      replacements[`attrId${index}`] = attr.attributeId

      if (attr.attributeValueId != null) {
        conds.push(`raa.attributeValueId = :attrValueId${index}`)
        replacements[`attrValueId${index}`] = attr.attributeValueId
      }

      if (attr.customValue != null && attr.customValue !== '') {
        conds.push(`raa.customValue = :customValue${index}`)
        replacements[`customValue${index}`] = attr.customValue
      }

      attributeConditions.push(`(${conds.join(' AND ')})`)
    })

    const whereSQL = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : ''
    const attrWhereSQL = attributeConditions.length ? `AND (${attributeConditions.join(' OR ')})` : ''
    const havingClause = attributes.length ? `HAVING COUNT(DISTINCT raa.attributeId) = ${attributes.length}` : ''

    const query = `
      SELECT rp.id
      FROM recruitposts rp
      JOIN recruitattributeassignments raa ON rp.id = raa.recruitPostId
      ${whereSQL}
      ${attrWhereSQL}
      GROUP BY rp.id
      ${havingClause}
      ORDER BY rp.createdAt DESC
      LIMIT :limit OFFSET :offset
    `

    replacements.limit = limit
    replacements.offset = offset

    const rawResults = await sequelize.query(query, {
      replacements,
      type: QueryTypes.SELECT
    })

    const postIds = rawResults.map((r) => r.id)

    const posts = await db.RecruitPost.findAll({
      where: { id: { [Op.in]: postIds } },
      include: [
        {
          model: db.RecruitAttributeAssignment,
          as: 'attributeAssignments',
          include: ['attribute', 'value']
        }
      ],
      order: [['createdAt', 'DESC']]
    })

    return {
      totalItems: rawResults.length,
      posts,
      totalPages: Math.ceil(rawResults.length / limit),
      currentPage: page
    }
  } catch (error) {
    throw new ServiceException(error.message, STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

const bulkUpdateStatus = async (ids, status) => {
  try {
    await db.RecruitPost.update(
      { status },
      {
        where: { id: ids }
      }
    )
    return true
  } catch (error) {
    throw error
  }
}

const updateStatusRecruitPost = async (id, status) => {
  try {
    const post = await db.RecruitPost.findByPk(id)
    if (!post) throw new ServiceException('RecruitPost not found', STATUS_CODE.NOT_FOUND)

    await post.update({ status })
    return post
  } catch (error) {
    throw error
  }
}

const restoreRecruitPost = async (id) => {
  try {
    const post = await db.RecruitPost.findOne({
      where: { id },
      paranoid: false
    })
    if (!post) throw new ServiceException('RecruitPost not found', STATUS_CODE.NOT_FOUND)

    await post.restore()
    return post
  } catch (error) {
    throw error
  }
}

const permanentlyDeleteRecruitPost = async (id) => {
  try {
    const post = await db.RecruitPost.findOne({
      where: { id },
      paranoid: false
    })
    if (!post) throw new ServiceException('RecruitPost not found', STATUS_CODE.NOT_FOUND)

    await post.destroy({ force: true })
    return true
  } catch (error) {
    throw error
  }
}

const getRecruitPostsByUser = async (userId, query) => {
  try {
    const page = parseInt(query.page, 10) || 1
    const limit = parseInt(query.limit, 10) || 10
    const offset = (page - 1) * limit

    const { count, rows } = await db.RecruitPost.findAndCountAll({
      where: { createdBy: userId },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: db.RecruitAttributeAssignment,
          as: 'attributeAssignments',
          include: ['attribute', 'value']
        }
      ],
      distinct: true
    })

    return {
      totalItems: count,
      posts: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    }
  } catch (error) {
    throw error
  }
}

const extendDeadline = async (id, newDeadline) => {
  try {
    const post = await db.RecruitPost.findByPk(id)
    if (!post) throw new ServiceException('RecruitPost not found', STATUS_CODE.NOT_FOUND)

    await post.update({ deadline: newDeadline })
    return post
  } catch (error) {
    throw error
  }
}

const countCandidatesByRecruitPost = async (postId) => {
  try {
    const count = await db.RecruitCandidate.count({ where: { recruitPostId: postId } })
    return count
  } catch (error) {
    throw error
  }
}

const getAlmostExpiredPosts = async (days = 3) => {
  try {
    const dateLimit = new Date()
    dateLimit.setDate(dateLimit.getDate() + days)

    const posts = await db.RecruitPost.findAll({
      where: {
        deadline: {
          [Op.lte]: dateLimit
        },
        status: 'published'
      },
      order: [['deadline', 'ASC']]
    })

    return posts
  } catch (error) {
    throw error
  }
}

/**
 * [NEW] Tạo bài đăng + gán thuộc tính động trong 1 transaction
 * @param {object} data - Dữ liệu bài đăng, gồm field tĩnh + attributes động
 * {
 *   title, status, ... // các field tĩnh
 *   attributes: [
 *     { attributeId, attributeValueId },
 *     { attributeId, customValue }
 *   ]
 * }
 */
const fullCreateRecruitPost = async (data) => {
  const t = await db.sequelize.transaction()
  try {
    const { attributes = [], ...postData } = data

    const post = await db.RecruitPost.create(postData, { transaction: t })

    for (const attr of attributes) {
      await db.RecruitAttributeAssignment.create(
        {
          recruitPostId: post.id,
          attributeId: attr.attributeId,
          attributeValueId: attr.attributeValueId,
          customValue: attr.customValue
        },
        { transaction: t }
      )
    }

    await t.commit()

    return await db.RecruitPost.findByPk(post.id, {
      include: [
        {
          model: db.RecruitAttributeAssignment,
          as: 'attributeAssignments',
          include: ['attribute', 'value']
        }
      ]
    })
  } catch (error) {
    await t.rollback()
    throw error
  }
}

/**
 * [NEW] Update bài đăng + thuộc tính động trong 1 transaction
 * @param {number} id - ID bài đăng cần update
 * @param {object} data - Dữ liệu update, gồm field tĩnh + attributes động
 * {
 *   title, status, ... // các field tĩnh
 *   attributes: [
 *     { attributeId, attributeValueId },
 *     { attributeId, customValue }
 *   ]
 * }
 */
const fullUpdateRecruitPost = async (id, data) => {
  const t = await db.sequelize.transaction()
  try {
    const { attributes = [], ...postData } = data

    const post = await db.RecruitPost.findByPk(id, { transaction: t })
    if (!post) throw new ServiceException('RecruitPost not found', STATUS_CODE.NOT_FOUND)
    await post.update(postData, { transaction: t })

    await db.RecruitAttributeAssignment.destroy({ where: { recruitPostId: id }, transaction: t })

    for (const attr of attributes) {
      await db.RecruitAttributeAssignment.create(
        {
          recruitPostId: id,
          attributeId: attr.attributeId,
          attributeValueId: attr.attributeValueId,
          customValue: attr.customValue
        },
        { transaction: t }
      )
    }

    await t.commit()

    return await db.RecruitPost.findByPk(id, {
      include: [
        {
          model: db.RecruitAttributeAssignment,
          as: 'attributeAssignments',
          include: ['attribute', 'value']
        }
      ]
    })
  } catch (error) {
    await t.rollback()
    throw error
  }
}

module.exports = {
  createRecruitPost,
  getAllRecruitPosts,
  getRecruitPostById,
  getRecruitPostBySlug,
  updateRecruitPost,
  deleteRecruitPost,
  getPublishedRecruitPosts,
  getDraftRecruitPosts,
  filterRecruitPosts,
  bulkUpdateStatus,
  updateStatusRecruitPost,
  restoreRecruitPost,
  permanentlyDeleteRecruitPost,
  getRecruitPostsByUser,
  extendDeadline,
  countCandidatesByRecruitPost,
  getAlmostExpiredPosts,
  fullCreateRecruitPost,
  fullUpdateRecruitPost
}
